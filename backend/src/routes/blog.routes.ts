import { Router } from 'express';
import {
  listPublicBlogs,
  getPublicBlogBySlug,
  listAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { blogCreateSchema, blogUpdateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.get('/public', listPublicBlogs);
router.get('/public/:slug', getPublicBlogBySlug);

router.use(verifyToken, authorize(Role.ADMIN));
router.get('/', listAdminBlogs);
router.post('/', validate(blogCreateSchema), createBlog);
router.patch('/:id', validate(blogUpdateSchema), updateBlog);
router.delete('/:id', deleteBlog);

export default router;
