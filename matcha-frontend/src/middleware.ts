import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/register', '/activate'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/browse', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|pubapi|_next/static|_next/image|favicon.ico).*)',
  ],
};