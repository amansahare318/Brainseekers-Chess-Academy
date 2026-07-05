"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryImage = void 0;
const mongoose_1 = require("mongoose");
const GallerySchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    category: { type: String, required: true, trim: true, default: 'General' },
}, { timestamps: true });
GallerySchema.index({ category: 1, createdAt: -1 });
exports.GalleryImage = (0, mongoose_1.model)('GalleryImage', GallerySchema);
