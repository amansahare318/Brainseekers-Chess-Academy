"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset = void 0;
const mongoose_1 = require("mongoose");
const PasswordResetSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.PasswordReset = (0, mongoose_1.model)('PasswordReset', PasswordResetSchema);
