import { getStoredToken } from '@/lib/session';
import { ApiError } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File, folder = 'general'): Promise<UploadResult> {
  const token = getStoredToken();
  const form = new FormData();
  form.append('image', file);
  form.append('folder', folder);

  const res = await fetch(`${API_BASE}/api/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message || 'Upload failed');
  }
  return data as UploadResult;
}

export async function deleteUploadedImage(publicId: string): Promise<void> {
  const token = getStoredToken();
  const encoded = encodeURIComponent(publicId);
  const res = await fetch(`${API_BASE}/api/uploads/image/${encoded}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.message || 'Delete failed');
  }
}
