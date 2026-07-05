import { Router } from 'express';
import {
  createAssignment,
  listAssignments,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  listSubmissions,
} from '../controllers/assignment.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { assignmentCreateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.use(verifyToken);

router.get('/submissions', authorize(Role.ADMIN, Role.COACH), listSubmissions);
router.post('/submit', authorize(Role.STUDENT), submitAssignment);
router.get('/', authorize(Role.ADMIN, Role.COACH, Role.STUDENT), listAssignments);
router.post('/', authorize(Role.ADMIN, Role.COACH), validate(assignmentCreateSchema), createAssignment);
router.patch('/:id', authorize(Role.ADMIN, Role.COACH), updateAssignment);
router.delete('/:id', authorize(Role.ADMIN, Role.COACH), deleteAssignment);

export default router;
