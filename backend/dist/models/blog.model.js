"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    featuredImagePublicId: { type: String },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
}, { timestamps: true });
BlogSchema.index({ published: 1, createdAt: -1 });
exports.BlogPost = (0, mongoose_1.model)('BlogPost', BlogSchema);
