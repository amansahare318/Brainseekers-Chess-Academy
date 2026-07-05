import { Router } from 'express';
import multer from 'multer';
import { uploadImageHandler, deleteImageHandler } from '../controllers/upload.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(verifyToken);

router.post('/image', upload.single('image'), uploadImageHandler);
router.delete('/image/:publicId(*)', deleteImageHandler);

export default router;
