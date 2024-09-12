import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';
import { cookies } from 'next/headers';
import Layout from '@/Components/Layout';

import './globals.css';

export const metadata: Metadata = {
  title: 'API Client',
  description: 'API Client for RS School',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const apiUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/login'
      : 'https://ai-team-api-app.vercel.app/api/login';

  const session = cookies().get('session');
  const responseAPI = session
    ? await fetch(apiUrl, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      })
    : null;
  const isLoggedIn = responseAPI?.status === 200 ? true : false;
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextTopLoader showSpinner={false} />
          <Layout initialLoggedIn={isLoggedIn}>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
