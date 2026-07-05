import { Response, NextFunction } from 'express';
import { ProgressReport } from '../models/progressReport.model';
import { User, Role } from '../models/user.model';
import { Parent } from '../models/parent.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { canAccessStudent } from '../utils/profileAccess';

export const createReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await ProgressReport.create(req.body);
    res.status(201).json(await doc.populate(['student', 'coach']));
  } catch (err) {
    next(err);
  }
};

export const listReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    let filter: Record<string, unknown> = {};

    if (req.user!.role === Role.COACH && user?.profileRef) {
      filter = { coach: user.profileRef };
    } else if (req.user!.role === Role.STUDENT && user?.profileRef) {
      filter = { student: user.profileRef };
    } else if (req.user!.role === Role.PARENT && user?.profileRef) {
      const parent = await Parent.findById(user.profileRef);
      if (req.query.studentId) {
        const sid = String(req.query.studentId);
        const linked = parent?.students.some((s) => String(s) === sid);
        if (!linked) return res.status(403).json({ message: 'Forbidden' });
        filter = { student: sid };
      } else {
        filter = { student: { $in: parent?.students || [] } };
      }
    } else if (req.query.studentId) {
      filter = { student: req.query.studentId };
    }

    const reports = await ProgressReport.find(filter)
      .populate('student', 'studentId name')
      .populate('coach', 'name title')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

export const updateReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await ProgressReport.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate([
      'student',
      'coach',
    ]);
    if (!doc) return next({ status: 404, message: 'Report not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const getReportForStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.params.studentId;
    if (req.user && req.user.role !== Role.ADMIN && req.user.role !== Role.COACH) {
      const allowed = await canAccessStudent(req.user.id, req.user.role, studentId);
      if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    }
    const reports = await ProgressReport.find({ student: studentId })
      .populate('coach', 'name')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};
