import { Schema, model, Document, Types } from 'mongoose';

export interface ICoach extends Document {
  name: string;
  email: string;
  title: string;
  elo: string;
  photoUrl?: string;
  photoPublicId?: string;
  user?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<ICoach>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    elo: { type: String, required: true },
    photoUrl: { type: String },
    photoPublicId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Coach = model<ICoach>('Coach', CoachSchema);
