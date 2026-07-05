import { Response, NextFunction } from 'express';
import { Role } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import * as authService from '../services/auth.service';

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, mobile, password, role } = req.body;
    const expectedRole = role && Object.values(Role).includes(role) ? (role as Role) : undefined;
    const result = await authService.login({ email, mobile, password, expectedRole });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, mobile, password, role, name, profileRef, mustChangePassword } = req.body;
    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }
    const user = await authService.registerUser({
      email,
      mobile,
      password,
      role,
      name,
      profileRef,
      mustChangePassword,
    });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await authService.getUserById(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const provisionCredentials = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { role, profileRef, mobile, email, name, password } = req.body;

    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }
    if (role !== Role.STUDENT && role !== Role.PARENT) {
      return res.status(400).json({ message: 'Only student and parent temp credentials can be provisioned' });
    }
    if (!profileRef) {
      return res.status(400).json({ message: 'profileRef (student or parent document id) is required' });
    }

    const tempPassword = password || authService.generateTempPassword();

    const user = await authService.registerUser({
      email,
      mobile,
      password: tempPassword,
      role,
      name,
      profileRef,
      mustChangePassword: true,
    });

    res.status(201).json({
      user,
      temporaryPassword: tempPassword,
      message: 'Share this temporary password securely with the user. They must change it on first login.',
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, mobile, role } = req.body;
    const expectedRole = role && Object.values(Role).includes(role) ? (role as Role) : undefined;
    const result = await authService.requestPasswordReset({ email, mobile, role: expectedRole });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPasswordWithToken(token, newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
