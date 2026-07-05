import { Schema, model, Document, Types } from 'mongoose';

export interface IAssignmentSubmission extends Document {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  content: string;
  attachmentUrl?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    content: { type: String, required: true },
    attachmentUrl: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const AssignmentSubmission = model<IAssignmentSubmission>(
  'AssignmentSubmission',
  SubmissionSchema
);
