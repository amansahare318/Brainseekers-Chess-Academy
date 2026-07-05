"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message || 'Validation error' });
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: 'Duplicate entry' });
    }
    const status = err.status ?? err.statusCode ?? 500;
    const message = status >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message ?? 'Internal Server Error';
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).json({ message });
};
exports.errorHandler = errorHandler;
