import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiCertificate {
  _id: string;
  student: { _id: string; studentId?: string; name?: string } | string;
  certificateName: string;
  issueDate: string;
  description?: string;
}

const token = () => getStoredToken();

export async function fetchCertificates(studentId?: string) {
  const q = studentId ? `?studentId=${studentId}` : '';
  return apiRequest<ApiCertificate[]>(`/api/certificates${q}`, { token: token() });
}

export async function createCertificate(body: {
  student: string;
  certificateName: string;
  issueDate?: string;
  description?: string;
}) {
  return apiRequest<ApiCertificate>('/api/certificates', { method: 'POST', token: token(), body });
}

export async function deleteCertificate(id: string) {
  await apiRequest(`/api/certificates/${id}`, { method: 'DELETE', token: token() });
}

export function certificateDownloadUrl(id: string) {
  return `${API_BASE}/api/certificates/${id}/download`;
}

export async function openCertificateDownload(id: string) {
  const t = token();
  const res = await fetch(`${API_BASE}/api/certificates/${id}/download`, {
    headers: t ? { Authorization: `Bearer ${t}` } : {},
  });
  const html = await res.text();
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
