import { Schema, model, Document, Types } from 'mongoose';

export interface IParent extends Document {
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  students: Types.ObjectId[]; // references Student documents
  createdAt: Date;
}

const ParentSchema = new Schema<IParent>({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  address: { type: String },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now },
});

export const Parent = model<IParent>('Parent', ParentSchema);
