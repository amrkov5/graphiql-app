import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = cookies().get('session')?.value || '';
  if (session) {
    const options = {
      name: 'session',
      value: '',
      maxAge: -1,
    };

    cookies().set(options);

    const expiresIn = 60 * 5 * 1000;
    const sessionCookie = await auth().createSessionCookie(session, {
      expiresIn,
    });
    const newOptions = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    cookies().set(newOptions);
    return NextResponse.json({ status: 200 });
  }
  return NextResponse.json({ status: 500 });
}
