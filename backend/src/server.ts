import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { connectDB } from './config/db';
import { validateEnv, env } from './config/env';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import studentRoutes from './routes/student.routes';
import coachRoutes from './routes/coach.routes';
import batchRoutes from './routes/batch.routes';
import attendanceRoutes from './routes/attendance.routes';
import assignmentRoutes from './routes/assignment.routes';
import reportRoutes from './routes/report.routes';
import certificateRoutes from './routes/certificate.routes';
import blogRoutes from './routes/blog.routes';
import galleryRoutes from './routes/gallery.routes';
import otpRoutes from './routes/otp.routes';
import uploadRoutes from './routes/upload.routes';
import settingsRoutes from './routes/settings.routes';
import { errorHandler } from './middleware/error.middleware';

validateEnv();

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: env.corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 20 : 100,
  message: { message: 'Too many login attempts, please try again later' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/otp', authLimiter);

connectDB();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.nodeEnv });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
});
