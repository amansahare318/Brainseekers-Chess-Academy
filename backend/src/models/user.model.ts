import { Schema, model, Document, Types } from 'mongoose';

export enum Role {
  ADMIN = 'admin',
  COACH = 'coach',
  STUDENT = 'student',
  PARENT = 'parent',
}

export interface IUser extends Document {
  email?: string;
  mobile?: string;
  passwordHash: string;
  role: Role;
  name?: string;
  profileRef?: Types.ObjectId;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    mobile: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    name: { type: String },
    profileRef: { type: Schema.Types.ObjectId },
    mustChangePassword: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ role: 1 });

export const User = model<IUser>('User', UserSchema);
