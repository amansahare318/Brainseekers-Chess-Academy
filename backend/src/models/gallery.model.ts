import { Schema, model, Document } from 'mongoose';

export interface IGalleryImage extends Document {
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGalleryImage>(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    category: { type: String, required: true, trim: true, default: 'General' },
  },
  { timestamps: true }
);

GallerySchema.index({ category: 1, createdAt: -1 });

export const GalleryImage = model<IGalleryImage>('GalleryImage', GallerySchema);
