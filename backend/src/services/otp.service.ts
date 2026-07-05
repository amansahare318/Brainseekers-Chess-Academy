import { OtpCode } from '../models/otp.model';
import { User, Role } from '../models/user.model';
import { signToken, toPublicUser, LoginResult } from './auth.service';

const OTP_TTL_MS = 10 * 60 * 1000;
const MOCK_OTP = '123456';

export interface OtpService {
  requestOtp(mobile: string, role: 'student' | 'parent'): Promise<{ message: string; mockCode?: string }>;
  verifyOtp(mobile: string, role: 'student' | 'parent', code: string): Promise<LoginResult>;
}

export class MockOtpService implements OtpService {
  async requestOtp(mobile: string, role: 'student' | 'parent') {
    const normalized = mobile.replace(/\D/g, '');
    const code = process.env.NODE_ENV === 'production' ? String(Math.floor(100000 + Math.random() * 900000)) : MOCK_OTP;

    await OtpCode.deleteMany({ mobile: normalized, role });
    await OtpCode.create({
      mobile: normalized,
      code,
      role,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    return {
      message: 'OTP sent (mock)',
      mockCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    };
  }

  async verifyOtp(mobile: string, role: 'student' | 'parent', code: string) {
    const normalized = mobile.replace(/\D/g, '');
    const record = await OtpCode.findOne({ mobile: normalized, role, verified: false });
    if (!record || record.code !== code || record.expiresAt < new Date()) {
      throw { status: 401, message: 'Invalid or expired OTP' };
    }

    record.verified = true;
    await record.save();

    const userRole = role === 'student' ? Role.STUDENT : Role.PARENT;
    const user = await User.findOne({ mobile: normalized, role: userRole });
    if (!user || !user.isActive) {
      throw { status: 401, message: 'No account found for this mobile number' };
    }

    const token = signToken({
      id: String(user._id),
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });

    return { token, user: toPublicUser(user) };
  }
}

export const otpService = new MockOtpService();
