"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.validateEnv = validateEnv;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];
function validateEnv() {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (process.env.NODE_ENV === 'production' && missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
    if (process.env.JWT_SECRET === 'dev-secret-change-in-production' && process.env.NODE_ENV === 'production') {
        console.error('JWT_SECRET must be changed in production');
        process.exit(1);
    }
}
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    isProduction: process.env.NODE_ENV === 'production',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
