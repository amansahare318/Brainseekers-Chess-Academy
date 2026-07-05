import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Coach } from '../models/coach.model';
import { User, Role } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { hashPassword } from '../services/auth.service';

export const getCoachMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user?.profileRef) {
      return res.status(404).json({ message: 'No coach profile linked to this account' });
    }
    const coach = await Coach.findById(user.profileRef);
    if (!coach) return res.status(404).json({ message: 'Coach profile not found' });
    res.json({ user: { id: user._id, email: user.email, name: user.name }, coach });
  } catch (err) {
    next(err);
  }
};

export const listCoaches = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    const withLink = await Promise.all(
      coaches.map(async (c) => {
        const linkedUser = c.user ? await User.findById(c.user).select('email role') : null;
        return { ...c.toObject(), linkedUser };
      })
    );
    res.json(withLink);
  } catch (err) {
    next(err);
  }
};

export const getPublicCoaches = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    res.json(coaches);
  } catch (err) {
    next(err);
  }
};

export const createCoachProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, title, elo, photoUrl, photoPublicId, password } = req.body;
    if (!name || !email || !title || !elo) {
      return res.status(400).json({ message: 'name, email, title, and elo are required' });
    }

    const existingCoach = await Coach.findOne({ email: String(email).toLowerCase() });
    if (existingCoach) return res.status(409).json({ message: 'Coach email already exists' });

    const coach = await Coach.create({
      name,
      email: String(email).toLowerCase(),
      title,
      elo,
      photoUrl,
      photoPublicId,
    });

    if (password) {
      const passwordHash = await hashPassword(password);
      const user = await User.create({
        email: coach.email,
        passwordHash,
        role: Role.COACH,
        name: coach.name,
        profileRef: coach._id,
        mustChangePassword: false,
        isActive: true,
      });
      coach.user = user._id;
      await coach.save();
    }

    res.status(201).json(coach);
  } catch (err) {
    next(err);
  }
};

export const linkCoachUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coachId = req.params.id;
    const { userId, email, password, name } = req.body;
    const coach = await Coach.findById(coachId);
    if (!coach) return next({ status: 404, message: 'Coach not found' });

    let user = userId ? await User.findById(userId) : null;

    if (!user && email && password) {
      const existing = await User.findOne({ email: String(email).toLowerCase() });
      if (existing) return res.status(409).json({ message: 'User email already exists' });
      user = await User.create({
        email: String(email).toLowerCase(),
        passwordHash: await hashPassword(password),
        role: Role.COACH,
        name: name || coach.name,
        profileRef: coach._id,
        mustChangePassword: false,
        isActive: true,
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Provide userId or email+password to create a login' });
    }

    user.role = Role.COACH;
    user.profileRef = coach._id;
    await user.save();

    coach.user = user._id;
    await coach.save();

    res.json({ coach, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};
