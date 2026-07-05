import Joi from 'joi';
import { Role } from '../models/user.model';

const objectId = Joi.string().hex().length(24);
const password = Joi.string().min(8).max(128);
const mobile = Joi.string().pattern(/^[\d+\-\s()]{7,15}$/);

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  mobile: mobile,
  password: Joi.string().required(),
  role: Joi.string().valid(...Object.values(Role)),
}).or('email', 'mobile');

export const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  mobile: mobile,
  password: password.required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
  name: Joi.string().trim().max(120),
  profileRef: objectId,
  mustChangePassword: Joi.boolean(),
}).or('email', 'mobile');

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: password.required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  mobile: mobile,
  role: Joi.string().valid(Role.ADMIN, Role.COACH, Role.STUDENT, Role.PARENT),
}).or('email', 'mobile');

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: password.required(),
});

export const provisionSchema = Joi.object({
  role: Joi.string().valid(Role.STUDENT, Role.PARENT).required(),
  profileRef: objectId.required(),
  mobile: mobile,
  email: Joi.string().email().lowercase().trim(),
  name: Joi.string().trim().max(120),
  password: password,
});

export const leadCreateSchema = Joi.object({
  studentName: Joi.string().trim().min(2).max(120).required(),
  age: Joi.number().integer().min(4).max(25).required(),
  chessLevel: Joi.string().trim().required(),
  parentName: Joi.string().trim().min(2).max(120).required(),
  parentMobile: Joi.string().min(7).max(20).required(),
  parentEmail: Joi.string().email().lowercase().trim().allow(''),
  city: Joi.string().trim().required(),
  learningGoal: Joi.string().trim().default(''),
  address: Joi.string().trim().allow(''),
  studentMobile: Joi.string().trim().allow(''),
});

export const leadUpdateSchema = Joi.object({
  status: Joi.string().valid('New', 'Contacted', 'Trial Scheduled', 'Trial Completed', 'Approved', 'Rejected'),
  trialDate: Joi.string().isoDate().allow(''),
  trialTime: Joi.string().trim().allow(''),
  assignedCoach: objectId.allow(''),
  notes: Joi.string().trim().max(2000).allow(''),
}).min(1);

export const leadConvertSchema = Joi.object({
  coachId: objectId,
  batchId: objectId,
});

export const studentCreateSchema = Joi.object({
  studentId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).max(120).required(),
  age: Joi.number().integer().min(4).max(25).required(),
  chessLevel: Joi.string().trim().required(),
  parent: objectId.required(),
  coach: objectId,
  batch: objectId,
  city: Joi.string().trim().required(),
  address: Joi.string().trim().allow(''),
  mobile: mobile.allow(''),
  photoUrl: Joi.string().uri().allow(''),
  photoPublicId: Joi.string().trim().allow(''),
});

export const studentUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  age: Joi.number().integer().min(4).max(25),
  chessLevel: Joi.string().trim(),
  parent: objectId,
  coach: objectId.allow(null, ''),
  batch: objectId.allow(null, ''),
  city: Joi.string().trim(),
  address: Joi.string().trim().allow(''),
  mobile: mobile.allow(''),
  photoUrl: Joi.string().uri().allow(''),
  photoPublicId: Joi.string().trim().allow(''),
}).min(1);

export const studentListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(50),
  search: Joi.string().trim().allow(''),
  batchId: objectId,
  coachId: objectId,
  chessLevel: Joi.string().trim(),
});

export const coachCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().lowercase().trim().required(),
  title: Joi.string().trim().required(),
  elo: Joi.string().trim().required(),
  photoUrl: Joi.string().uri().allow(''),
  photoPublicId: Joi.string().trim().allow(''),
  password: password,
});

export const batchCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  schedule: Joi.string().trim().allow(''),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  coach: objectId,
});

export const batchUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  schedule: Joi.string().trim().allow(''),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().allow(null),
  coach: objectId.allow(null, ''),
}).min(1);

export const batchAssignStudentsSchema = Joi.object({
  studentIds: Joi.array().items(objectId).required(),
});

export const attendanceCreateSchema = Joi.object({
  student: objectId.required(),
  batch: objectId.required(),
  coach: objectId.required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid('Present', 'Absent', 'Late').required(),
  remarks: Joi.string().trim().max(500).allow(''),
});

export const attendanceBulkSchema = Joi.object({
  records: Joi.array().items(attendanceCreateSchema).min(1).max(100).required(),
});

export const attendanceUpdateSchema = Joi.object({
  status: Joi.string().valid('Present', 'Absent', 'Late'),
  remarks: Joi.string().trim().max(500).allow(''),
}).min(1);

export const assignmentCreateSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().required(),
  coach: objectId.required(),
  batch: objectId.required(),
  dueDate: Joi.date().iso().required(),
  attachments: Joi.array().items(
    Joi.object({ name: Joi.string().required(), url: Joi.string().uri().required() })
  ),
});

export const reportCreateSchema = Joi.object({
  student: objectId.required(),
  coach: objectId.required(),
  tacticalSkills: Joi.number().min(0).max(10).required(),
  openingKnowledge: Joi.number().min(0).max(10).required(),
  endgameSkills: Joi.number().min(0).max(10).required(),
  tournamentPerformance: Joi.number().min(0).max(10).required(),
  discipline: Joi.number().min(0).max(10).required(),
  remarks: Joi.string().trim().max(2000).required(),
  rating: Joi.number().min(0).max(3000).required(),
});

export const certificateCreateSchema = Joi.object({
  student: objectId.required(),
  certificateName: Joi.string().trim().min(2).max(200).required(),
  issueDate: Joi.date().iso(),
  description: Joi.string().trim().max(1000).allow(''),
});

export const blogCreateSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  content: Joi.string().required(),
  featuredImage: Joi.string().uri().allow(''),
  featuredImagePublicId: Joi.string().trim().allow(''),
  published: Joi.boolean(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).allow(''),
});

export const blogUpdateSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200),
  content: Joi.string(),
  featuredImage: Joi.string().uri().allow(''),
  featuredImagePublicId: Joi.string().trim().allow(''),
  published: Joi.boolean(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).allow(''),
}).min(1);

export const galleryCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  imageUrl: Joi.string().uri().required(),
  imagePublicId: Joi.string().trim().allow(''),
  category: Joi.string().trim().default('General'),
});

export const cloudinaryAssetSchema = Joi.object({
  url: Joi.string().uri().allow(''),
  publicId: Joi.string().trim().allow(''),
});

export const settingsUpdateSchema = Joi.object({
  academyName: Joi.string().trim().max(200).allow(''),
  tagline: Joi.string().trim().max(300).allow(''),
  description: Joi.string().trim().max(5000).allow(''),
  logo: cloudinaryAssetSchema,
  mobile: Joi.string().trim().allow(''),
  whatsapp: Joi.string().trim().allow(''),
  email: Joi.string().email().lowercase().trim().allow(''),
  address: Joi.string().trim().allow(''),
  city: Joi.string().trim().allow(''),
  state: Joi.string().trim().allow(''),
  country: Joi.string().trim().allow(''),
  facebook: Joi.string().uri().allow(''),
  instagram: Joi.string().uri().allow(''),
  youtube: Joi.string().uri().allow(''),
  linkedin: Joi.string().uri().allow(''),
  signatureName: Joi.string().trim().allow(''),
  signatureTitle: Joi.string().trim().allow(''),
  certificateTemplate: cloudinaryAssetSchema,
}).min(1);
