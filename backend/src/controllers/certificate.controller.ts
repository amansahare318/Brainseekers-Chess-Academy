import { Response, NextFunction } from 'express';
import { Certificate } from '../models/certificate.model';
import { Student } from '../models/student.model';
import { User, Role } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { canAccessStudent } from '../utils/profileAccess';

export const createCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { student, certificateName, issueDate, description } = req.body;
    if (!student || !certificateName) {
      return res.status(400).json({ message: 'student and certificateName are required' });
    }
    const doc = await Certificate.create({
      student,
      certificateName,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      description,
    });
    res.status(201).json(await doc.populate('student', 'studentId name'));
  } catch (err) {
    next(err);
  }
};

export const listCertificates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    let filter: Record<string, unknown> = {};

    if (req.user!.role === Role.STUDENT && user?.profileRef) {
      filter = { student: user.profileRef };
    } else if (req.query.studentId) {
      filter = { student: req.query.studentId };
    }

    const certs = await Certificate.find(filter)
      .populate('student', 'studentId name')
      .sort({ issueDate: -1 });
    res.json(certs);
  } catch (err) {
    next(err);
  }
};

export const deleteCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await Certificate.findByIdAndDelete(req.params.id);
    if (!doc) return next({ status: 404, message: 'Certificate not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await Certificate.findById(req.params.id).populate('student', 'studentId name chessLevel');
    if (!doc) return next({ status: 404, message: 'Certificate not found' });

    if (req.user!.role === Role.STUDENT) {
      const user = await User.findById(req.user!.id);
      if (String(user?.profileRef) !== String(doc.student)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const downloadCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await Certificate.findById(req.params.id).populate('student', 'studentId name');
    if (!doc) return next({ status: 404, message: 'Certificate not found' });

    const student = doc.student as unknown as { studentId: string; name: string };

    const studentId = String((doc.student as { _id?: { toString: () => string } })._id ?? doc.student);
    if (req.user!.role === Role.STUDENT) {
      const allowed = await canAccessStudent(req.user!.id, req.user!.role, studentId);
      if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    }

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${doc.certificateName}</title>
<style>
body{font-family:Georgia,serif;text-align:center;padding:48px;background:#0f172a;color:#fff}
.border{border:4px double #c9a227;padding:48px;max-width:720px;margin:0 auto}
h1{color:#c9a227;font-size:2rem;margin:0 0 8px}
h2{font-size:1.25rem;font-weight:normal;margin:24px 0}
.name{font-size:2.5rem;color:#fff;margin:16px 0}
.meta{color:#94a3b8;font-size:0.9rem;margin-top:32px}
</style></head><body>
<div class="border">
<p>BrainSeekers Chess Academy</p>
<h1>Certificate of Achievement</h1>
<h2>${doc.certificateName}</h2>
<p class="name">${student.name}</p>
<p>Student ID: ${student.studentId}</p>
<p class="meta">Issued ${new Date(doc.issueDate).toLocaleDateString()}</p>
${doc.description ? `<p class="meta">${doc.description}</p>` : ''}
</div></body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="certificate-${doc._id}.html"`);
    res.send(html);
  } catch (err) {
    next(err);
  }
};
