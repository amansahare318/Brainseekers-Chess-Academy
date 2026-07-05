"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const mongoose_1 = require("mongoose");
const AssignmentSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coach: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Coach', required: true },
    batch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Batch', required: true },
    dueDate: { type: Date, required: true },
    attachments: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
}, { timestamps: true });
AssignmentSchema.index({ batch: 1, dueDate: -1 });
AssignmentSchema.index({ coach: 1 });
exports.Assignment = (0, mongoose_1.model)('Assignment', AssignmentSchema);
