"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    chessLevel: { type: String, required: true },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Parent', required: true },
    coach: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Coach' },
    batch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Batch' },
    city: { type: String, required: true },
    address: { type: String },
    mobile: { type: String },
    photoUrl: { type: String },
    photoPublicId: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.Student = (0, mongoose_1.model)('Student', StudentSchema);
