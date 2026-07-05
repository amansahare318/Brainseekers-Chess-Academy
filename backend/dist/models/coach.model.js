"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coach = void 0;
const mongoose_1 = require("mongoose");
const CoachSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    elo: { type: String, required: true },
    photoUrl: { type: String },
    photoPublicId: { type: String },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Coach = (0, mongoose_1.model)('Coach', CoachSchema);
