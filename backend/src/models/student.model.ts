import { Schema, model, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  studentId: string; // e.g., BCA-2026-001
  name: string;
  age: number;
  chessLevel: string;
  parent: Types.ObjectId; // reference to Parent
  coach?: Types.ObjectId; // reference to Coach
  batch?: Types.ObjectId; // reference to Batch
  city: string;
  address?: string;
  mobile?: string;
  photoUrl?: string;
  photoPublicId?: string;
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  chessLevel: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  coach: { type: Schema.Types.ObjectId, ref: 'Coach' },
  batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
  city: { type: String, required: true },
  address: { type: String },
  mobile: { type: String },
  photoUrl: { type: String },
  photoPublicId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Student = model<IStudent>('Student', StudentSchema);
