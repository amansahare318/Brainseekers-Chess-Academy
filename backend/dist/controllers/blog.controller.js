"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.listAdminBlogs = exports.getPublicBlogBySlug = exports.listPublicBlogs = void 0;
const blog_model_1 = require("../models/blog.model");
const slugify = (text) => text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const listPublicBlogs = async (_req, res, next) => {
    try {
        const posts = await blog_model_1.BlogPost.find({ published: true })
            .populate('author', 'name email')
            .select('-content')
            .sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (err) {
        next(err);
    }
};
exports.listPublicBlogs = listPublicBlogs;
const getPublicBlogBySlug = async (req, res, next) => {
    try {
        const post = await blog_model_1.BlogPost.findOne({ slug: req.params.slug, published: true }).populate('author', 'name');
        if (!post)
            return next({ status: 404, message: 'Post not found' });
        res.json(post);
    }
    catch (err) {
        next(err);
    }
};
exports.getPublicBlogBySlug = getPublicBlogBySlug;
const listAdminBlogs = async (_req, res, next) => {
    try {
        const posts = await blog_model_1.BlogPost.find().populate('author', 'name email').sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (err) {
        next(err);
    }
};
exports.listAdminBlogs = listAdminBlogs;
const createBlog = async (req, res, next) => {
    try {
        const { title, content, featuredImage, featuredImagePublicId, published, slug } = req.body;
        if (!title || !content)
            return res.status(400).json({ message: 'title and content are required' });
        const finalSlug = slug ? slugify(slug) : slugify(title);
        const post = await blog_model_1.BlogPost.create({
            title,
            slug: finalSlug,
            content,
            featuredImage,
            featuredImagePublicId,
            published: Boolean(published),
            author: req.user.id,
        });
        res.status(201).json(post);
    }
    catch (err) {
        next(err);
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res, next) => {
    try {
        const post = await blog_model_1.BlogPost.findById(req.params.id);
        if (!post)
            return next({ status: 404, message: 'Post not found' });
        const { title, content, featuredImage, featuredImagePublicId, published, slug } = req.body;
        if (title)
            post.title = title;
        if (content)
            post.content = content;
        if (featuredImage !== undefined)
            post.featuredImage = featuredImage;
        if (featuredImagePublicId !== undefined)
            post.featuredImagePublicId = featuredImagePublicId;
        if (published !== undefined)
            post.published = Boolean(published);
        if (slug)
            post.slug = slugify(slug);
        await post.save();
        res.json(post);
    }
    catch (err) {
        next(err);
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res, next) => {
    try {
        const post = await blog_model_1.BlogPost.findByIdAndDelete(req.params.id);
        if (!post)
            return next({ status: 404, message: 'Post not found' });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBlog = deleteBlog;
