"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkCoachUser = exports.createCoachProfile = exports.listCoaches = exports.getCoachMe = void 0;
const coach_model_1 = require("../models/coach.model");
const user_model_1 = require("../models/user.model");
const auth_service_1 = require("../services/auth.service");
const getCoachMe = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user?.profileRef) {
            return res.status(404).json({ message: 'No coach profile linked to this account' });
        }
        const coach = await coach_model_1.Coach.findById(user.profileRef);
        if (!coach)
            return res.status(404).json({ message: 'Coach profile not found' });
        res.json({ user: { id: user._id, email: user.email, name: user.name }, coach });
    }
    catch (err) {
        next(err);
    }
};
exports.getCoachMe = getCoachMe;
const listCoaches = async (_req, res, next) => {
    try {
        const coaches = await coach_model_1.Coach.find().sort({ createdAt: -1 });
        const withLink = await Promise.all(coaches.map(async (c) => {
            const linkedUser = c.user ? await user_model_1.User.findById(c.user).select('email role') : null;
            return { ...c.toObject(), linkedUser };
        }));
        res.json(withLink);
    }
    catch (err) {
        next(err);
    }
};
exports.listCoaches = listCoaches;
const createCoachProfile = async (req, res, next) => {
    try {
        const { name, email, title, elo, photoUrl, photoPublicId, password } = req.body;
        if (!name || !email || !title || !elo) {
            return res.status(400).json({ message: 'name, email, title, and elo are required' });
        }
        const existingCoach = await coach_model_1.Coach.findOne({ email: String(email).toLowerCase() });
        if (existingCoach)
            return res.status(409).json({ message: 'Coach email already exists' });
        const coach = await coach_model_1.Coach.create({
            name,
            email: String(email).toLowerCase(),
            title,
            elo,
            photoUrl,
            photoPublicId,
        });
        if (password) {
            const passwordHash = await (0, auth_service_1.hashPassword)(password);
            const user = await user_model_1.User.create({
                email: coach.email,
                passwordHash,
                role: user_model_1.Role.COACH,
                name: coach.name,
                profileRef: coach._id,
                mustChangePassword: false,
                isActive: true,
            });
            coach.user = user._id;
            await coach.save();
        }
        res.status(201).json(coach);
    }
    catch (err) {
        next(err);
    }
};
exports.createCoachProfile = createCoachProfile;
const linkCoachUser = async (req, res, next) => {
    try {
        const coachId = req.params.id;
        const { userId, email, password, name } = req.body;
        const coach = await coach_model_1.Coach.findById(coachId);
        if (!coach)
            return next({ status: 404, message: 'Coach not found' });
        let user = userId ? await user_model_1.User.findById(userId) : null;
        if (!user && email && password) {
            const existing = await user_model_1.User.findOne({ email: String(email).toLowerCase() });
            if (existing)
                return res.status(409).json({ message: 'User email already exists' });
            user = await user_model_1.User.create({
                email: String(email).toLowerCase(),
                passwordHash: await (0, auth_service_1.hashPassword)(password),
                role: user_model_1.Role.COACH,
                name: name || coach.name,
                profileRef: coach._id,
                mustChangePassword: false,
                isActive: true,
            });
        }
        if (!user) {
            return res.status(400).json({ message: 'Provide userId or email+password to create a login' });
        }
        user.role = user_model_1.Role.COACH;
        user.profileRef = coach._id;
        await user.save();
        coach.user = user._id;
        await coach.save();
        res.json({ coach, user: { id: user._id, email: user.email, role: user.role } });
    }
    catch (err) {
        next(err);
    }
};
exports.linkCoachUser = linkCoachUser;
