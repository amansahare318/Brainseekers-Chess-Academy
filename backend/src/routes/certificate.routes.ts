import { Router } from 'express';
import {
  createCertificate,
  listCertificates,
  deleteCertificate,
  getCertificate,
  downloadCertificate,
} from '../controllers/certificate.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { certificateCreateSchema } from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.use(verifyToken);

router.get('/', authorize(Role.ADMIN, Role.STUDENT), listCertificates);
router.get('/:id/download', authorize(Role.ADMIN, Role.STUDENT), downloadCertificate);
router.get('/:id', authorize(Role.ADMIN, Role.STUDENT), getCertificate);
router.post('/', authorize(Role.ADMIN), validate(certificateCreateSchema), createCertificate);
router.delete('/:id', authorize(Role.ADMIN), deleteCertificate);

export default router;
