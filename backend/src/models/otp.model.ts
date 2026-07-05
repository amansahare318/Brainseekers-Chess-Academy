import { Schema, model, Document } from 'mongoose';

export interface IOtpCode extends Document {
  mobile: string;
  code: string;
  role: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtpCode>({
  mobile: { type: String, required: true, index: true },
  code: { type: String, required: true },
  role: { type: String, enum: ['student', 'parent'], required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

OtpSchema.index({ mobile: 1, role: 1 });

export const OtpCode = model<IOtpCode>('OtpCode', OtpSchema);
