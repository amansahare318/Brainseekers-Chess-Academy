"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getStudents = exports.getParentChildren = void 0;
const student_model_1 = require("../models/student.model");
const user_model_1 = require("../models/user.model");
const parent_model_1 = require("../models/parent.model");
const getParentChildren = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user?.profileRef)
            return res.json([]);
        const parent = await parent_model_1.Parent.findById(user.profileRef);
        if (!parent)
            return res.json([]);
        const students = await student_model_1.Student.find({ _id: { $in: parent.students } })
            .populate(['parent', 'coach', 'batch'])
            .sort({ createdAt: -1 });
        res.json(students);
    }
    catch (err) {
        next(err);
    }
};
exports.getParentChildren = getParentChildren;
const getStudents = async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
        const search = String(req.query.search || '').trim();
        const batchId = req.query.batchId;
        const coachId = req.query.coachId;
        const chessLevel = req.query.chessLevel;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
            ];
        }
        if (batchId)
            filter.batch = batchId;
        if (coachId)
            filter.coach = coachId;
        if (chessLevel)
            filter.chessLevel = chessLevel;
        const total = await student_model_1.Student.countDocuments(filter);
        const students = await student_model_1.Student.find(filter)
            .populate(['parent', 'coach', 'batch'])
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({
            students,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getStudents = getStudents;
const getStudentById = async (req, res, next) => {
    try {
        const student = await student_model_1.Student.findById(req.params.id).populate(['parent', 'coach', 'batch']);
        if (!student)
            return next({ status: 404, message: 'Student not found' });
        res.json(student);
    }
    catch (err) {
        next(err);
    }
};
exports.getStudentById = getStudentById;
const createStudent = async (req, res, next) => {
    try {
        const student = await student_model_1.Student.create(req.body);
        res.status(201).json(await student.populate(['parent', 'coach', 'batch']));
    }
    catch (err) {
        next(err);
    }
};
exports.createStudent = createStudent;
const updateStudent = async (req, res, next) => {
    try {
        const allowed = ['name', 'age', 'chessLevel', 'parent', 'coach', 'batch', 'city', 'address', 'mobile', 'photoUrl', 'photoPublicId'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined)
                updates[key] = req.body[key];
        }
        const student = await student_model_1.Student.findByIdAndUpdate(req.params.id, updates, { new: true }).populate([
            'parent',
            'coach',
            'batch',
        ]);
        if (!student)
            return next({ status: 404, message: 'Student not found' });
        res.json(student);
    }
    catch (err) {
        next(err);
    }
};
exports.updateStudent = updateStudent;
const deleteStudent = async (req, res, next) => {
    try {
        const student = await student_model_1.Student.findByIdAndDelete(req.params.id);
        if (!student)
            return next({ status: 404, message: 'Student not found' });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteStudent = deleteStudent;
