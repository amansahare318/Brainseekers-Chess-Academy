"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const LEAD_STATUSES = [
    'New',
    'Contacted',
    'Trial Scheduled',
    'Trial Completed',
    'Approved',
    'Rejected',
];
const LeadSchema = new mongoose_1.Schema({
    studentName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 4, max: 99 },
    chessLevel: { type: String, required: true, trim: true },
    parentName: { type: String, required: true, trim: true },
    parentMobile: { type: String, required: true, trim: true },
    parentEmail: { type: String, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    studentMobile: { type: String, trim: true },
    learningGoal: { type: String, required: true, trim: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'New' },
    trialDate: { type: Date },
    trialTime: { type: String, trim: true },
}, { timestamps: true });
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ parentMobile: 1 });
exports.Lead = (0, mongoose_1.model)('Lead', LeadSchema);
