"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const mongoose_1 = require("mongoose");
const BatchSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    schedule: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    coach: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Coach' },
}, { timestamps: true });
BatchSchema.index({ coach: 1 });
BatchSchema.index({ startDate: -1 });
exports.Batch = (0, mongoose_1.model)('Batch', BatchSchema);
