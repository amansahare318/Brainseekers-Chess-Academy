import { Router } from 'express';
import {
  login,
  register,
  me,
  changePassword,
  provisionCredentials,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  provisionSchema,
} from '../validations/schemas';
import { Role } from '../models/user.model';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', verifyToken, me);
router.post('/change-password', verifyToken, validate(changePasswordSchema), changePassword);
router.post('/register', verifyToken, authorize(Role.ADMIN), validate(registerSchema), register);
router.post(
  '/provision',
  verifyToken,
  authorize(Role.ADMIN),
  validate(provisionSchema),
  provisionCredentials
);

export default router;
