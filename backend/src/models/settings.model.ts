import { Schema, model, Document } from 'mongoose';

export interface ICloudinaryAsset {
  url?: string;
  publicId?: string;
}

export interface IAcademySettings extends Document {
  academyName: string;
  tagline: string;
  description: string;
  logo: ICloudinaryAsset;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  signatureName: string;
  signatureTitle: string;
  certificateTemplate: ICloudinaryAsset;
  updatedAt: Date;
  createdAt: Date;
}

const CloudinaryAssetSchema = new Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const SettingsSchema = new Schema<IAcademySettings>(
  {
    academyName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: CloudinaryAssetSchema, default: () => ({}) },
    mobile: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    signatureName: { type: String, default: '' },
    signatureTitle: { type: String, default: '' },
    certificateTemplate: { type: CloudinaryAssetSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const AcademySettings = model<IAcademySettings>('AcademySettings', SettingsSchema);
