"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpCode = void 0;
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    mobile: { type: String, required: true, index: true },
    code: { type: String, required: true },
    role: { type: String, enum: ['student', 'parent'], required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
OtpSchema.index({ mobile: 1, role: 1 });
exports.OtpCode = (0, mongoose_1.model)('OtpCode', OtpSchema);
