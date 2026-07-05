import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';
import type { ChessLevel, Lead, LeadStatus } from '@/types/academy';

export interface ApiLead {
  _id: string;
  studentName: string;
  age: number;
  chessLevel: string;
  parentName: string;
  parentMobile: string;
  parentEmail?: string;
  city: string;
  address?: string;
  studentMobile?: string;
  learningGoal: string;
  status: LeadStatus;
  trialDate?: string;
  trialTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLeadInput {
  studentName: string;
  age: number;
  chessLevel: ChessLevel | string;
  parentName: string;
  parentMobile: string;
  parentEmail?: string;
  city: string;
  address?: string;
  studentMobile?: string;
  learningGoal: string;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  trialDate?: string;
  trialTime?: string;
  parentEmail?: string;
  address?: string;
  studentMobile?: string;
  learningGoal?: string;
}

export interface ConvertLeadResult {
  lead: ApiLead;
  student: { _id: string; studentId: string; name: string };
  credentials?: {
    parent?: { mobile: string; temporaryPassword: string };
    student?: { mobile: string; temporaryPassword: string };
  };
}

function formatDate(value?: string | Date): string | undefined {
  if (!value) return undefined;
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().split('T')[0];
}

export function mapApiLead(api: ApiLead): Lead {
  return {
    id: api._id,
    studentName: api.studentName,
    age: api.age,
    chessLevel: api.chessLevel as Lead['chessLevel'],
    parentName: api.parentName,
    parentMobile: api.parentMobile,
    parentEmail: api.parentEmail,
    city: api.city,
    address: api.address,
    studentMobile: api.studentMobile,
    learningGoal: api.learningGoal,
    status: api.status,
    trialDate: formatDate(api.trialDate),
    trialTime: api.trialTime,
    createdAt: formatDate(api.createdAt) || new Date().toISOString().split('T')[0],
  };
}

function authToken() {
  return getStoredToken();
}

export async function createLeadPublic(input: CreateLeadInput): Promise<Lead> {
  const data = await apiRequest<ApiLead>('/api/leads', {
    method: 'POST',
    body: input,
  });
  return mapApiLead(data);
}

export async function fetchLeads(): Promise<Lead[]> {
  const token = authToken();
  const data = await apiRequest<ApiLead[]>('/api/leads', { token });
  return data.map(mapApiLead);
}

export async function fetchLeadById(id: string): Promise<Lead> {
  const token = authToken();
  const data = await apiRequest<ApiLead>(`/api/leads/${id}`, { token });
  return mapApiLead(data);
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
  const token = authToken();
  const data = await apiRequest<ApiLead>(`/api/leads/${id}`, {
    method: 'PATCH',
    token,
    body: input,
  });
  return mapApiLead(data);
}

export async function convertLead(
  id: string,
  body: { coachId?: string; batchId?: string }
): Promise<ConvertLeadResult> {
  const token = authToken();
  return apiRequest<ConvertLeadResult>(`/api/leads/${id}/convert`, {
    method: 'POST',
    token,
    body,
  });
}
