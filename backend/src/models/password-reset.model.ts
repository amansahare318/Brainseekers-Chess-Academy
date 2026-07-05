import { Schema, model, Document, Types } from 'mongoose';

export interface IPasswordReset extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const PasswordReset = model<IPasswordReset>('PasswordReset', PasswordResetSchema);
