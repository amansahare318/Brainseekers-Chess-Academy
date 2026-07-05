import { Schema, model, Document, Types } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  schedule?: string;
  startDate: Date;
  endDate?: Date;
  coach?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: { type: String, required: true, trim: true },
    schedule: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach' },
  },
  { timestamps: true }
);

BatchSchema.index({ coach: 1 });
BatchSchema.index({ startDate: -1 });

export const Batch = model<IBatch>('Batch', BatchSchema);
