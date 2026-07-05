"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = exports.deleteGalleryImage = exports.createGalleryImage = exports.listGallery = void 0;
const gallery_model_1 = require("../models/gallery.model");
const listGallery = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category)
            filter.category = req.query.category;
        const images = await gallery_model_1.GalleryImage.find(filter).sort({ createdAt: -1 });
        res.json(images);
    }
    catch (err) {
        next(err);
    }
};
exports.listGallery = listGallery;
const createGalleryImage = async (req, res, next) => {
    try {
        const { title, imageUrl, imagePublicId, category } = req.body;
        const image = await gallery_model_1.GalleryImage.create({
            title,
            imageUrl,
            imagePublicId,
            category: category || 'General',
        });
        res.status(201).json(image);
    }
    catch (err) {
        next(err);
    }
};
exports.createGalleryImage = createGalleryImage;
const deleteGalleryImage = async (req, res, next) => {
    try {
        const image = await gallery_model_1.GalleryImage.findByIdAndDelete(req.params.id);
        if (!image)
            return next({ status: 404, message: 'Image not found' });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteGalleryImage = deleteGalleryImage;
const listCategories = async (_req, res, next) => {
    try {
        const categories = await gallery_model_1.GalleryImage.distinct('category');
        res.json(categories);
    }
    catch (err) {
        next(err);
    }
};
exports.listCategories = listCategories;
