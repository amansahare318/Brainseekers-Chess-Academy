import { apiRequest } from '@/lib/api';

export async function forgotPassword(input: {
  email?: string;
  mobile?: string;
  role?: string;
}) {
  return apiRequest<{ message: string; resetToken?: string; resetUrl?: string }>(
    '/api/auth/forgot-password',
    { method: 'POST', body: input }
  );
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  });
}
