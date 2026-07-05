"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressReport = void 0;
const mongoose_1 = require("mongoose");
const ProgressReportSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    coach: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Coach', required: true },
    tacticalSkills: { type: Number, required: true, min: 0, max: 10 },
    openingKnowledge: { type: Number, required: true, min: 0, max: 10 },
    endgameSkills: { type: Number, required: true, min: 0, max: 10 },
    tournamentPerformance: { type: Number, required: true, min: 0, max: 10 },
    discipline: { type: Number, required: true, min: 0, max: 10 },
    remarks: { type: String, default: '' },
    rating: { type: Number, required: true, min: 0 },
}, { timestamps: true });
ProgressReportSchema.index({ student: 1, createdAt: -1 });
ProgressReportSchema.index({ coach: 1 });
exports.ProgressReport = (0, mongoose_1.model)('ProgressReport', ProgressReportSchema);
