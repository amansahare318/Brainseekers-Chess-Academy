"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const dns_1 = __importDefault(require("dns"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_DB_NAME = 'brainseekers';
const buildMongoUri = () => {
    const uri = process.env.MONGODB_URI || '';
    if (!uri)
        return '';
    const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
    if (uri.includes('mongodb.net/') && !uri.match(/mongodb\.net\/[^/?]+/)) {
        return uri.replace('mongodb.net/', `mongodb.net/${dbName}`);
    }
    if (uri.endsWith('/') || uri.match(/:\d+\/?$/)) {
        return `${uri.replace(/\/?$/, '')}/${dbName}`;
    }
    return uri;
};
const connectDB = async () => {
    const MONGODB_URI = buildMongoUri();
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not set');
        process.exit(1);
    }
    try {
        // Attempt standard connection first using system resolver settings
        await mongoose_1.default.connect(MONGODB_URI);
        console.log(`✅ MongoDB connected (${mongoose_1.default.connection.name})`);
    }
    catch (error) {
        const errStr = String(error?.message || error);
        const isDnsError = errStr.includes('ENOTFOUND') ||
            errStr.includes('EREFUSED') ||
            errStr.includes('querySrv') ||
            errStr.includes('SERVFAIL');
        if (isDnsError) {
            console.warn('⚠️ DNS SRV lookup failed with default resolver. Trying with fallback DNS servers (8.8.8.8, 1.1.1.1)...');
            try {
                dns_1.default.setServers(['8.8.8.8', '1.1.1.1', ...dns_1.default.getServers()]);
                await mongoose_1.default.connect(MONGODB_URI);
                console.log(`✅ MongoDB connected with fallback DNS (${mongoose_1.default.connection.name})`);
                return;
            }
            catch (fallbackError) {
                console.error('❌ MongoDB connection failed with fallback DNS:', fallbackError);
            }
        }
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
