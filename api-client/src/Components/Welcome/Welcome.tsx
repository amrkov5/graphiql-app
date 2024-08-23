'use client';

import Link from 'next/link';
import { auth, getUserName } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import styles from './welcome.module.css';

export default function Welcome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const name = await getUserName(user.uid);
        setUserName(name);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  return (
    <div className={styles.welcomeWrapper}>
      <h1 className={styles.welcomeHeading}>
        Welcome{isLoggedIn ? ` back, ${userName}` : ''}!
      </h1>
      <div className={styles.linkWrapper}>
        {!isLoggedIn && (
          <>
            <Link href={'/login'} className={styles.link}>
              Sign In
            </Link>
            <Link href={'/signup'} className={styles.link}>
              Sign Up
            </Link>
          </>
        )}
        {!!isLoggedIn && (
          <>
            <Link href={'/rest'} className={styles.link}>
              REST Client
            </Link>
            <Link href={'/graphiql'} className={styles.link}>
              GraphiQL Client
            </Link>
            <Link href={'/history'} className={styles.link}>
              History
            </Link>
          </>
        )}
      </div>
      <Link href={'/about'} className={styles.link}>
        About Us
      </Link>
    </div>
  );
}
