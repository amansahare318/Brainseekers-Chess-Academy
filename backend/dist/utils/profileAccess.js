"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileRef = getUserProfileRef;
exports.canAccessStudent = canAccessStudent;
exports.toObjectId = toObjectId;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const parent_model_1 = require("../models/parent.model");
const student_model_1 = require("../models/student.model");
async function getUserProfileRef(userId) {
    const user = await user_model_1.User.findById(userId);
    return user?.profileRef;
}
async function canAccessStudent(userId, role, studentId) {
    if (role === user_model_1.Role.ADMIN)
        return true;
    const profileRef = await getUserProfileRef(userId);
    if (!profileRef)
        return false;
    if (role === user_model_1.Role.STUDENT) {
        return String(profileRef) === studentId;
    }
    if (role === user_model_1.Role.PARENT) {
        const parent = await parent_model_1.Parent.findById(profileRef);
        return parent?.students.some((s) => String(s) === studentId) ?? false;
    }
    if (role === user_model_1.Role.COACH) {
        const student = await student_model_1.Student.findById(studentId);
        return Boolean(student?.coach && String(student.coach) === String(profileRef));
    }
    return false;
}
function toObjectId(id) {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return new mongoose_1.Types.ObjectId(id);
}
