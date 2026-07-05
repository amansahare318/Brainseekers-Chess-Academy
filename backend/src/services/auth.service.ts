import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User, IUser, Role } from '../models/user.model';
import { PasswordReset } from '../models/password-reset.model';
import { emailService } from './notifications/email.service';

export interface AuthTokenPayload {
  id: string;
  role: Role;
  mustChangePassword?: boolean;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email?: string;
    mobile?: string;
    role: Role;
    name?: string;
    mustChangePassword: boolean;
    profileRef?: string;
  };
}

const jwtSecret = () => process.env.JWT_SECRET || 'dev-secret-change-in-production';
const jwtExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';
const saltRounds = () => Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export const hashPassword = (password: string) => bcrypt.hash(password, saltRounds());

export const signToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, jwtSecret(), { expiresIn: jwtExpiresIn() } as jwt.SignOptions);

export const toPublicUser = (user: IUser) => ({
  id: String(user._id),
  email: user.email,
  mobile: user.mobile,
  role: user.role,
  name: user.name,
  mustChangePassword: Boolean(user.mustChangePassword),
  profileRef: user.profileRef ? String(user.profileRef) : undefined,
});

export const login = async (input: {
  email?: string;
  mobile?: string;
  password: string;
  expectedRole?: Role;
}): Promise<LoginResult> => {
  const { email, mobile, password, expectedRole } = input;

  if (!password) {
    throw { status: 400, message: 'Password is required' };
  }

  let user: IUser | null = null;

  if (email) {
    user = await User.findOne({ email: email.toLowerCase().trim() });
  } else if (mobile) {
    const normalized = mobile.replace(/\D/g, '');
    user = await User.findOne({
      $or: [{ mobile: normalized }, { mobile: mobile.trim() }],
    });
  } else {
    throw { status: 400, message: 'Email or mobile is required' };
  }

  if (!user || !user.isActive) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  if (expectedRole && user.role !== expectedRole) {
    throw { status: 401, message: 'Invalid credentials for this portal' };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = signToken({
    id: String(user._id),
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  });

  return { token, user: toPublicUser(user) };
};

export const registerUser = async (input: {
  email?: string;
  mobile?: string;
  password: string;
  role: Role;
  name?: string;
  profileRef?: string;
  mustChangePassword?: boolean;
}) => {
  const { email, mobile, password, role, name, profileRef, mustChangePassword } = input;

  if (!email && !mobile) {
    throw { status: 400, message: 'Email or mobile is required' };
  }
  if (!password || password.length < 8) {
    throw { status: 400, message: 'Password must be at least 8 characters' };
  }

  if (email) {
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) throw { status: 409, message: 'Email already registered' };
  }

  if (mobile) {
    const normalized = mobile.replace(/\D/g, '');
    const exists = await User.findOne({ mobile: normalized });
    if (exists) throw { status: 409, message: 'Mobile already registered' };
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    email: email?.toLowerCase().trim(),
    mobile: mobile ? mobile.replace(/\D/g, '') : undefined,
    passwordHash,
    role,
    name,
    profileRef: profileRef ? new Types.ObjectId(profileRef) : undefined,
    mustChangePassword: mustChangePassword ?? false,
    isActive: true,
  });

  return toPublicUser(user);
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  if (!newPassword || newPassword.length < 8) {
    throw { status: 400, message: 'New password must be at least 8 characters' };
  }

  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw { status: 404, message: 'User not found' };
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw { status: 401, message: 'Current password is incorrect' };
  }

  user.passwordHash = await hashPassword(newPassword);
  user.mustChangePassword = false;
  await user.save();

  const token = signToken({
    id: String(user._id),
    role: user.role,
    mustChangePassword: false,
  });

  return { token, user: toPublicUser(user) };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw { status: 404, message: 'User not found' };
  }
  return toPublicUser(user);
};

export const generateTempPassword = () => {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BCA-${segment()}${segment()}`;
};

const hashResetToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

const RESET_TTL_MS = 60 * 60 * 1000;

export const requestPasswordReset = async (input: {
  email?: string;
  mobile?: string;
  role?: Role;
}) => {
  const { email, mobile, role } = input;
  let user: IUser | null = null;

  if (email) {
    user = await User.findOne({ email: email.toLowerCase().trim(), ...(role ? { role } : {}) });
  } else if (mobile) {
    const normalized = mobile.replace(/\D/g, '');
    user = await User.findOne({ mobile: normalized, ...(role ? { role } : {}) });
  }

  if (!user || !user.isActive) {
    return { message: 'If an account exists, a reset link has been sent.' };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(rawToken);

  await PasswordReset.deleteMany({ user: user._id, used: false });
  await PasswordReset.create({
    user: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login/reset-password?token=${rawToken}`;

  if (user.email) {
    await emailService.sendEmail({
      to: user.email,
      subject: 'BrainSeekers — Password Reset',
      body: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    });
  }

  const response: { message: string; resetToken?: string; resetUrl?: string } = {
    message: 'If an account exists, a reset link has been sent.',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.resetToken = rawToken;
    response.resetUrl = resetUrl;
  }

  return response;
};

export const resetPasswordWithToken = async (token: string, newPassword: string) => {
  if (!newPassword || newPassword.length < 8) {
    throw { status: 400, message: 'New password must be at least 8 characters' };
  }

  const tokenHash = hashResetToken(token);
  const record = await PasswordReset.findOne({ tokenHash, used: false });
  if (!record || record.expiresAt < new Date()) {
    throw { status: 400, message: 'Invalid or expired reset token' };
  }

  const user = await User.findById(record.user);
  if (!user || !user.isActive) {
    throw { status: 400, message: 'Invalid or expired reset token' };
  }

  user.passwordHash = await hashPassword(newPassword);
  user.mustChangePassword = false;
  await user.save();

  record.used = true;
  await record.save();

  return { message: 'Password reset successful. You can sign in with your new password.' };
};
