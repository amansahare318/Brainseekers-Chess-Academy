"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = void 0;
const mongoose_1 = require("mongoose");
const CertificateSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    certificateName: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true, default: Date.now },
    description: { type: String, trim: true },
}, { timestamps: true });
CertificateSchema.index({ student: 1, issueDate: -1 });
exports.Certificate = (0, mongoose_1.model)('Certificate', CertificateSchema);
