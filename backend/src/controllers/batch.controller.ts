import { Response, NextFunction } from 'express';
import { Batch } from '../models/batch.model';
import { Student } from '../models/student.model';
import { User, Role } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const listBatches = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let filter: Record<string, unknown> = {};

    if (req.user?.role === Role.COACH) {
      const coachUser = await User.findById(req.user.id);
      if (!coachUser?.profileRef) {
        return res.json([]);
      }
      filter = { coach: coachUser.profileRef };
    }

    const batches = await Batch.find(filter).populate('coach').sort({ startDate: -1 });
    const withCounts = await Promise.all(
      batches.map(async (batch) => {
        const studentCount = await Student.countDocuments({ batch: batch._id });
        return { ...batch.toObject(), studentCount };
      })
    );
    res.json(withCounts);
  } catch (err) {
    next(err);
  }
};

export const getBatchById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('coach');
    if (!batch) return next({ status: 404, message: 'Batch not found' });

    const students = await Student.find({ batch: batch._id })
      .select('studentId name age chessLevel mobile')
      .sort({ name: 1 });

    res.json({ batch, students });
  } catch (err) {
    next(err);
  }
};

export const createBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, schedule, startDate, endDate, coach } = req.body;
    if (!name || !startDate) {
      return res.status(400).json({ message: 'Name and start date are required' });
    }
    const batch = await Batch.create({
      name: String(name).trim(),
      schedule: schedule ? String(schedule).trim() : undefined,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      coach: coach || undefined,
    });
    res.status(201).json(batch);
  } catch (err) {
    next(err);
  }
};

export const updateBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, schedule, startDate, endDate, coach } = req.body;
    const batch = await Batch.findById(req.params.id);
    if (!batch) return next({ status: 404, message: 'Batch not found' });

    if (name !== undefined) batch.name = String(name).trim();
    if (schedule !== undefined) batch.schedule = schedule;
    if (startDate !== undefined) batch.startDate = new Date(startDate);
    if (endDate !== undefined) batch.endDate = endDate ? new Date(endDate) : undefined;
    if (coach !== undefined) batch.coach = coach || undefined;

    await batch.save();
    res.json(batch);
  } catch (err) {
    next(err);
  }
};

export const deleteBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return next({ status: 404, message: 'Batch not found' });
    await Student.updateMany({ batch: batch._id }, { $unset: { batch: '' } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const assignBatchStudents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return next({ status: 404, message: 'Batch not found' });

    const { studentIds } = req.body as { studentIds: string[] };
    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ message: 'studentIds array is required' });
    }

    await Student.updateMany({ batch: batch._id }, { $unset: { batch: '' } });
    if (studentIds.length > 0) {
      await Student.updateMany({ _id: { $in: studentIds } }, { batch: batch._id });
    }

    const students = await Student.find({ batch: batch._id }).select('studentId name age chessLevel');
    res.json({ batch, students });
  } catch (err) {
    next(err);
  }
};

export const getMyBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user?.profileRef) {
      return res.status(404).json({ message: 'No student profile linked to this account' });
    }

    const student = await Student.findById(user.profileRef).populate({
      path: 'batch',
      populate: { path: 'coach' },
    });

    if (!student?.batch) {
      return res.status(404).json({ message: 'No batch assigned yet' });
    }

    res.json({
      batch: student.batch,
      student: { id: student._id, studentId: student.studentId, name: student.name },
    });
  } catch (err) {
    next(err);
  }
};
