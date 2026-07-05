"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = exports.getOrCreateSettings = void 0;
const settings_model_1 = require("../models/settings.model");
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
const getOrCreateSettings = async () => {
    let settings = await settings_model_1.AcademySettings.findOne();
    if (!settings) {
        settings = await settings_model_1.AcademySettings.create(defaultSettings());
    }
    return settings;
};
exports.getOrCreateSettings = getOrCreateSettings;
const getSettings = async (_req, res, next) => {
    try {
        const settings = await (0, exports.getOrCreateSettings)();
        res.json(settings);
    }
    catch (err) {
        next(err);
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res, next) => {
    try {
        const settings = await (0, exports.getOrCreateSettings)();
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
        ];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                settings.set(key, req.body[key]);
            }
        }
        await settings.save();
        res.json(settings);
    }
    catch (err) {
        next(err);
    }
};
exports.updateSettings = updateSettings;
