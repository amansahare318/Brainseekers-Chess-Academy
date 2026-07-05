"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = exports.MockOtpService = void 0;
const otp_model_1 = require("../models/otp.model");
const user_model_1 = require("../models/user.model");
const auth_service_1 = require("./auth.service");
const OTP_TTL_MS = 10 * 60 * 1000;
const MOCK_OTP = '123456';
class MockOtpService {
    async requestOtp(mobile, role) {
        const normalized = mobile.replace(/\D/g, '');
        const code = process.env.NODE_ENV === 'production' ? String(Math.floor(100000 + Math.random() * 900000)) : MOCK_OTP;
        await otp_model_1.OtpCode.deleteMany({ mobile: normalized, role });
        await otp_model_1.OtpCode.create({
            mobile: normalized,
            code,
            role,
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
        });
        return {
            message: 'OTP sent (mock)',
            mockCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        };
    }
    async verifyOtp(mobile, role, code) {
        const normalized = mobile.replace(/\D/g, '');
        const record = await otp_model_1.OtpCode.findOne({ mobile: normalized, role, verified: false });
        if (!record || record.code !== code || record.expiresAt < new Date()) {
            throw { status: 401, message: 'Invalid or expired OTP' };
        }
        record.verified = true;
        await record.save();
        const userRole = role === 'student' ? user_model_1.Role.STUDENT : user_model_1.Role.PARENT;
        const user = await user_model_1.User.findOne({ mobile: normalized, role: userRole });
        if (!user || !user.isActive) {
            throw { status: 401, message: 'No account found for this mobile number' };
        }
        const token = (0, auth_service_1.signToken)({
            id: String(user._id),
            role: user.role,
            mustChangePassword: user.mustChangePassword,
        });
        return { token, user: (0, auth_service_1.toPublicUser)(user) };
    }
}
exports.MockOtpService = MockOtpService;
exports.otpService = new MockOtpService();
