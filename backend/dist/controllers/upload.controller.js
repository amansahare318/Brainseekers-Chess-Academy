"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageHandler = exports.uploadImageHandler = void 0;
const cloudinary_service_1 = require("../services/cloudinary.service");
const uploadImageHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        (0, cloudinary_service_1.validateImageFile)(req.file.mimetype, req.file.size);
        const folder = req.body.folder || 'general';
        const result = await (0, cloudinary_service_1.uploadImage)(req.file.buffer, folder, req.file.mimetype);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.uploadImageHandler = uploadImageHandler;
const deleteImageHandler = async (req, res, next) => {
    try {
        const publicId = decodeURIComponent(req.params.publicId || '');
        if (!publicId) {
            return res.status(400).json({ message: 'publicId is required' });
        }
        await (0, cloudinary_service_1.deleteImage)(publicId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteImageHandler = deleteImageHandler;
