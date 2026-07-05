import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiAssignment {
  _id: string;
  title: string;
  description: string;
  coach: { _id: string; name?: string } | string;
  batch: { _id: string; name?: string } | string;
  dueDate: string;
  attachments: { name: string; url: string }[];
  submission?: { content: string; submittedAt: string } | null;
  submissionCount?: number;
}

const token = () => getStoredToken();

export async function fetchAssignments(batchId?: string) {
  const q = batchId ? `?batchId=${batchId}` : '';
  return apiRequest<ApiAssignment[]>(`/api/assignments${q}`, { token: token() });
}

export async function createAssignment(body: {
  title: string;
  description: string;
  coach: string;
  batch: string;
  dueDate: string;
  attachments?: { name: string; url: string }[];
}) {
  return apiRequest<ApiAssignment>('/api/assignments', { method: 'POST', token: token(), body });
}

export async function updateAssignment(id: string, body: Partial<ApiAssignment>) {
  return apiRequest<ApiAssignment>(`/api/assignments/${id}`, { method: 'PATCH', token: token(), body });
}

export async function deleteAssignment(id: string) {
  await apiRequest(`/api/assignments/${id}`, { method: 'DELETE', token: token() });
}

export async function submitAssignment(body: { assignmentId: string; content: string; attachmentUrl?: string }) {
  return apiRequest('/api/assignments/submit', { method: 'POST', token: token(), body });
}

export async function fetchSubmissions(assignmentId?: string) {
  const q = assignmentId ? `?assignmentId=${assignmentId}` : '';
  return apiRequest(`/api/assignments/submissions${q}`, { token: token() });
}
