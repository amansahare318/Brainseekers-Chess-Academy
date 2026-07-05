"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentSubmission = void 0;
const mongoose_1 = require("mongoose");
const SubmissionSchema = new mongoose_1.Schema({
    assignment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    content: { type: String, required: true },
    attachmentUrl: { type: String },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
exports.AssignmentSubmission = (0, mongoose_1.model)('AssignmentSubmission', SubmissionSchema);
