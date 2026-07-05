import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { settingsUpdateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.get('/', getSettings);
router.patch('/', verifyToken, authorize(Role.ADMIN), validate(settingsUpdateSchema), updateSettings);

export default router;
