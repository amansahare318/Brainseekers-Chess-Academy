import { Request, Response, NextFunction } from 'express';
import { Lead, LeadStatus } from '../models/lead.model';
import { Parent } from '../models/parent.model';
import { Student } from '../models/student.model';
import { generateStudentId } from '../services/idGenerator.service';
import * as authService from '../services/auth.service';
import { User, Role } from '../models/user.model';

const ALLOWED_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Trial Scheduled',
  'Trial Completed',
  'Approved',
  'Rejected',
];

const normalizeMobile = (mobile: string) => mobile.replace(/\D/g, '');

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      studentName,
      age,
      chessLevel,
      parentName,
      parentMobile,
      parentEmail,
      city,
      address,
      studentMobile,
      learningGoal,
    } = req.body;

    const lead = await Lead.create({
      studentName: String(studentName).trim(),
      age: Number(age),
      chessLevel: String(chessLevel).trim(),
      parentName: String(parentName).trim(),
      parentMobile: normalizeMobile(String(parentMobile)),
      parentEmail: parentEmail ? String(parentEmail).trim().toLowerCase() : undefined,
      city: String(city).trim(),
      address: address ? String(address).trim() : undefined,
      studentMobile: studentMobile ? normalizeMobile(String(studentMobile)) : undefined,
      learningGoal: String(learningGoal).trim(),
      status: 'New',
    });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

export const getLeads = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    next(err);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next({ status: 404, message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next({ status: 404, message: 'Lead not found' });

    const { status, trialDate, trialTime, parentEmail, address, studentMobile, learningGoal } =
      req.body;

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid lead status' });
      }
      if (lead.status === 'Approved' && status !== 'Approved') {
        return res.status(400).json({ message: 'Approved leads cannot change status' });
      }
      lead.status = status;
    }

    if (trialDate !== undefined) lead.trialDate = trialDate ? new Date(trialDate) : undefined;
    if (trialTime !== undefined) lead.trialTime = trialTime;
    if (parentEmail !== undefined) lead.parentEmail = parentEmail;
    if (address !== undefined) lead.address = address;
    if (studentMobile !== undefined) lead.studentMobile = studentMobile ? normalizeMobile(studentMobile) : undefined;
    if (learningGoal !== undefined) lead.learningGoal = learningGoal;

    if (status === 'Trial Scheduled' && trialDate && !lead.trialDate) {
      lead.trialDate = new Date(trialDate);
    }

    await lead.save();
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

export const convertLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leadId = req.params.id;
    const { coachId, batchId } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) return next({ status: 404, message: 'Lead not found' });

    if (lead.status === 'Approved') {
      return res.status(400).json({ message: 'Lead is already converted' });
    }

    let parent = await Parent.findOne({ mobile: lead.parentMobile });
    if (!parent) {
      parent = await Parent.create({
        name: lead.parentName,
        mobile: lead.parentMobile,
        email: lead.parentEmail,
        address: lead.address,
        students: [],
      });
    }

    const studentId = await generateStudentId();

    const student = await Student.create({
      studentId,
      name: lead.studentName,
      age: lead.age,
      chessLevel: lead.chessLevel,
      parent: parent._id,
      city: lead.city,
      address: lead.address,
      mobile: lead.studentMobile,
      ...(coachId ? { coach: coachId } : {}),
      ...(batchId ? { batch: batchId } : {}),
    });

    parent.students.push(student._id);
    await parent.save();

    lead.status = 'Approved';
    await lead.save();

    const credentials: {
      parent?: { mobile: string; temporaryPassword: string };
      student?: { mobile: string; temporaryPassword: string };
    } = {};

    const parentMobile = parent.mobile.replace(/\D/g, '');
    const studentMobile = (lead.studentMobile || parent.mobile).replace(/\D/g, '');

    if (!(await User.findOne({ mobile: parentMobile, role: Role.PARENT }))) {
      const parentTemp = authService.generateTempPassword();
      await authService.registerUser({
        mobile: parentMobile,
        email: lead.parentEmail,
        password: parentTemp,
        role: Role.PARENT,
        name: parent.name,
        profileRef: String(parent._id),
        mustChangePassword: true,
      });
      credentials.parent = { mobile: parentMobile, temporaryPassword: parentTemp };
    }

    if (!(await User.findOne({ mobile: studentMobile, role: Role.STUDENT }))) {
      const studentTemp = authService.generateTempPassword();
      await authService.registerUser({
        mobile: studentMobile,
        password: studentTemp,
        role: Role.STUDENT,
        name: student.name,
        profileRef: String(student._id),
        mustChangePassword: true,
      });
      credentials.student = { mobile: studentMobile, temporaryPassword: studentTemp };
    }

    res.status(201).json({ lead, student, credentials });
  } catch (err) {
    next(err);
  }
};
