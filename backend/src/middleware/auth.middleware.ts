import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../models/user.model';

export interface AuthTokenPayload {
  id: string;
  role: Role;
  mustChangePassword?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
}

const jwtSecret = () => process.env.JWT_SECRET || 'dev-secret-change-in-production';

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret()) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
