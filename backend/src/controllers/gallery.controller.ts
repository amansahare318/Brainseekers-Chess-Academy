import { Response, NextFunction } from 'express';
import { GalleryImage } from '../models/gallery.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const listGallery = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category) filter.category = req.query.category;
    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
};

export const createGalleryImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, imageUrl, imagePublicId, category } = req.body;
    const image = await GalleryImage.create({
      title,
      imageUrl,
      imagePublicId,
      category: category || 'General',
    });
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

export const deleteGalleryImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return next({ status: 404, message: 'Image not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const listCategories = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await GalleryImage.distinct('category');
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
