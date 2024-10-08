import { customInitApp } from '@/firebase/firebase-admin-config';
import { auth } from 'firebase-admin';
import { FirebaseAuthError } from 'firebase-admin/auth';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

customInitApp();

export async function POST() {
  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(idToken);

    if (decodedToken) {
      const expiresIn = 60 * 30 * 1000;
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export async function GET() {
  const session = cookies().get('session')?.value || '';
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
  try {
    const decodedClaims = await auth().verifySessionCookie(session, true);
    if (decodedClaims) {
      return NextResponse.json({ isLogged: true }, { status: 200 });
    }
  } catch (err) {
    if ((err as FirebaseAuthError).code === 'auth/session-cookie-expired') {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }
    return NextResponse.json({ isLogged: false }, { status: 500 });
  }
}
