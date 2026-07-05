import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  convertLead,
} from '../controllers/lead.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { leadCreateSchema, leadUpdateSchema, leadConvertSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.post('/', validate(leadCreateSchema), createLead);
router.get('/', verifyToken, authorize(Role.ADMIN), getLeads);
router.get('/:id', verifyToken, authorize(Role.ADMIN), getLeadById);
router.patch('/:id', verifyToken, authorize(Role.ADMIN), validate(leadUpdateSchema), updateLead);
router.post('/:id/convert', verifyToken, authorize(Role.ADMIN), validate(leadConvertSchema), convertLead);

export default router;
