import { Response, NextFunction } from 'express';
import { AcademySettings } from '../models/settings.model';
import { AuthRequest } from '../middleware/auth.middleware';

const defaultSettings = () => ({
  academyName: '',
  tagline: '',
  description: '',
  logo: { url: '', publicId: '' },
  mobile: '',
  whatsapp: '',
  email: '',
  address: '',
  city: '',
  state: '',
  country: '',
  facebook: '',
  instagram: '',
  youtube: '',
  linkedin: '',
  signatureName: '',
  signatureTitle: '',
  certificateTemplate: { url: '', publicId: '' },
});

export const getOrCreateSettings = async () => {
  let settings = await AcademySettings.findOne();
  if (!settings) {
    settings = await AcademySettings.create(defaultSettings());
  }
  return settings;
};

export const getSettings = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await getOrCreateSettings();
    const allowed = [
      'academyName',
      'tagline',
      'description',
      'logo',
      'mobile',
      'whatsapp',
      'email',
      'address',
      'city',
      'state',
      'country',
      'facebook',
      'instagram',
      'youtube',
      'linkedin',
      'signatureName',
      'signatureTitle',
      'certificateTemplate',
    ] as const;

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        settings.set(key, req.body[key]);
      }
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};
