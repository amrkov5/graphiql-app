import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import './firebase';

const protectedRoutes = ['/rest', '/graphiql', '/history'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (protectedRoutes.includes(pathname)) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: protectedRoutes,
};
