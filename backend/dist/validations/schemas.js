"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsUpdateSchema = exports.cloudinaryAssetSchema = exports.galleryCreateSchema = exports.blogUpdateSchema = exports.blogCreateSchema = exports.certificateCreateSchema = exports.reportCreateSchema = exports.assignmentCreateSchema = exports.attendanceUpdateSchema = exports.attendanceBulkSchema = exports.attendanceCreateSchema = exports.batchAssignStudentsSchema = exports.batchUpdateSchema = exports.batchCreateSchema = exports.coachCreateSchema = exports.studentListQuerySchema = exports.studentUpdateSchema = exports.studentCreateSchema = exports.leadConvertSchema = exports.leadUpdateSchema = exports.leadCreateSchema = exports.provisionSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const user_model_1 = require("../models/user.model");
const objectId = joi_1.default.string().hex().length(24);
const password = joi_1.default.string().min(8).max(128);
const mobile = joi_1.default.string().pattern(/^[\d+\-\s()]{7,15}$/);
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim(),
    mobile: mobile,
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid(...Object.values(user_model_1.Role)),
}).or('email', 'mobile');
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim(),
    mobile: mobile,
    password: password.required(),
    role: joi_1.default.string()
        .valid(...Object.values(user_model_1.Role))
        .required(),
    name: joi_1.default.string().trim().max(120),
    profileRef: objectId,
    mustChangePassword: joi_1.default.boolean(),
}).or('email', 'mobile');
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: password.required(),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim(),
    mobile: mobile,
    role: joi_1.default.string().valid(user_model_1.Role.ADMIN, user_model_1.Role.COACH, user_model_1.Role.STUDENT, user_model_1.Role.PARENT),
}).or('email', 'mobile');
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    newPassword: password.required(),
});
exports.provisionSchema = joi_1.default.object({
    role: joi_1.default.string().valid(user_model_1.Role.STUDENT, user_model_1.Role.PARENT).required(),
    profileRef: objectId.required(),
    mobile: mobile,
    email: joi_1.default.string().email().lowercase().trim(),
    name: joi_1.default.string().trim().max(120),
    password: password,
});
exports.leadCreateSchema = joi_1.default.object({
    studentName: joi_1.default.string().trim().min(2).max(120).required(),
    age: joi_1.default.number().integer().min(4).max(25).required(),
    chessLevel: joi_1.default.string().trim().required(),
    parentName: joi_1.default.string().trim().min(2).max(120).required(),
    parentMobile: joi_1.default.string().min(7).max(20).required(),
    parentEmail: joi_1.default.string().email().lowercase().trim().allow(''),
    city: joi_1.default.string().trim().required(),
    learningGoal: joi_1.default.string().trim().default(''),
    address: joi_1.default.string().trim().allow(''),
    studentMobile: joi_1.default.string().trim().allow(''),
});
exports.leadUpdateSchema = joi_1.default.object({
    status: joi_1.default.string().valid('New', 'Contacted', 'Trial Scheduled', 'Trial Completed', 'Approved', 'Rejected'),
    trialDate: joi_1.default.string().isoDate().allow(''),
    trialTime: joi_1.default.string().trim().allow(''),
    assignedCoach: objectId.allow(''),
    notes: joi_1.default.string().trim().max(2000).allow(''),
}).min(1);
exports.leadConvertSchema = joi_1.default.object({
    coachId: objectId,
    batchId: objectId,
});
exports.studentCreateSchema = joi_1.default.object({
    studentId: joi_1.default.string().trim().required(),
    name: joi_1.default.string().trim().min(2).max(120).required(),
    age: joi_1.default.number().integer().min(4).max(25).required(),
    chessLevel: joi_1.default.string().trim().required(),
    parent: objectId.required(),
    coach: objectId,
    batch: objectId,
    city: joi_1.default.string().trim().required(),
    address: joi_1.default.string().trim().allow(''),
    mobile: mobile.allow(''),
    photoUrl: joi_1.default.string().uri().allow(''),
    photoPublicId: joi_1.default.string().trim().allow(''),
});
exports.studentUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120),
    age: joi_1.default.number().integer().min(4).max(25),
    chessLevel: joi_1.default.string().trim(),
    parent: objectId,
    coach: objectId.allow(null, ''),
    batch: objectId.allow(null, ''),
    city: joi_1.default.string().trim(),
    address: joi_1.default.string().trim().allow(''),
    mobile: mobile.allow(''),
    photoUrl: joi_1.default.string().uri().allow(''),
    photoPublicId: joi_1.default.string().trim().allow(''),
}).min(1);
exports.studentListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1),
    limit: joi_1.default.number().integer().min(1).max(50),
    search: joi_1.default.string().trim().allow(''),
    batchId: objectId,
    coachId: objectId,
    chessLevel: joi_1.default.string().trim(),
});
exports.coachCreateSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120).required(),
    email: joi_1.default.string().email().lowercase().trim().required(),
    title: joi_1.default.string().trim().required(),
    elo: joi_1.default.string().trim().required(),
    photoUrl: joi_1.default.string().uri().allow(''),
    photoPublicId: joi_1.default.string().trim().allow(''),
    password: password,
});
exports.batchCreateSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120).required(),
    schedule: joi_1.default.string().trim().allow(''),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')),
    coach: objectId,
});
exports.batchUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120),
    schedule: joi_1.default.string().trim().allow(''),
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().allow(null),
    coach: objectId.allow(null, ''),
}).min(1);
exports.batchAssignStudentsSchema = joi_1.default.object({
    studentIds: joi_1.default.array().items(objectId).required(),
});
exports.attendanceCreateSchema = joi_1.default.object({
    student: objectId.required(),
    batch: objectId.required(),
    coach: objectId.required(),
    date: joi_1.default.date().iso().required(),
    status: joi_1.default.string().valid('Present', 'Absent', 'Late').required(),
    remarks: joi_1.default.string().trim().max(500).allow(''),
});
exports.attendanceBulkSchema = joi_1.default.object({
    records: joi_1.default.array().items(exports.attendanceCreateSchema).min(1).max(100).required(),
});
exports.attendanceUpdateSchema = joi_1.default.object({
    status: joi_1.default.string().valid('Present', 'Absent', 'Late'),
    remarks: joi_1.default.string().trim().max(500).allow(''),
}).min(1);
exports.assignmentCreateSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).required(),
    description: joi_1.default.string().trim().required(),
    coach: objectId.required(),
    batch: objectId.required(),
    dueDate: joi_1.default.date().iso().required(),
    attachments: joi_1.default.array().items(joi_1.default.object({ name: joi_1.default.string().required(), url: joi_1.default.string().uri().required() })),
});
exports.reportCreateSchema = joi_1.default.object({
    student: objectId.required(),
    coach: objectId.required(),
    tacticalSkills: joi_1.default.number().min(0).max(10).required(),
    openingKnowledge: joi_1.default.number().min(0).max(10).required(),
    endgameSkills: joi_1.default.number().min(0).max(10).required(),
    tournamentPerformance: joi_1.default.number().min(0).max(10).required(),
    discipline: joi_1.default.number().min(0).max(10).required(),
    remarks: joi_1.default.string().trim().max(2000).required(),
    rating: joi_1.default.number().min(0).max(3000).required(),
});
exports.certificateCreateSchema = joi_1.default.object({
    student: objectId.required(),
    certificateName: joi_1.default.string().trim().min(2).max(200).required(),
    issueDate: joi_1.default.date().iso(),
    description: joi_1.default.string().trim().max(1000).allow(''),
});
exports.blogCreateSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).required(),
    content: joi_1.default.string().required(),
    featuredImage: joi_1.default.string().uri().allow(''),
    featuredImagePublicId: joi_1.default.string().trim().allow(''),
    published: joi_1.default.boolean(),
    slug: joi_1.default.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).allow(''),
});
exports.blogUpdateSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200),
    content: joi_1.default.string(),
    featuredImage: joi_1.default.string().uri().allow(''),
    featuredImagePublicId: joi_1.default.string().trim().allow(''),
    published: joi_1.default.boolean(),
    slug: joi_1.default.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).allow(''),
}).min(1);
exports.galleryCreateSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(1).max(200).required(),
    imageUrl: joi_1.default.string().uri().required(),
    imagePublicId: joi_1.default.string().trim().allow(''),
    category: joi_1.default.string().trim().default('General'),
});
exports.cloudinaryAssetSchema = joi_1.default.object({
    url: joi_1.default.string().uri().allow(''),
    publicId: joi_1.default.string().trim().allow(''),
});
exports.settingsUpdateSchema = joi_1.default.object({
    academyName: joi_1.default.string().trim().max(200).allow(''),
    tagline: joi_1.default.string().trim().max(300).allow(''),
    description: joi_1.default.string().trim().max(5000).allow(''),
    logo: exports.cloudinaryAssetSchema,
    mobile: joi_1.default.string().trim().allow(''),
    whatsapp: joi_1.default.string().trim().allow(''),
    email: joi_1.default.string().email().lowercase().trim().allow(''),
    address: joi_1.default.string().trim().allow(''),
    city: joi_1.default.string().trim().allow(''),
    state: joi_1.default.string().trim().allow(''),
    country: joi_1.default.string().trim().allow(''),
    facebook: joi_1.default.string().uri().allow(''),
    instagram: joi_1.default.string().uri().allow(''),
    youtube: joi_1.default.string().uri().allow(''),
    linkedin: joi_1.default.string().uri().allow(''),
    signatureName: joi_1.default.string().trim().allow(''),
    signatureTitle: joi_1.default.string().trim().allow(''),
    certificateTemplate: exports.cloudinaryAssetSchema,
}).min(1);
