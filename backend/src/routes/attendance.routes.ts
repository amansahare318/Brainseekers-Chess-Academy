import { Router } from 'express';
import {
  createAttendance,
  bulkAttendance,
  listAttendance,
  getByStudent,
  getByBatch,
  updateAttendance,
  monthlyStats,
  coachMarkingContext,
} from '../controllers/attendance.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  attendanceCreateSchema,
  attendanceBulkSchema,
  attendanceUpdateSchema,
} from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.use(verifyToken);

router.get('/stats', authorize(Role.ADMIN), monthlyStats);
router.get('/coach/context', authorize(Role.COACH), coachMarkingContext);
router.get('/student/:id', authorize(Role.ADMIN, Role.COACH, Role.STUDENT, Role.PARENT), getByStudent);
router.get('/batch/:id', authorize(Role.ADMIN, Role.COACH), getByBatch);
router.post('/bulk', authorize(Role.ADMIN, Role.COACH), validate(attendanceBulkSchema), bulkAttendance);
router.post('/', authorize(Role.ADMIN, Role.COACH), validate(attendanceCreateSchema), createAttendance);
router.get('/', authorize(Role.ADMIN), listAttendance);
router.patch('/:id', authorize(Role.ADMIN, Role.COACH), validate(attendanceUpdateSchema), updateAttendance);

export default router;
