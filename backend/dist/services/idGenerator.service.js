"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudentId = void 0;
const counter_model_1 = require("../models/counter.model");
/**
 * Returns the next sequential student ID in the format BCA-2026-XXX
 */
const generateStudentId = async () => {
    const result = await counter_model_1.Counter.findOneAndUpdate({ name: 'studentId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    const seqNum = result?.seq ?? 1;
    const padded = String(seqNum).padStart(3, '0');
    return `BCA-2026-${padded}`;
};
exports.generateStudentId = generateStudentId;
