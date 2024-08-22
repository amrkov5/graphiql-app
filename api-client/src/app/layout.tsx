import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';

import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'API Client',
  description: 'API Client for RS School',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
