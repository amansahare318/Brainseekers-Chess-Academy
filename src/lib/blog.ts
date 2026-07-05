import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiBlogPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  author?: { _id: string; name?: string; email?: string } | string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

const token = () => getStoredToken();

export async function fetchPublicBlogs(): Promise<ApiBlogPost[]> {
  return apiRequest<ApiBlogPost[]>('/api/blog/public');
}

export async function fetchPublicBlogBySlug(slug: string): Promise<ApiBlogPost> {
  return apiRequest<ApiBlogPost>(`/api/blog/public/${slug}`);
}

export async function fetchAdminBlogs(): Promise<ApiBlogPost[]> {
  return apiRequest<ApiBlogPost[]>('/api/blog', { token: token() });
}

export async function createBlog(body: {
  title: string;
  content: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  published?: boolean;
  slug?: string;
}) {
  return apiRequest<ApiBlogPost>('/api/blog', { method: 'POST', token: token(), body });
}

export async function updateBlog(
  id: string,
  body: Partial<{ title: string; content: string; featuredImage: string; published: boolean; slug: string }>
) {
  return apiRequest<ApiBlogPost>(`/api/blog/${id}`, { method: 'PATCH', token: token(), body });
}

export async function deleteBlog(id: string) {
  await apiRequest<void>(`/api/blog/${id}`, { method: 'DELETE', token: token() });
}
