import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import { cookies } from 'next/headers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'API Client',
  description: 'API Client for RS School',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const authToken = cookies().get('authToken');
  // console.log(authToken);
  // if (authToken) [

  // ]
  onAuthStateChanged(auth, (user) => {
    console.log(user);
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
