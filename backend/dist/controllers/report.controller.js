"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportForStudent = exports.updateReport = exports.listReports = exports.createReport = void 0;
const progressReport_model_1 = require("../models/progressReport.model");
const user_model_1 = require("../models/user.model");
const parent_model_1 = require("../models/parent.model");
const profileAccess_1 = require("../utils/profileAccess");
const createReport = async (req, res, next) => {
    try {
        const doc = await progressReport_model_1.ProgressReport.create(req.body);
        res.status(201).json(await doc.populate(['student', 'coach']));
    }
    catch (err) {
        next(err);
    }
};
exports.createReport = createReport;
const listReports = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        let filter = {};
        if (req.user.role === user_model_1.Role.COACH && user?.profileRef) {
            filter = { coach: user.profileRef };
        }
        else if (req.user.role === user_model_1.Role.STUDENT && user?.profileRef) {
            filter = { student: user.profileRef };
        }
        else if (req.user.role === user_model_1.Role.PARENT && user?.profileRef) {
            const parent = await parent_model_1.Parent.findById(user.profileRef);
            if (req.query.studentId) {
                const sid = String(req.query.studentId);
                const linked = parent?.students.some((s) => String(s) === sid);
                if (!linked)
                    return res.status(403).json({ message: 'Forbidden' });
                filter = { student: sid };
            }
            else {
                filter = { student: { $in: parent?.students || [] } };
            }
        }
        else if (req.query.studentId) {
            filter = { student: req.query.studentId };
        }
        const reports = await progressReport_model_1.ProgressReport.find(filter)
            .populate('student', 'studentId name')
            .populate('coach', 'name title')
            .sort({ createdAt: -1 });
        res.json(reports);
    }
    catch (err) {
        next(err);
    }
};
exports.listReports = listReports;
const updateReport = async (req, res, next) => {
    try {
        const doc = await progressReport_model_1.ProgressReport.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate([
            'student',
            'coach',
        ]);
        if (!doc)
            return next({ status: 404, message: 'Report not found' });
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
};
exports.updateReport = updateReport;
const getReportForStudent = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        if (req.user && req.user.role !== user_model_1.Role.ADMIN && req.user.role !== user_model_1.Role.COACH) {
            const allowed = await (0, profileAccess_1.canAccessStudent)(req.user.id, req.user.role, studentId);
            if (!allowed)
                return res.status(403).json({ message: 'Forbidden' });
        }
        const reports = await progressReport_model_1.ProgressReport.find({ student: studentId })
            .populate('coach', 'name')
            .sort({ createdAt: -1 });
        res.json(reports);
    }
    catch (err) {
        next(err);
    }
};
exports.getReportForStudent = getReportForStudent;
