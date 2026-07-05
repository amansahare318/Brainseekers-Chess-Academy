import { apiRequest } from '@/lib/api';

export async function requestOtp(mobile: string, role: 'student' | 'parent') {
  return apiRequest<{ message: string; mockCode?: string }>('/api/otp/request', {
    method: 'POST',
    body: { mobile, role },
  });
}

export async function verifyOtp(mobile: string, role: 'student' | 'parent', code: string) {
  return apiRequest<{ token: string; user: { id: string; role: string; mustChangePassword: boolean; profileRef?: string } }>(
    '/api/otp/verify',
    { method: 'POST', body: { mobile, role, code } }
  );
}
