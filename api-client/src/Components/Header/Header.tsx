'use client';

import { auth, logout } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import styles from './header.module.css';

export default function Header() {
  const router = useRouter();
  const t = useTranslations('Header');
  const [sticky, setSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSignInMainClick = () => {
    if (isLoggedIn) {
      router.push('/');
    } else {
      router.push('/signin');
    }
  };

  const onSignUpOutClick = () => {
    if (isLoggedIn) {
      logout();
      router.push('/');
    } else {
      router.push('/signup');
    }
  };

  const buttons = (
    <>
      <button
        onClick={onSignInMainClick}
        className={styles.btn}
        disabled={isLoading}
      >
        {`${isLoggedIn ? t('main') : t('login')}`}
      </button>
      <button
        className={styles.btn}
        onClick={onSignUpOutClick}
        disabled={isLoading}
      >
        {`${isLoggedIn ? t('logout') : t('register')}`}
      </button>
    </>
  );

  return (
    <header
      className={`${styles.header} ${sticky ? styles.sticky : ''}`}
      data-testid="header"
    >
      <Link href={'/'} className={styles.headerLogo}>
        <Logo />
      </Link>
      <div className={styles.btnWrapper}>
        <LocaleSwitcher />
        {buttons}
      </div>
    </header>
  );
}
