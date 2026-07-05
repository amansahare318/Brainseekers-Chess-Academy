import { Schema, model, Document } from 'mongoose';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Trial Scheduled'
  | 'Trial Completed'
  | 'Approved'
  | 'Rejected';

export interface ILead extends Document {
  studentName: string;
  age: number;
  chessLevel: string;
  parentName: string;
  parentMobile: string;
  parentEmail?: string;
  city: string;
  address?: string;
  studentMobile?: string;
  learningGoal: string;
  status: LeadStatus;
  trialDate?: Date;
  trialTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Trial Scheduled',
  'Trial Completed',
  'Approved',
  'Rejected',
];

const LeadSchema = new Schema<ILead>(
  {
    studentName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 4, max: 99 },
    chessLevel: { type: String, required: true, trim: true },
    parentName: { type: String, required: true, trim: true },
    parentMobile: { type: String, required: true, trim: true },
    parentEmail: { type: String, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    studentMobile: { type: String, trim: true },
    learningGoal: { type: String, required: true, trim: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'New' },
    trialDate: { type: Date },
    trialTime: { type: String, trim: true },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ parentMobile: 1 });

export const Lead = model<ILead>('Lead', LeadSchema);
