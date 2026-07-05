import { Response, NextFunction } from 'express';
import { BlogPost } from '../models/blog.model';
import { AuthRequest } from '../middleware/auth.middleware';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const listPublicBlogs = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .populate('author', 'name email')
      .select('-content')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getPublicBlogBySlug = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true }).populate(
      'author',
      'name'
    );
    if (!post) return next({ status: 404, message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const listAdminBlogs = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPost.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const createBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, featuredImage, featuredImagePublicId, published, slug } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'title and content are required' });

    const finalSlug = slug ? slugify(slug) : slugify(title);
    const post = await BlogPost.create({
      title,
      slug: finalSlug,
      content,
      featuredImage,
      featuredImagePublicId,
      published: Boolean(published),
      author: req.user!.id,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const updateBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next({ status: 404, message: 'Post not found' });

    const { title, content, featuredImage, featuredImagePublicId, published, slug } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (featuredImagePublicId !== undefined) post.featuredImagePublicId = featuredImagePublicId;
    if (published !== undefined) post.published = Boolean(published);
    if (slug) post.slug = slugify(slug);

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return next({ status: 404, message: 'Post not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
