import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/coach', '/student', '/parent'] as const;

const ROLE_PREFIX: Record<string, string> = {
  admin: '/admin',
  coach: '/coach',
  student: '/student',
  parent: '/parent',
};

function getRequiredRole(pathname: string): string | null {
  for (const [role, prefix] of Object.entries(ROLE_PREFIX)) {
    if (pathname.startsWith(prefix)) return role;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('bca_token')?.value;
  const role = request.cookies.get('bca_role')?.value;
  const mustChange = request.cookies.get('bca_must_change')?.value === 'true';

  if (!token || !role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (mustChange && !pathname.startsWith('/login/change-password')) {
    return NextResponse.redirect(new URL('/login/change-password', request.url));
  }

  const requiredRole = getRequiredRole(pathname);
  if (requiredRole && role !== requiredRole) {
    const dashboard = ROLE_PREFIX[role] || '/';
    return NextResponse.redirect(new URL(`${dashboard}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/coach/:path*', '/student/:path*', '/parent/:path*'],
};
