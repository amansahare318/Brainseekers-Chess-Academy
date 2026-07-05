import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiGalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  category: string;
  createdAt: string;
}

const token = () => getStoredToken();

export async function fetchGallery(category?: string): Promise<ApiGalleryImage[]> {
  const q = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiRequest<ApiGalleryImage[]>(`/api/gallery${q}`);
}

export async function fetchGalleryCategories(): Promise<string[]> {
  return apiRequest<string[]>('/api/gallery/categories');
}

export async function createGalleryImage(body: {
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  category?: string;
}) {
  return apiRequest<ApiGalleryImage>('/api/gallery', { method: 'POST', token: token(), body });
}

export async function deleteGalleryImage(id: string) {
  await apiRequest<void>(`/api/gallery/${id}`, { method: 'DELETE', token: token() });
}
