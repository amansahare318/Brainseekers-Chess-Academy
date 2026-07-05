import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadImage, deleteImage, validateImageFile } from '../services/cloudinary.service';

export const uploadImageHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    validateImageFile(req.file.mimetype, req.file.size);
    const folder = (req.body.folder as string) || 'general';
    const result = await uploadImage(req.file.buffer, folder, req.file.mimetype);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteImageHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId || '');
    if (!publicId) {
      return res.status(400).json({ message: 'publicId is required' });
    }
    await deleteImage(publicId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
