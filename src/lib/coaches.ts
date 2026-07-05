import { apiRequest } from '@/lib/api';
import { getStoredToken } from '@/lib/session';

export interface ApiCoach {
  _id: string;
  name: string;
  email: string;
  title: string;
  elo: string;
  photoUrl?: string;
  user?: string;
  linkedUser?: { email?: string; role?: string };
}

export interface CoachOption {
  id: string;
  name: string;
  title: string;
}

export interface CoachMeResponse {
  user: { id: string; email?: string; name?: string };
  coach: ApiCoach;
}

const token = () => getStoredToken();

export async function fetchCoachOptions(): Promise<CoachOption[]> {
  const data = await apiRequest<ApiCoach[]>('/api/coaches', { token: token() });
  return data.map((c) => ({ id: c._id, name: c.name, title: c.title }));
}

export async function fetchCoachMe(): Promise<CoachMeResponse> {
  return apiRequest<CoachMeResponse>('/api/coaches/me', { token: token() });
}

export async function fetchPublicCoaches(): Promise<ApiCoach[]> {
  return apiRequest<ApiCoach[]>('/api/coaches/public');
}
