import { Request, Response, NextFunction } from 'express';
import { otpService } from '../services/otp.service';

export const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile, role } = req.body;
    if (!mobile || !role || !['student', 'parent'].includes(role)) {
      return res.status(400).json({ message: 'mobile and role (student|parent) are required' });
    }
    const result = await otpService.requestOtp(mobile, role);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile, role, code } = req.body;
    if (!mobile || !role || !code) {
      return res.status(400).json({ message: 'mobile, role, and code are required' });
    }
    const result = await otpService.verifyOtp(mobile, role, code);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
