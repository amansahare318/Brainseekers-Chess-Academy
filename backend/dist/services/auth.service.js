"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordWithToken = exports.requestPasswordReset = exports.generateTempPassword = exports.getUserById = exports.changePassword = exports.registerUser = exports.login = exports.toPublicUser = exports.signToken = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const password_reset_model_1 = require("../models/password-reset.model");
const email_service_1 = require("./notifications/email.service");
const jwtSecret = () => process.env.JWT_SECRET || 'dev-secret-change-in-production';
const jwtExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';
const saltRounds = () => Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const hashPassword = (password) => bcrypt_1.default.hash(password, saltRounds());
exports.hashPassword = hashPassword;
const signToken = (payload) => jsonwebtoken_1.default.sign(payload, jwtSecret(), { expiresIn: jwtExpiresIn() });
exports.signToken = signToken;
const toPublicUser = (user) => ({
    id: String(user._id),
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    name: user.name,
    mustChangePassword: Boolean(user.mustChangePassword),
    profileRef: user.profileRef ? String(user.profileRef) : undefined,
});
exports.toPublicUser = toPublicUser;
const login = async (input) => {
    const { email, mobile, password, expectedRole } = input;
    if (!password) {
        throw { status: 400, message: 'Password is required' };
    }
    let user = null;
    if (email) {
        user = await user_model_1.User.findOne({ email: email.toLowerCase().trim() });
    }
    else if (mobile) {
        const normalized = mobile.replace(/\D/g, '');
        user = await user_model_1.User.findOne({
            $or: [{ mobile: normalized }, { mobile: mobile.trim() }],
        });
    }
    else {
        throw { status: 400, message: 'Email or mobile is required' };
    }
    if (!user || !user.isActive) {
        throw { status: 401, message: 'Invalid credentials' };
    }
    if (expectedRole && user.role !== expectedRole) {
        throw { status: 401, message: 'Invalid credentials for this portal' };
    }
    const valid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw { status: 401, message: 'Invalid credentials' };
    }
    const token = (0, exports.signToken)({
        id: String(user._id),
        role: user.role,
        mustChangePassword: user.mustChangePassword,
    });
    return { token, user: (0, exports.toPublicUser)(user) };
};
exports.login = login;
const registerUser = async (input) => {
    const { email, mobile, password, role, name, profileRef, mustChangePassword } = input;
    if (!email && !mobile) {
        throw { status: 400, message: 'Email or mobile is required' };
    }
    if (!password || password.length < 8) {
        throw { status: 400, message: 'Password must be at least 8 characters' };
    }
    if (email) {
        const exists = await user_model_1.User.findOne({ email: email.toLowerCase().trim() });
        if (exists)
            throw { status: 409, message: 'Email already registered' };
    }
    if (mobile) {
        const normalized = mobile.replace(/\D/g, '');
        const exists = await user_model_1.User.findOne({ mobile: normalized });
        if (exists)
            throw { status: 409, message: 'Mobile already registered' };
    }
    const passwordHash = await (0, exports.hashPassword)(password);
    const user = await user_model_1.User.create({
        email: email?.toLowerCase().trim(),
        mobile: mobile ? mobile.replace(/\D/g, '') : undefined,
        passwordHash,
        role,
        name,
        profileRef: profileRef ? new mongoose_1.Types.ObjectId(profileRef) : undefined,
        mustChangePassword: mustChangePassword ?? false,
        isActive: true,
    });
    return (0, exports.toPublicUser)(user);
};
exports.registerUser = registerUser;
const changePassword = async (userId, currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 8) {
        throw { status: 400, message: 'New password must be at least 8 characters' };
    }
    const user = await user_model_1.User.findById(userId);
    if (!user || !user.isActive) {
        throw { status: 404, message: 'User not found' };
    }
    const valid = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
    if (!valid) {
        throw { status: 401, message: 'Current password is incorrect' };
    }
    user.passwordHash = await (0, exports.hashPassword)(newPassword);
    user.mustChangePassword = false;
    await user.save();
    const token = (0, exports.signToken)({
        id: String(user._id),
        role: user.role,
        mustChangePassword: false,
    });
    return { token, user: (0, exports.toPublicUser)(user) };
};
exports.changePassword = changePassword;
const getUserById = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user || !user.isActive) {
        throw { status: 404, message: 'User not found' };
    }
    return (0, exports.toPublicUser)(user);
};
exports.getUserById = getUserById;
const generateTempPassword = () => {
    const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `BCA-${segment()}${segment()}`;
};
exports.generateTempPassword = generateTempPassword;
const hashResetToken = (token) => crypto_1.default.createHash('sha256').update(token).digest('hex');
const RESET_TTL_MS = 60 * 60 * 1000;
const requestPasswordReset = async (input) => {
    const { email, mobile, role } = input;
    let user = null;
    if (email) {
        user = await user_model_1.User.findOne({ email: email.toLowerCase().trim(), ...(role ? { role } : {}) });
    }
    else if (mobile) {
        const normalized = mobile.replace(/\D/g, '');
        user = await user_model_1.User.findOne({ mobile: normalized, ...(role ? { role } : {}) });
    }
    if (!user || !user.isActive) {
        return { message: 'If an account exists, a reset link has been sent.' };
    }
    const rawToken = crypto_1.default.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(rawToken);
    await password_reset_model_1.PasswordReset.deleteMany({ user: user._id, used: false });
    await password_reset_model_1.PasswordReset.create({
        user: user._id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
    });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login/reset-password?token=${rawToken}`;
    if (user.email) {
        await email_service_1.emailService.sendEmail({
            to: user.email,
            subject: 'BrainSeekers — Password Reset',
            body: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        });
    }
    const response = {
        message: 'If an account exists, a reset link has been sent.',
    };
    if (process.env.NODE_ENV !== 'production') {
        response.resetToken = rawToken;
        response.resetUrl = resetUrl;
    }
    return response;
};
exports.requestPasswordReset = requestPasswordReset;
const resetPasswordWithToken = async (token, newPassword) => {
    if (!newPassword || newPassword.length < 8) {
        throw { status: 400, message: 'New password must be at least 8 characters' };
    }
    const tokenHash = hashResetToken(token);
    const record = await password_reset_model_1.PasswordReset.findOne({ tokenHash, used: false });
    if (!record || record.expiresAt < new Date()) {
        throw { status: 400, message: 'Invalid or expired reset token' };
    }
    const user = await user_model_1.User.findById(record.user);
    if (!user || !user.isActive) {
        throw { status: 400, message: 'Invalid or expired reset token' };
    }
    user.passwordHash = await (0, exports.hashPassword)(newPassword);
    user.mustChangePassword = false;
    await user.save();
    record.used = true;
    await record.save();
    return { message: 'Password reset successful. You can sign in with your new password.' };
};
exports.resetPasswordWithToken = resetPasswordWithToken;
