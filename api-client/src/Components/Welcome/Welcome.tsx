'use client';

import Link from 'next/link';
import { auth, getUserName } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import styles from './welcome.module.css';
import { useTranslations } from 'next-intl';

export default function Welcome() {
  const t = useTranslations('Welcome');
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
    <div className={styles.welcomeWrapper} data-testid="welcome">
      <h1 className={styles.welcomeHeading}>
        {isLoggedIn ? `${t('return')}, ${userName}` : t('greeting')}!
      </h1>
      <div className={styles.linkWrapper}>
        {!isLoggedIn && (
          <>
            <Link href={'/signin'} className={styles.link}>
              {t('login')}
            </Link>
            <Link href={'/signup'} className={styles.link}>
              {t('register')}
            </Link>
          </>
        )}
        {!!isLoggedIn && (
          <>
            <Link href={'/GET'} className={styles.link}>
              {t('rest')}
            </Link>
            <Link href={'/GRAPHIQL'} className={styles.link}>
              {t('graphiql')}
            </Link>
            <Link href={'/history'} className={styles.link}>
              {t('history')}
            </Link>
          </>
        )}
      </div>
      <Link href={'/about'} className={styles.link}>
        {t('about')}
      </Link>
    </div>
  );
}
