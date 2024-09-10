'use client';

import store from '@/store';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

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
