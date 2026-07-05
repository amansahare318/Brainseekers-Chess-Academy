"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLead = exports.updateLead = exports.getLeadById = exports.getLeads = exports.createLead = void 0;
const lead_model_1 = require("../models/lead.model");
const parent_model_1 = require("../models/parent.model");
const student_model_1 = require("../models/student.model");
const idGenerator_service_1 = require("../services/idGenerator.service");
const authService = __importStar(require("../services/auth.service"));
const user_model_1 = require("../models/user.model");
const ALLOWED_STATUSES = [
    'New',
    'Contacted',
    'Trial Scheduled',
    'Trial Completed',
    'Approved',
    'Rejected',
];
const normalizeMobile = (mobile) => mobile.replace(/\D/g, '');
const createLead = async (req, res, next) => {
    try {
        const { studentName, age, chessLevel, parentName, parentMobile, parentEmail, city, address, studentMobile, learningGoal, } = req.body;
        const lead = await lead_model_1.Lead.create({
            studentName: String(studentName).trim(),
            age: Number(age),
            chessLevel: String(chessLevel).trim(),
            parentName: String(parentName).trim(),
            parentMobile: normalizeMobile(String(parentMobile)),
            parentEmail: parentEmail ? String(parentEmail).trim().toLowerCase() : undefined,
            city: String(city).trim(),
            address: address ? String(address).trim() : undefined,
            studentMobile: studentMobile ? normalizeMobile(String(studentMobile)) : undefined,
            learningGoal: String(learningGoal).trim(),
            status: 'New',
        });
        res.status(201).json(lead);
    }
    catch (err) {
        next(err);
    }
};
exports.createLead = createLead;
const getLeads = async (_req, res, next) => {
    try {
        const leads = await lead_model_1.Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    }
    catch (err) {
        next(err);
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res, next) => {
    try {
        const lead = await lead_model_1.Lead.findById(req.params.id);
        if (!lead)
            return next({ status: 404, message: 'Lead not found' });
        res.json(lead);
    }
    catch (err) {
        next(err);
    }
};
exports.getLeadById = getLeadById;
const updateLead = async (req, res, next) => {
    try {
        const lead = await lead_model_1.Lead.findById(req.params.id);
        if (!lead)
            return next({ status: 404, message: 'Lead not found' });
        const { status, trialDate, trialTime, parentEmail, address, studentMobile, learningGoal } = req.body;
        if (status !== undefined) {
            if (!ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({ message: 'Invalid lead status' });
            }
            if (lead.status === 'Approved' && status !== 'Approved') {
                return res.status(400).json({ message: 'Approved leads cannot change status' });
            }
            lead.status = status;
        }
        if (trialDate !== undefined)
            lead.trialDate = trialDate ? new Date(trialDate) : undefined;
        if (trialTime !== undefined)
            lead.trialTime = trialTime;
        if (parentEmail !== undefined)
            lead.parentEmail = parentEmail;
        if (address !== undefined)
            lead.address = address;
        if (studentMobile !== undefined)
            lead.studentMobile = studentMobile ? normalizeMobile(studentMobile) : undefined;
        if (learningGoal !== undefined)
            lead.learningGoal = learningGoal;
        if (status === 'Trial Scheduled' && trialDate && !lead.trialDate) {
            lead.trialDate = new Date(trialDate);
        }
        await lead.save();
        res.json(lead);
    }
    catch (err) {
        next(err);
    }
};
exports.updateLead = updateLead;
const convertLead = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const { coachId, batchId } = req.body;
        const lead = await lead_model_1.Lead.findById(leadId);
        if (!lead)
            return next({ status: 404, message: 'Lead not found' });
        if (lead.status === 'Approved') {
            return res.status(400).json({ message: 'Lead is already converted' });
        }
        let parent = await parent_model_1.Parent.findOne({ mobile: lead.parentMobile });
        if (!parent) {
            parent = await parent_model_1.Parent.create({
                name: lead.parentName,
                mobile: lead.parentMobile,
                email: lead.parentEmail,
                address: lead.address,
                students: [],
            });
        }
        const studentId = await (0, idGenerator_service_1.generateStudentId)();
        const student = await student_model_1.Student.create({
            studentId,
            name: lead.studentName,
            age: lead.age,
            chessLevel: lead.chessLevel,
            parent: parent._id,
            city: lead.city,
            address: lead.address,
            mobile: lead.studentMobile,
            ...(coachId ? { coach: coachId } : {}),
            ...(batchId ? { batch: batchId } : {}),
        });
        parent.students.push(student._id);
        await parent.save();
        lead.status = 'Approved';
        await lead.save();
        const credentials = {};
        const parentMobile = parent.mobile.replace(/\D/g, '');
        const studentMobile = (lead.studentMobile || parent.mobile).replace(/\D/g, '');
        if (!(await user_model_1.User.findOne({ mobile: parentMobile, role: user_model_1.Role.PARENT }))) {
            const parentTemp = authService.generateTempPassword();
            await authService.registerUser({
                mobile: parentMobile,
                email: lead.parentEmail,
                password: parentTemp,
                role: user_model_1.Role.PARENT,
                name: parent.name,
                profileRef: String(parent._id),
                mustChangePassword: true,
            });
            credentials.parent = { mobile: parentMobile, temporaryPassword: parentTemp };
        }
        if (!(await user_model_1.User.findOne({ mobile: studentMobile, role: user_model_1.Role.STUDENT }))) {
            const studentTemp = authService.generateTempPassword();
            await authService.registerUser({
                mobile: studentMobile,
                password: studentTemp,
                role: user_model_1.Role.STUDENT,
                name: student.name,
                profileRef: String(student._id),
                mustChangePassword: true,
            });
            credentials.student = { mobile: studentMobile, temporaryPassword: studentTemp };
        }
        res.status(201).json({ lead, student, credentials });
    }
    catch (err) {
        next(err);
    }
};
exports.convertLead = convertLead;
