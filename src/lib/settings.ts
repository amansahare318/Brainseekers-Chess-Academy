import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface CloudinaryAsset {
  url?: string;
  publicId?: string;
}

export interface AcademySettings {
  _id?: string;
  academyName: string;
  tagline: string;
  description: string;
  logo: CloudinaryAsset;
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
  certificateTemplate: CloudinaryAsset;
}

export async function fetchSettings(): Promise<AcademySettings> {
  return apiRequest<AcademySettings>('/api/settings');
}

export async function updateSettings(body: Partial<AcademySettings>): Promise<AcademySettings> {
  return apiRequest<AcademySettings>('/api/settings', {
    method: 'PATCH',
    token: getStoredToken(),
    body,
  });
}
