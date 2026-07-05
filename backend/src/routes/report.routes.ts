import { Router } from 'express';
import { createReport, listReports, updateReport, getReportForStudent } from '../controllers/report.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { reportCreateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.use(verifyToken);

router.get('/student/:studentId', authorize(Role.ADMIN, Role.COACH, Role.STUDENT, Role.PARENT), getReportForStudent);
router.get('/', authorize(Role.ADMIN, Role.COACH, Role.STUDENT, Role.PARENT), listReports);
router.post('/', authorize(Role.ADMIN, Role.COACH), validate(reportCreateSchema), createReport);
router.patch('/:id', authorize(Role.ADMIN, Role.COACH), updateReport);

export default router;
