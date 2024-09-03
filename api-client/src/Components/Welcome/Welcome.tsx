'use client';

import Link from 'next/link';
import styles from './welcome.module.css';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectLoginState } from '@/slices/loginSlice';

export default function Welcome({ userName }: { userName: string | null }) {
  const t = useTranslations('Welcome');
  const isLoggedIn = useSelector(selectLoginState);

  return (
    <div className={styles.welcomeWrapper} data-testid="welcome">
      <h1 className={styles.welcomeHeading}>
        {isLoggedIn && userName ? `${t('return')}, ${userName}` : t('greeting')}
        !
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
        {isLoggedIn && (
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
