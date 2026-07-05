"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parent = void 0;
const mongoose_1 = require("mongoose");
const ParentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Student' }],
    createdAt: { type: Date, default: Date.now },
});
exports.Parent = (0, mongoose_1.model)('Parent', ParentSchema);
