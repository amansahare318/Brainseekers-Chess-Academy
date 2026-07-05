import { Schema, model, Document, Types } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  author: Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    featuredImagePublicId: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BlogSchema.index({ published: 1, createdAt: -1 });

export const BlogPost = model<IBlogPost>('BlogPost', BlogSchema);
