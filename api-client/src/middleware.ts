import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const responseAPI = await fetch('http://localhost:3000/api/login', {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });

  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/history', '/graphiql', '/GET'],
};

// import { NextRequest, NextResponse } from 'next/server';
// import { getAuth } from 'firebase/auth';
// import './firebase/firebase-config';

// const protectedRoutes = ['/rest', '/graphiql', '/history'];

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   if (protectedRoutes.includes(pathname)) {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       return NextResponse.redirect(new URL('/signin', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/rest', '/graphiql', '/history'],
// };
