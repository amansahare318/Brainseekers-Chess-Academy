"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
require("express-async-errors");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const coach_routes_1 = __importDefault(require("./routes/coach.routes"));
const batch_routes_1 = __importDefault(require("./routes/batch.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const assignment_routes_1 = __importDefault(require("./routes/assignment.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const gallery_routes_1 = __importDefault(require("./routes/gallery.routes"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
(0, env_1.validateEnv)();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: env_1.env.corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
}));
app.use(express_1.default.json({ limit: '1mb' }));
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: env_1.env.isProduction ? 200 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' },
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: env_1.env.isProduction ? 20 : 100,
    message: { message: 'Too many login attempts, please try again later' },
});
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/otp', authLimiter);
(0, db_1.connectDB)();
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', env: env_1.env.nodeEnv });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/leads', lead_routes_1.default);
app.use('/api/students', student_routes_1.default);
app.use('/api/coaches', coach_routes_1.default);
app.use('/api/batches', batch_routes_1.default);
app.use('/api/attendance', attendance_routes_1.default);
app.use('/api/assignments', assignment_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/certificates', certificate_routes_1.default);
app.use('/api/blog', blog_routes_1.default);
app.use('/api/gallery', gallery_routes_1.default);
app.use('/api/otp', otp_routes_1.default);
app.use('/api/uploads', upload_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use(error_middleware_1.errorHandler);
app.listen(env_1.env.port, () => {
    console.log(`Server running on port ${env_1.env.port} (${env_1.env.nodeEnv})`);
});
