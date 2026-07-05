import { Schema, model, Document, Types } from 'mongoose';

export interface ICertificate extends Document {
  student: Types.ObjectId;
  certificateName: string;
  issueDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    certificateName: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true, default: Date.now },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

CertificateSchema.index({ student: 1, issueDate: -1 });

export const Certificate = model<ICertificate>('Certificate', CertificateSchema);
