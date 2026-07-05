import type { SessionRole } from '@/types/academy';

const TOKEN_KEY = 'bca_token';
const ROLE_KEY = 'bca_role';
const MUST_CHANGE_KEY = 'bca_must_change';
const USER_ID_KEY = 'bca_user_id';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function persistSession(input: {
  token: string;
  role: SessionRole;
  userId: string;
  mustChangePassword: boolean;
}) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, input.token);
  localStorage.setItem(ROLE_KEY, input.role);
  localStorage.setItem(USER_ID_KEY, input.userId);
  localStorage.setItem(MUST_CHANGE_KEY, String(input.mustChangePassword));

  setCookie('bca_token', input.token);
  setCookie('bca_role', input.role);
  setCookie('bca_must_change', String(input.mustChangePassword));
}

export function clearSession() {
  if (typeof window === 'undefined') return;

  [TOKEN_KEY, ROLE_KEY, USER_ID_KEY, MUST_CHANGE_KEY].forEach((k) => localStorage.removeItem(k));
  ['bca_token', 'bca_role', 'bca_must_change'].forEach(clearCookie);
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRole(): SessionRole | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'admin' || role === 'coach' || role === 'student' || role === 'parent') {
    return role;
  }
  return null;
}

export function getMustChangePassword() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUST_CHANGE_KEY) === 'true';
}

export function getStoredUserId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}
