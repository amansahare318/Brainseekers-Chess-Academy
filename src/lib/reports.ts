import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiProgressReport {
  _id: string;
  student: { _id: string; studentId?: string; name?: string } | string;
  coach: { _id: string; name?: string } | string;
  tacticalSkills: number;
  openingKnowledge: number;
  endgameSkills: number;
  tournamentPerformance: number;
  discipline: number;
  remarks: string;
  rating: number;
  createdAt: string;
}

const token = () => getStoredToken();

export async function fetchReports(studentId?: string) {
  const q = studentId ? `?studentId=${studentId}` : '';
  return apiRequest<ApiProgressReport[]>(`/api/reports${q}`, { token: token() });
}

export async function fetchReportsForStudent(studentId: string) {
  return apiRequest<ApiProgressReport[]>(`/api/reports/student/${studentId}`, { token: token() });
}

export async function createReport(body: Omit<ApiProgressReport, '_id' | 'createdAt' | 'student' | 'coach'> & {
  student: string;
  coach: string;
}) {
  return apiRequest<ApiProgressReport>('/api/reports', { method: 'POST', token: token(), body });
}

export async function updateReport(id: string, body: Partial<ApiProgressReport>) {
  return apiRequest<ApiProgressReport>(`/api/reports/${id}`, { method: 'PATCH', token: token(), body });
}
