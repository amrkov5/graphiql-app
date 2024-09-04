'use client';

import store from '@/store';
import { Provider } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { ReactNode } from 'react';

export default function Layout({
  children,
  initialLoggedIn,
}: Readonly<{
  children: ReactNode;
  initialLoggedIn: boolean;
}>) {
  return (
    <Provider store={store}>
      <Header initialLoggedIn={initialLoggedIn} />
      <main className="main">{children}</main>
      <Footer />
    </Provider>
  );
}
