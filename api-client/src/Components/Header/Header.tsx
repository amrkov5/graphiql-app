'use client';

import {
  auth,
  logInWithEmailAndPassword,
  logout,
  registerWithEmailAndPassword,
} from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from './Logo';

import styles from './header.module.css';

export default function Header() {
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
      alert('go to main');
    } else {
      alert('go to login page');
      logInWithEmailAndPassword('anton@mail.com', '123qweASD!');
    }
  };

  const onSignUpOutClick = () => {
    if (isLoggedIn) {
      alert('logging out');
      logout();
    } else {
      alert('go to register page');
      registerWithEmailAndPassword('anton', 'anton@mail.com', '123qweASD!');
    }
  };

  const buttons = (
    <>
      <button
        onClick={onSignInMainClick}
        className={styles.btn}
        disabled={isLoading}
      >
        {`${isLoggedIn ? 'Main' : 'Sign In'}`}
      </button>
      <button
        className={styles.btn}
        onClick={onSignUpOutClick}
        disabled={isLoading}
      >
        {`${isLoggedIn ? 'Sign Out' : 'Sign Up'}`}
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
      <div>Language toggler</div>
      <div className={styles.btnWrapper}>{buttons}</div>
    </header>
  );
}
