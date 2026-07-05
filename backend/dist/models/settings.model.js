"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademySettings = void 0;
const mongoose_1 = require("mongoose");
const CloudinaryAssetSchema = new mongoose_1.Schema({
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
}, { _id: false });
const SettingsSchema = new mongoose_1.Schema({
    academyName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: CloudinaryAssetSchema, default: () => ({}) },
    mobile: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    signatureName: { type: String, default: '' },
    signatureTitle: { type: String, default: '' },
    certificateTemplate: { type: CloudinaryAssetSchema, default: () => ({}) },
}, { timestamps: true });
exports.AcademySettings = (0, mongoose_1.model)('AcademySettings', SettingsSchema);
