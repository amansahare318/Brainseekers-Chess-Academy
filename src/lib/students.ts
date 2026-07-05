import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiParentRef {
  _id: string;
  name: string;
  mobile?: string;
  email?: string;
}

export interface ApiCoachRef {
  _id: string;
  name: string;
  title?: string;
}

export interface ApiBatchRef {
  _id: string;
  name: string;
}

export interface ApiStudent {
  _id: string;
  studentId: string;
  name: string;
  age: number;
  chessLevel: string;
  city: string;
  address?: string;
  mobile?: string;
  parent?: ApiParentRef | string;
  coach?: ApiCoachRef | string;
  batch?: ApiBatchRef | string;
  createdAt?: string;
}

export interface StudentsListResponse {
  students: ApiStudent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  batchId?: string;
  coachId?: string;
  chessLevel?: string;
}

const token = () => getStoredToken();

function buildQuery(params: StudentListParams) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.search) q.set('search', params.search);
  if (params.batchId) q.set('batchId', params.batchId);
  if (params.coachId) q.set('coachId', params.coachId);
  if (params.chessLevel) q.set('chessLevel', params.chessLevel);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function fetchStudentsPaginated(params: StudentListParams = {}): Promise<StudentsListResponse> {
  return apiRequest<StudentsListResponse>(`/api/students${buildQuery(params)}`, { token: token() });
}

/** Fetches all students (paginated internally) for dropdowns */
export async function fetchStudents(): Promise<ApiStudent[]> {
  const first = await fetchStudentsPaginated({ page: 1, limit: 50 });
  const all = [...first.students];
  for (let p = 2; p <= first.totalPages; p++) {
    const next = await fetchStudentsPaginated({ page: p, limit: 50 });
    all.push(...next.students);
  }
  return all;
}

export async function fetchStudentById(id: string): Promise<ApiStudent> {
  return apiRequest<ApiStudent>(`/api/students/${id}`, { token: token() });
}

export async function updateStudent(
  id: string,
  body: Partial<{
    name: string;
    age: number;
    chessLevel: string;
    parent: string;
    coach: string;
    batch: string;
    city: string;
    address: string;
    mobile: string;
  }>
): Promise<ApiStudent> {
  return apiRequest<ApiStudent>(`/api/students/${id}`, { method: 'PATCH', token: token(), body });
}

export async function deleteStudent(id: string): Promise<void> {
  await apiRequest<void>(`/api/students/${id}`, { method: 'DELETE', token: token() });
}

export async function fetchParentChildren(): Promise<ApiStudent[]> {
  return apiRequest<ApiStudent[]>('/api/students/parent/children', { token: token() });
}

export function refId(ref: ApiParentRef | ApiCoachRef | ApiBatchRef | string | undefined): string {
  if (!ref) return '';
  return typeof ref === 'object' ? ref._id : ref;
}
