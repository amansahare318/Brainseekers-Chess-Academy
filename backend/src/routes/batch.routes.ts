import { Router } from 'express';
import {
  listBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  assignBatchStudents,
  getMyBatch,
} from '../controllers/batch.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { batchCreateSchema, batchUpdateSchema, batchAssignStudentsSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.use(verifyToken);

router.get('/my', authorize(Role.STUDENT), getMyBatch);
router.get('/', authorize(Role.ADMIN, Role.COACH), listBatches);
router.get('/:id', authorize(Role.ADMIN, Role.COACH), getBatchById);
router.post('/', authorize(Role.ADMIN), validate(batchCreateSchema), createBatch);
router.patch('/:id', authorize(Role.ADMIN), validate(batchUpdateSchema), updateBatch);
router.delete('/:id', authorize(Role.ADMIN), deleteBatch);
router.post('/:id/students', authorize(Role.ADMIN), validate(batchAssignStudentsSchema), assignBatchStudents);

export default router;
