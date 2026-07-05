import { Response, NextFunction } from 'express';
import { Student } from '../models/student.model';
import { User, Role } from '../models/user.model';
import { Parent } from '../models/parent.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getParentChildren = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user?.profileRef) return res.json([]);
    const parent = await Parent.findById(user.profileRef);
    if (!parent) return res.json([]);
    const students = await Student.find({ _id: { $in: parent.students } })
      .populate(['parent', 'coach', 'batch'])
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

export const getStudents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search = String(req.query.search || '').trim();
    const batchId = req.query.batchId as string | undefined;
    const coachId = req.query.coachId as string | undefined;
    const chessLevel = req.query.chessLevel as string | undefined;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }
    if (batchId) filter.batch = batchId;
    if (coachId) filter.coach = coachId;
    if (chessLevel) filter.chessLevel = chessLevel;

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .populate(['parent', 'coach', 'batch'])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      students,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findById(req.params.id).populate(['parent', 'coach', 'batch']);
    if (!student) return next({ status: 404, message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(await student.populate(['parent', 'coach', 'batch']));
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const allowed = ['name', 'age', 'chessLevel', 'parent', 'coach', 'batch', 'city', 'address', 'mobile', 'photoUrl', 'photoPublicId'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true }).populate([
      'parent',
      'coach',
      'batch',
    ]);
    if (!student) return next({ status: 404, message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return next({ status: 404, message: 'Student not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
