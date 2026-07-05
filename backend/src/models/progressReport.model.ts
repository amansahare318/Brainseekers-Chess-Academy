import { Schema, model, Document, Types } from 'mongoose';

export interface IProgressReport extends Document {
  student: Types.ObjectId;
  coach: Types.ObjectId;
  tacticalSkills: number;
  openingKnowledge: number;
  endgameSkills: number;
  tournamentPerformance: number;
  discipline: number;
  remarks: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressReportSchema = new Schema<IProgressReport>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    tacticalSkills: { type: Number, required: true, min: 0, max: 10 },
    openingKnowledge: { type: Number, required: true, min: 0, max: 10 },
    endgameSkills: { type: Number, required: true, min: 0, max: 10 },
    tournamentPerformance: { type: Number, required: true, min: 0, max: 10 },
    discipline: { type: Number, required: true, min: 0, max: 10 },
    remarks: { type: String, default: '' },
    rating: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

ProgressReportSchema.index({ student: 1, createdAt: -1 });
ProgressReportSchema.index({ coach: 1 });

export const ProgressReport = model<IProgressReport>('ProgressReport', ProgressReportSchema);
