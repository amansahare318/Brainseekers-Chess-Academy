"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.requestOtp = void 0;
const otp_service_1 = require("../services/otp.service");
const requestOtp = async (req, res, next) => {
    try {
        const { mobile, role } = req.body;
        if (!mobile || !role || !['student', 'parent'].includes(role)) {
            return res.status(400).json({ message: 'mobile and role (student|parent) are required' });
        }
        const result = await otp_service_1.otpService.requestOtp(mobile, role);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.requestOtp = requestOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const { mobile, role, code } = req.body;
        if (!mobile || !role || !code) {
            return res.status(400).json({ message: 'mobile, role, and code are required' });
        }
        const result = await otp_service_1.otpService.verifyOtp(mobile, role, code);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.verifyOtp = verifyOtp;
