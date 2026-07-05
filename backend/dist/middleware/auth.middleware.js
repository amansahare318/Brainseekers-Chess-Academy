"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = () => process.env.JWT_SECRET || 'dev-secret-change-in-production';
const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const token = header.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret());
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};
exports.authorize = authorize;
