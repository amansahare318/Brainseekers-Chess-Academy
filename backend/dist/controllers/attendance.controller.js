"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachMarkingContext = exports.monthlyStats = exports.updateAttendance = exports.getByBatch = exports.getByStudent = exports.listAttendance = exports.bulkAttendance = exports.createAttendance = void 0;
const attendance_model_1 = require("../models/attendance.model");
const student_model_1 = require("../models/student.model");
const batch_model_1 = require("../models/batch.model");
const user_model_1 = require("../models/user.model");
const profileAccess_1 = require("../utils/profileAccess");
const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};
const normalizeRecord = async (body) => {
    const date = startOfDay(new Date(body.date));
    return {
        student: body.student,
        batch: body.batch,
        coach: body.coach,
        date,
        status: body.status,
        remarks: body.remarks,
    };
};
const createAttendance = async (req, res, next) => {
    try {
        const record = await normalizeRecord(req.body);
        const existing = await attendance_model_1.Attendance.findOne({
            student: record.student,
            batch: record.batch,
            date: record.date,
        });
        if (existing) {
            existing.status = record.status;
            existing.remarks = record.remarks;
            existing.coach = (0, profileAccess_1.toObjectId)(record.coach);
            await existing.save();
            return res.json(await existing.populate(['student', 'batch', 'coach']));
        }
        const doc = await attendance_model_1.Attendance.create(record);
        res.status(201).json(await doc.populate(['student', 'batch', 'coach']));
    }
    catch (err) {
        next(err);
    }
};
exports.createAttendance = createAttendance;
const bulkAttendance = async (req, res, next) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'records array is required' });
        }
        const results = [];
        for (const r of records) {
            const record = await normalizeRecord(r);
            const doc = await attendance_model_1.Attendance.findOneAndUpdate({ student: record.student, batch: record.batch, date: record.date }, record, { upsert: true, new: true });
            results.push(doc);
        }
        res.status(201).json(results);
    }
    catch (err) {
        next(err);
    }
};
exports.bulkAttendance = bulkAttendance;
const listAttendance = async (req, res, next) => {
    try {
        const { month, year, batchId } = req.query;
        const filter = {};
        if (batchId)
            filter.batch = batchId;
        if (month && year) {
            const m = Number(month) - 1;
            const y = Number(year);
            const from = new Date(y, m, 1);
            const to = new Date(y, m + 1, 0, 23, 59, 59);
            filter.date = { $gte: from, $lte: to };
        }
        const list = await attendance_model_1.Attendance.find(filter)
            .populate('student', 'studentId name')
            .populate('batch', 'name')
            .populate('coach', 'name')
            .sort({ date: -1 });
        res.json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.listAttendance = listAttendance;
const getByStudent = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        if (req.user && req.user.role !== user_model_1.Role.ADMIN) {
            const allowed = await (0, profileAccess_1.canAccessStudent)(req.user.id, req.user.role, studentId);
            if (!allowed)
                return res.status(403).json({ message: 'Forbidden' });
        }
        const list = await attendance_model_1.Attendance.find({ student: studentId })
            .populate('batch', 'name schedule')
            .populate('coach', 'name')
            .sort({ date: -1 });
        res.json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getByStudent = getByStudent;
const getByBatch = async (req, res, next) => {
    try {
        const { date } = req.query;
        const filter = { batch: req.params.id };
        if (date)
            filter.date = startOfDay(new Date(String(date)));
        const list = await attendance_model_1.Attendance.find(filter)
            .populate('student', 'studentId name')
            .populate('coach', 'name')
            .sort({ 'student.name': 1 });
        res.json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getByBatch = getByBatch;
const updateAttendance = async (req, res, next) => {
    try {
        const doc = await attendance_model_1.Attendance.findById(req.params.id);
        if (!doc)
            return next({ status: 404, message: 'Attendance not found' });
        const { status, remarks } = req.body;
        if (status)
            doc.status = status;
        if (remarks !== undefined)
            doc.remarks = remarks;
        await doc.save();
        res.json(await doc.populate(['student', 'batch', 'coach']));
    }
    catch (err) {
        next(err);
    }
};
exports.updateAttendance = updateAttendance;
const monthlyStats = async (req, res, next) => {
    try {
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const year = Number(req.query.year) || new Date().getFullYear();
        const from = new Date(year, month - 1, 1);
        const to = new Date(year, month, 0, 23, 59, 59);
        const stats = await attendance_model_1.Attendance.aggregate([
            { $match: { date: { $gte: from, $lte: to } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const byBatch = await attendance_model_1.Attendance.aggregate([
            { $match: { date: { $gte: from, $lte: to } } },
            {
                $group: {
                    _id: '$batch',
                    present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                    absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
                    late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
                    total: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'batches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'batch',
                },
            },
            { $unwind: { path: '$batch', preserveNullAndEmptyArrays: true } },
        ]);
        const totalStudents = await student_model_1.Student.countDocuments();
        res.json({
            month,
            year,
            totals: stats,
            byBatch,
            totalStudents,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.monthlyStats = monthlyStats;
const coachMarkingContext = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user?.profileRef)
            return res.json({ batches: [] });
        const batches = await batch_model_1.Batch.find({ coach: user.profileRef });
        const batchIds = batches.map((b) => b._id);
        const students = await student_model_1.Student.find({ batch: { $in: batchIds } }).select('studentId name batch');
        res.json({ batches, students, coachId: String(user.profileRef) });
    }
    catch (err) {
        next(err);
    }
};
exports.coachMarkingContext = coachMarkingContext;
