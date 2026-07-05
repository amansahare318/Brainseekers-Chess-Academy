"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageFile = validateImageFile;
exports.uploadImage = uploadImage;
exports.deleteImage = deleteImage;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
cloudinary_1.v2.config({
    cloud_name: env_1.env.cloudinaryCloudName,
    api_key: env_1.env.cloudinaryApiKey,
    api_secret: env_1.env.cloudinaryApiSecret,
});
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024;
function validateImageFile(mimetype, size) {
    if (!ALLOWED_MIME.has(mimetype)) {
        throw { status: 400, message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
    }
    if (size > MAX_BYTES) {
        throw { status: 400, message: 'File too large. Maximum size is 5MB' };
    }
}
async function uploadImage(buffer, folder, mimetype) {
    if (!env_1.env.cloudinaryCloudName || !env_1.env.cloudinaryApiKey || !env_1.env.cloudinaryApiSecret) {
        throw { status: 503, message: 'Cloudinary is not configured' };
    }
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder: `brainseekers/${folder}`,
            resource_type: 'image',
            format: mimetype.split('/')[1] === 'jpeg' ? 'jpg' : mimetype.split('/')[1],
        }, (err, result) => {
            if (err || !result) {
                reject({ status: 500, message: err?.message || 'Upload failed' });
                return;
            }
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        stream.end(buffer);
    });
}
async function deleteImage(publicId) {
    if (!publicId) {
        throw { status: 400, message: 'publicId is required' };
    }
    if (!env_1.env.cloudinaryCloudName) {
        throw { status: 503, message: 'Cloudinary is not configured' };
    }
    await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: 'image' });
}
