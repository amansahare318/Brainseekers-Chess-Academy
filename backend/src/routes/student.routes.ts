import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getParentChildren,
} from '../controllers/student.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  studentCreateSchema,
  studentUpdateSchema,
  studentListQuerySchema,
} from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.use(verifyToken);
router.get('/parent/children', authorize(Role.PARENT), getParentChildren);
router.use(authorize(Role.ADMIN, Role.COACH));

router.get('/', validate(studentListQuerySchema, 'query'), getStudents);
router.post('/', validate(studentCreateSchema), createStudent);
router.get('/:id', getStudentById);
router.patch('/:id', validate(studentUpdateSchema), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
