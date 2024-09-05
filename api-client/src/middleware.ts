import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname: string = request.nextUrl.pathname;
  const avoidedRoutes = ['/signin', '/signup'];

  if (!session && !avoidedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  if (!session && avoidedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const responseAPI = await fetch('http://localhost:3000/api/login', {
    headers: {
      Cookie: `session=${session?.value}`,
    },
    cache: 'no-store',
  });
  if (responseAPI.status !== 200) {
    if (!avoidedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }
  if (avoidedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/history',
    '/(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)',
    '/(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)/([^/]+)?',
    '/(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)/([^/]+)/([^/]+)',
    '/signin',
    '/signup',
  ],
};
