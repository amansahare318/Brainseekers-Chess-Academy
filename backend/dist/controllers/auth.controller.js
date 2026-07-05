"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.provisionCredentials = exports.changePassword = exports.me = exports.register = exports.login = void 0;
const user_model_1 = require("../models/user.model");
const authService = __importStar(require("../services/auth.service"));
const login = async (req, res, next) => {
    try {
        const { email, mobile, password, role } = req.body;
        const expectedRole = role && Object.values(user_model_1.Role).includes(role) ? role : undefined;
        const result = await authService.login({ email, mobile, password, expectedRole });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const register = async (req, res, next) => {
    try {
        const { email, mobile, password, role, name, profileRef, mustChangePassword } = req.body;
        if (!role || !Object.values(user_model_1.Role).includes(role)) {
            return res.status(400).json({ message: 'Valid role is required' });
        }
        const user = await authService.registerUser({
            email,
            mobile,
            password,
            role,
            name,
            profileRef,
            mustChangePassword,
        });
        res.status(201).json({ user });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const me = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await authService.getUserById(req.user.id);
        res.json({ user });
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
const changePassword = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }
        const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.changePassword = changePassword;
const provisionCredentials = async (req, res, next) => {
    try {
        const { role, profileRef, mobile, email, name, password } = req.body;
        if (!role || !Object.values(user_model_1.Role).includes(role)) {
            return res.status(400).json({ message: 'Valid role is required' });
        }
        if (role !== user_model_1.Role.STUDENT && role !== user_model_1.Role.PARENT) {
            return res.status(400).json({ message: 'Only student and parent temp credentials can be provisioned' });
        }
        if (!profileRef) {
            return res.status(400).json({ message: 'profileRef (student or parent document id) is required' });
        }
        const tempPassword = password || authService.generateTempPassword();
        const user = await authService.registerUser({
            email,
            mobile,
            password: tempPassword,
            role,
            name,
            profileRef,
            mustChangePassword: true,
        });
        res.status(201).json({
            user,
            temporaryPassword: tempPassword,
            message: 'Share this temporary password securely with the user. They must change it on first login.',
        });
    }
    catch (err) {
        next(err);
    }
};
exports.provisionCredentials = provisionCredentials;
const logout = (_req, res) => {
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const forgotPassword = async (req, res, next) => {
    try {
        const { email, mobile, role } = req.body;
        const expectedRole = role && Object.values(user_model_1.Role).includes(role) ? role : undefined;
        const result = await authService.requestPasswordReset({ email, mobile, role: expectedRole });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPasswordWithToken(token, newPassword);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
