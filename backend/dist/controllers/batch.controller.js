"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBatch = exports.assignBatchStudents = exports.deleteBatch = exports.updateBatch = exports.createBatch = exports.getBatchById = exports.listBatches = void 0;
const batch_model_1 = require("../models/batch.model");
const student_model_1 = require("../models/student.model");
const user_model_1 = require("../models/user.model");
const listBatches = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user?.role === user_model_1.Role.COACH) {
            const coachUser = await user_model_1.User.findById(req.user.id);
            if (!coachUser?.profileRef) {
                return res.json([]);
            }
            filter = { coach: coachUser.profileRef };
        }
        const batches = await batch_model_1.Batch.find(filter).populate('coach').sort({ startDate: -1 });
        const withCounts = await Promise.all(batches.map(async (batch) => {
            const studentCount = await student_model_1.Student.countDocuments({ batch: batch._id });
            return { ...batch.toObject(), studentCount };
        }));
        res.json(withCounts);
    }
    catch (err) {
        next(err);
    }
};
exports.listBatches = listBatches;
const getBatchById = async (req, res, next) => {
    try {
        const batch = await batch_model_1.Batch.findById(req.params.id).populate('coach');
        if (!batch)
            return next({ status: 404, message: 'Batch not found' });
        const students = await student_model_1.Student.find({ batch: batch._id })
            .select('studentId name age chessLevel mobile')
            .sort({ name: 1 });
        res.json({ batch, students });
    }
    catch (err) {
        next(err);
    }
};
exports.getBatchById = getBatchById;
const createBatch = async (req, res, next) => {
    try {
        const { name, schedule, startDate, endDate, coach } = req.body;
        if (!name || !startDate) {
            return res.status(400).json({ message: 'Name and start date are required' });
        }
        const batch = await batch_model_1.Batch.create({
            name: String(name).trim(),
            schedule: schedule ? String(schedule).trim() : undefined,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            coach: coach || undefined,
        });
        res.status(201).json(batch);
    }
    catch (err) {
        next(err);
    }
};
exports.createBatch = createBatch;
const updateBatch = async (req, res, next) => {
    try {
        const { name, schedule, startDate, endDate, coach } = req.body;
        const batch = await batch_model_1.Batch.findById(req.params.id);
        if (!batch)
            return next({ status: 404, message: 'Batch not found' });
        if (name !== undefined)
            batch.name = String(name).trim();
        if (schedule !== undefined)
            batch.schedule = schedule;
        if (startDate !== undefined)
            batch.startDate = new Date(startDate);
        if (endDate !== undefined)
            batch.endDate = endDate ? new Date(endDate) : undefined;
        if (coach !== undefined)
            batch.coach = coach || undefined;
        await batch.save();
        res.json(batch);
    }
    catch (err) {
        next(err);
    }
};
exports.updateBatch = updateBatch;
const deleteBatch = async (req, res, next) => {
    try {
        const batch = await batch_model_1.Batch.findByIdAndDelete(req.params.id);
        if (!batch)
            return next({ status: 404, message: 'Batch not found' });
        await student_model_1.Student.updateMany({ batch: batch._id }, { $unset: { batch: '' } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBatch = deleteBatch;
const assignBatchStudents = async (req, res, next) => {
    try {
        const batch = await batch_model_1.Batch.findById(req.params.id);
        if (!batch)
            return next({ status: 404, message: 'Batch not found' });
        const { studentIds } = req.body;
        if (!Array.isArray(studentIds)) {
            return res.status(400).json({ message: 'studentIds array is required' });
        }
        await student_model_1.Student.updateMany({ batch: batch._id }, { $unset: { batch: '' } });
        if (studentIds.length > 0) {
            await student_model_1.Student.updateMany({ _id: { $in: studentIds } }, { batch: batch._id });
        }
        const students = await student_model_1.Student.find({ batch: batch._id }).select('studentId name age chessLevel');
        res.json({ batch, students });
    }
    catch (err) {
        next(err);
    }
};
exports.assignBatchStudents = assignBatchStudents;
const getMyBatch = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user?.profileRef) {
            return res.status(404).json({ message: 'No student profile linked to this account' });
        }
        const student = await student_model_1.Student.findById(user.profileRef).populate({
            path: 'batch',
            populate: { path: 'coach' },
        });
        if (!student?.batch) {
            return res.status(404).json({ message: 'No batch assigned yet' });
        }
        res.json({
            batch: student.batch,
            student: { id: student._id, studentId: student.studentId, name: student.name },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyBatch = getMyBatch;
