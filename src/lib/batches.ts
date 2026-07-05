import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiCoachRef {
  _id: string;
  name: string;
  title?: string;
}

export interface ApiBatch {
  _id: string;
  name: string;
  schedule?: string;
  startDate: string;
  endDate?: string;
  coach?: ApiCoachRef | string;
  studentCount?: number;
}

export interface BatchDetail {
  batch: ApiBatch;
  students: { _id: string; studentId: string; name: string; age: number; chessLevel: string }[];
}

function token() {
  return getStoredToken();
}

export async function fetchBatches(): Promise<ApiBatch[]> {
  return apiRequest<ApiBatch[]>('/api/batches', { token: token() });
}

export async function fetchBatchDetail(id: string): Promise<BatchDetail> {
  return apiRequest<BatchDetail>(`/api/batches/${id}`, { token: token() });
}

export async function createBatch(body: {
  name: string;
  schedule?: string;
  startDate: string;
  endDate?: string;
  coach?: string;
}): Promise<ApiBatch> {
  return apiRequest<ApiBatch>('/api/batches', { method: 'POST', token: token(), body });
}

export async function updateBatch(
  id: string,
  body: Partial<{ name: string; schedule: string; startDate: string; endDate: string; coach: string }>
): Promise<ApiBatch> {
  return apiRequest<ApiBatch>(`/api/batches/${id}`, { method: 'PATCH', token: token(), body });
}

export async function deleteBatch(id: string): Promise<void> {
  await apiRequest<void>(`/api/batches/${id}`, { method: 'DELETE', token: token() });
}

export async function assignBatchStudents(id: string, studentIds: string[]): Promise<BatchDetail> {
  return apiRequest<BatchDetail>(`/api/batches/${id}/students`, {
    method: 'POST',
    token: token(),
    body: { studentIds },
  });
}

export async function fetchMyBatch(): Promise<{ batch: ApiBatch; student: { studentId: string; name: string } }> {
  return apiRequest('/api/batches/my', { token: token() });
}

export type BatchOption = { id: string; name: string };

export async function fetchBatchOptions(): Promise<BatchOption[]> {
  const data = await fetchBatches();
  return data.map((b) => ({ id: b._id, name: b.name }));
}
