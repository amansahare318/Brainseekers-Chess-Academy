import { Schema, model, Document, Types } from 'mongoose';

export interface IAssignmentAttachment {
  name: string;
  url: string;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  coach: Types.ObjectId;
  batch: Types.ObjectId;
  dueDate: Date;
  attachments: IAssignmentAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    dueDate: { type: Date, required: true },
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

AssignmentSchema.index({ batch: 1, dueDate: -1 });
AssignmentSchema.index({ coach: 1 });

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);
