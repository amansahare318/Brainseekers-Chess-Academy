"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Role = void 0;
const mongoose_1 = require("mongoose");
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["COACH"] = "coach";
    Role["STUDENT"] = "student";
    Role["PARENT"] = "parent";
})(Role || (exports.Role = Role = {}));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    mobile: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    name: { type: String },
    profileRef: { type: mongoose_1.Schema.Types.ObjectId },
    mustChangePassword: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ role: 1 });
exports.User = (0, mongoose_1.model)('User', UserSchema);
