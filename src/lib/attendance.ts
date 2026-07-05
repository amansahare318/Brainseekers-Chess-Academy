import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface ApiAttendance {
  _id: string;
  student: { _id: string; studentId?: string; name?: string } | string;
  batch: { _id: string; name?: string } | string;
  coach: { _id: string; name?: string } | string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

const token = () => getStoredToken();

export async function fetchAttendance(filters?: { month?: number; year?: number; batchId?: string }) {
  const params = new URLSearchParams();
  if (filters?.month) params.set('month', String(filters.month));
  if (filters?.year) params.set('year', String(filters.year));
  if (filters?.batchId) params.set('batchId', filters.batchId);
  const q = params.toString() ? `?${params}` : '';
  return apiRequest<ApiAttendance[]>(`/api/attendance${q}`, { token: token() });
}

export async function fetchAttendanceStats(month?: number, year?: number) {
  const params = new URLSearchParams();
  if (month) params.set('month', String(month));
  if (year) params.set('year', String(year));
  return apiRequest<{
    month: number;
    year: number;
    totals: { _id: string; count: number }[];
    byBatch: { _id: string; present: number; absent: number; late: number; total: number; batch?: { name: string } }[];
    totalStudents: number;
  }>(`/api/attendance/stats?${params}`, { token: token() });
}

export async function fetchAttendanceByStudent(studentId: string) {
  return apiRequest<ApiAttendance[]>(`/api/attendance/student/${studentId}`, { token: token() });
}

export async function fetchAttendanceByBatch(batchId: string, date: string) {
  return apiRequest<ApiAttendance[]>(`/api/attendance/batch/${batchId}?date=${date}`, { token: token() });
}

export async function createAttendance(body: {
  student: string;
  batch: string;
  coach: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}) {
  return apiRequest<ApiAttendance>('/api/attendance', { method: 'POST', token: token(), body });
}

export async function bulkAttendance(records: Parameters<typeof createAttendance>[0][]) {
  return apiRequest<ApiAttendance[]>('/api/attendance/bulk', { method: 'POST', token: token(), body: { records } });
}

export async function updateAttendance(id: string, body: { status?: AttendanceStatus; remarks?: string }) {
  return apiRequest<ApiAttendance>(`/api/attendance/${id}`, { method: 'PATCH', token: token(), body });
}

export async function fetchCoachAttendanceContext() {
  return apiRequest<{
    batches: { _id: string; name: string }[];
    students: { _id: string; studentId: string; name: string; batch?: string }[];
    coachId: string;
  }>('/api/attendance/coach/context', { token: token() });
}
