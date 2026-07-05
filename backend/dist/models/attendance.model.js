"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongoose_1 = require("mongoose");
const AttendanceSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    batch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Batch', required: true },
    coach: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Coach', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    remarks: { type: String, trim: true },
}, { timestamps: true });
AttendanceSchema.index({ student: 1, batch: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ batch: 1, date: -1 });
AttendanceSchema.index({ date: 1 });
exports.Attendance = (0, mongoose_1.model)('Attendance', AttendanceSchema);
