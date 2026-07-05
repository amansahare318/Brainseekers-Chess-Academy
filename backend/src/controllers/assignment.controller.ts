import { Response, NextFunction } from 'express';
import { Assignment } from '../models/assignment.model';
import { AssignmentSubmission } from '../models/assignmentSubmission.model';
import { Student } from '../models/student.model';
import { User, Role } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { canAccessStudent } from '../utils/profileAccess';

export const createAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, coach, batch, dueDate, attachments } = req.body;
    if (!title || !description || !coach || !batch || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const doc = await Assignment.create({
      title,
      description,
      coach,
      batch,
      dueDate: new Date(dueDate),
      attachments: attachments || [],
    });
    res.status(201).json(await doc.populate(['coach', 'batch']));
  } catch (err) {
    next(err);
  }
};

export const listAssignments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    let filter: Record<string, unknown> = {};

    if (req.user!.role === Role.COACH && user?.profileRef) {
      filter = { coach: user.profileRef };
    } else if (req.user!.role === Role.STUDENT && user?.profileRef) {
      const student = await Student.findById(user.profileRef);
      if (student?.batch) filter = { batch: student.batch };
      else return res.json([]);
    } else if (req.user!.role === Role.ADMIN && req.query.batchId) {
      filter = { batch: req.query.batchId };
    }

    const assignments = await Assignment.find(filter)
      .populate('coach', 'name title')
      .populate('batch', 'name')
      .sort({ dueDate: -1 });

    if (req.user!.role === Role.STUDENT && user?.profileRef) {
      const subs = await AssignmentSubmission.find({ student: user.profileRef });
      const subMap = new Map(subs.map((s) => [String(s.assignment), s]));
      return res.json(
        assignments.map((a) => ({
          ...a.toObject(),
          submission: subMap.get(String(a._id)) || null,
        }))
      );
    }

    if (req.user!.role === Role.ADMIN) {
      const counts = await AssignmentSubmission.aggregate([
        { $group: { _id: '$assignment', submissionCount: { $sum: 1 } } },
      ]);
      const countMap = new Map(counts.map((c) => [String(c._id), c.submissionCount]));
      return res.json(
        assignments.map((a) => ({
          ...a.toObject(),
          submissionCount: countMap.get(String(a._id)) || 0,
        }))
      );
    }

    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const updateAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate([
      'coach',
      'batch',
    ]);
    if (!doc) return next({ status: 404, message: 'Assignment not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const deleteAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await Assignment.findByIdAndDelete(req.params.id);
    if (!doc) return next({ status: 404, message: 'Assignment not found' });
    await AssignmentSubmission.deleteMany({ assignment: doc._id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user?.profileRef) return res.status(400).json({ message: 'Student profile not linked' });

    const { assignmentId, content, attachmentUrl } = req.body;
    if (!assignmentId || !content) {
      return res.status(400).json({ message: 'assignmentId and content are required' });
    }

    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignment: assignmentId, student: user.profileRef },
      {
        assignment: assignmentId,
        student: user.profileRef,
        content,
        attachmentUrl,
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

export const listSubmissions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { assignmentId } = req.query;
    const filter: Record<string, unknown> = {};
    if (assignmentId) filter.assignment = assignmentId;

    const subs = await AssignmentSubmission.find(filter)
      .populate('student', 'studentId name')
      .populate('assignment', 'title dueDate')
      .sort({ submittedAt: -1 });
    res.json(subs);
  } catch (err) {
    next(err);
  }
};
