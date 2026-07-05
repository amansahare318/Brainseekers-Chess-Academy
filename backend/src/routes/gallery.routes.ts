import { Router } from 'express';
import {
  listGallery,
  createGalleryImage,
  deleteGalleryImage,
  listCategories,
} from '../controllers/gallery.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { galleryCreateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.get('/', listGallery);
router.get('/categories', listCategories);

router.use(verifyToken, authorize(Role.ADMIN));
router.post('/', validate(galleryCreateSchema), createGalleryImage);
router.delete('/:id', deleteGalleryImage);

export default router;
