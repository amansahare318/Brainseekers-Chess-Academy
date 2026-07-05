import { Router } from 'express';
import {
  getCoachMe,
  listCoaches,
  createCoachProfile,
  linkCoachUser,
  getPublicCoaches,
} from '../controllers/coach.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { coachCreateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.get('/public', getPublicCoaches);

router.use(verifyToken);

router.get('/me', authorize(Role.COACH), getCoachMe);
router.get('/', authorize(Role.ADMIN, Role.COACH), listCoaches);
router.post('/', authorize(Role.ADMIN), validate(coachCreateSchema), createCoachProfile);
router.post('/:id/link-user', authorize(Role.ADMIN), linkCoachUser);

export default router;
