import { Response, NextFunction } from 'express';
import { Attendance, AttendanceStatus } from '../models/attendance.model';
import { Student } from '../models/student.model';
import { Batch } from '../models/batch.model';
import { User, Role } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { canAccessStudent, toObjectId } from '../utils/profileAccess';

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const normalizeRecord = async (body: {
  student: string;
  batch: string;
  coach: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}) => {
  const date = startOfDay(new Date(body.date));
  return {
    student: body.student,
    batch: body.batch,
    coach: body.coach,
    date,
    status: body.status,
    remarks: body.remarks,
  };
};

export const createAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const record = await normalizeRecord(req.body);
    const existing = await Attendance.findOne({
      student: record.student,
      batch: record.batch,
      date: record.date,
    });
    if (existing) {
      existing.status = record.status;
      existing.remarks = record.remarks;
      existing.coach = toObjectId(record.coach)!;
      await existing.save();
      return res.json(await existing.populate(['student', 'batch', 'coach']));
    }
    const doc = await Attendance.create(record);
    res.status(201).json(await doc.populate(['student', 'batch', 'coach']));
  } catch (err) {
    next(err);
  }
};

export const bulkAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { records } = req.body as { records: Parameters<typeof normalizeRecord>[0][] };
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'records array is required' });
    }
    const results: Awaited<ReturnType<typeof Attendance.findOneAndUpdate>>[] = [];
    for (const r of records) {
      const record = await normalizeRecord(r);
      const doc = await Attendance.findOneAndUpdate(
        { student: record.student, batch: record.batch, date: record.date },
        record,
        { upsert: true, new: true }
      );
      results.push(doc);
    }
    res.status(201).json(results);
  } catch (err) {
    next(err);
  }
};

export const listAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { month, year, batchId } = req.query;
    const filter: Record<string, unknown> = {};

    if (batchId) filter.batch = batchId;

    if (month && year) {
      const m = Number(month) - 1;
      const y = Number(year);
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 0, 23, 59, 59);
      filter.date = { $gte: from, $lte: to };
    }

    const list = await Attendance.find(filter)
      .populate('student', 'studentId name')
      .populate('batch', 'name')
      .populate('coach', 'name')
      .sort({ date: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getByStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.params.id;
    if (req.user && req.user.role !== Role.ADMIN) {
      const allowed = await canAccessStudent(req.user.id, req.user.role, studentId);
      if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    }
    const list = await Attendance.find({ student: studentId })
      .populate('batch', 'name schedule')
      .populate('coach', 'name')
      .sort({ date: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getByBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query;
    const filter: Record<string, unknown> = { batch: req.params.id };
    if (date) filter.date = startOfDay(new Date(String(date)));

    const list = await Attendance.find(filter)
      .populate('student', 'studentId name')
      .populate('coach', 'name')
      .sort({ 'student.name': 1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const updateAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await Attendance.findById(req.params.id);
    if (!doc) return next({ status: 404, message: 'Attendance not found' });

    const { status, remarks } = req.body;
    if (status) doc.status = status;
    if (remarks !== undefined) doc.remarks = remarks;
    await doc.save();
    res.json(await doc.populate(['student', 'batch', 'coach']));
  } catch (err) {
    next(err);
  }
};

export const monthlyStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59);

    const stats = await Attendance.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const byBatch = await Attendance.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: '$batch',
          present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'batches',
          localField: '_id',
          foreignField: '_id',
          as: 'batch',
        },
      },
      { $unwind: { path: '$batch', preserveNullAndEmptyArrays: true } },
    ]);

    const totalStudents = await Student.countDocuments();

    res.json({
      month,
      year,
      totals: stats,
      byBatch,
      totalStudents,
    });
  } catch (err) {
    next(err);
  }
};

export const coachMarkingContext = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user?.profileRef) return res.json({ batches: [] });

    const batches = await Batch.find({ coach: user.profileRef });
    const batchIds = batches.map((b) => b._id);
    const students = await Student.find({ batch: { $in: batchIds } }).select('studentId name batch');

    res.json({ batches, students, coachId: String(user.profileRef) });
  } catch (err) {
    next(err);
  }
};
