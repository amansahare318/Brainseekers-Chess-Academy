"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubmissions = exports.submitAssignment = exports.deleteAssignment = exports.updateAssignment = exports.listAssignments = exports.createAssignment = void 0;
const assignment_model_1 = require("../models/assignment.model");
const assignmentSubmission_model_1 = require("../models/assignmentSubmission.model");
const student_model_1 = require("../models/student.model");
const user_model_1 = require("../models/user.model");
const createAssignment = async (req, res, next) => {
    try {
        const { title, description, coach, batch, dueDate, attachments } = req.body;
        if (!title || !description || !coach || !batch || !dueDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const doc = await assignment_model_1.Assignment.create({
            title,
            description,
            coach,
            batch,
            dueDate: new Date(dueDate),
            attachments: attachments || [],
        });
        res.status(201).json(await doc.populate(['coach', 'batch']));
    }
    catch (err) {
        next(err);
    }
};
exports.createAssignment = createAssignment;
const listAssignments = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        let filter = {};
        if (req.user.role === user_model_1.Role.COACH && user?.profileRef) {
            filter = { coach: user.profileRef };
        }
        else if (req.user.role === user_model_1.Role.STUDENT && user?.profileRef) {
            const student = await student_model_1.Student.findById(user.profileRef);
            if (student?.batch)
                filter = { batch: student.batch };
            else
                return res.json([]);
        }
        else if (req.user.role === user_model_1.Role.ADMIN && req.query.batchId) {
            filter = { batch: req.query.batchId };
        }
        const assignments = await assignment_model_1.Assignment.find(filter)
            .populate('coach', 'name title')
            .populate('batch', 'name')
            .sort({ dueDate: -1 });
        if (req.user.role === user_model_1.Role.STUDENT && user?.profileRef) {
            const subs = await assignmentSubmission_model_1.AssignmentSubmission.find({ student: user.profileRef });
            const subMap = new Map(subs.map((s) => [String(s.assignment), s]));
            return res.json(assignments.map((a) => ({
                ...a.toObject(),
                submission: subMap.get(String(a._id)) || null,
            })));
        }
        if (req.user.role === user_model_1.Role.ADMIN) {
            const counts = await assignmentSubmission_model_1.AssignmentSubmission.aggregate([
                { $group: { _id: '$assignment', submissionCount: { $sum: 1 } } },
            ]);
            const countMap = new Map(counts.map((c) => [String(c._id), c.submissionCount]));
            return res.json(assignments.map((a) => ({
                ...a.toObject(),
                submissionCount: countMap.get(String(a._id)) || 0,
            })));
        }
        res.json(assignments);
    }
    catch (err) {
        next(err);
    }
};
exports.listAssignments = listAssignments;
const updateAssignment = async (req, res, next) => {
    try {
        const doc = await assignment_model_1.Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate([
            'coach',
            'batch',
        ]);
        if (!doc)
            return next({ status: 404, message: 'Assignment not found' });
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
};
exports.updateAssignment = updateAssignment;
const deleteAssignment = async (req, res, next) => {
    try {
        const doc = await assignment_model_1.Assignment.findByIdAndDelete(req.params.id);
        if (!doc)
            return next({ status: 404, message: 'Assignment not found' });
        await assignmentSubmission_model_1.AssignmentSubmission.deleteMany({ assignment: doc._id });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteAssignment = deleteAssignment;
const submitAssignment = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user?.profileRef)
            return res.status(400).json({ message: 'Student profile not linked' });
        const { assignmentId, content, attachmentUrl } = req.body;
        if (!assignmentId || !content) {
            return res.status(400).json({ message: 'assignmentId and content are required' });
        }
        const submission = await assignmentSubmission_model_1.AssignmentSubmission.findOneAndUpdate({ assignment: assignmentId, student: user.profileRef }, {
            assignment: assignmentId,
            student: user.profileRef,
            content,
            attachmentUrl,
            submittedAt: new Date(),
        }, { upsert: true, new: true });
        res.status(201).json(submission);
    }
    catch (err) {
        next(err);
    }
};
exports.submitAssignment = submitAssignment;
const listSubmissions = async (req, res, next) => {
    try {
        const { assignmentId } = req.query;
        const filter = {};
        if (assignmentId)
            filter.assignment = assignmentId;
        const subs = await assignmentSubmission_model_1.AssignmentSubmission.find(filter)
            .populate('student', 'studentId name')
            .populate('assignment', 'title dueDate')
            .sort({ submittedAt: -1 });
        res.json(subs);
    }
    catch (err) {
        next(err);
    }
};
exports.listSubmissions = listSubmissions;
