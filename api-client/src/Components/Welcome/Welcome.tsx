'use client';

import Link from 'next/link';
import styles from './welcome.module.css';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectLoginState } from '@/slices/loginSlice';
import { useRouter } from 'nextjs-toploader/app';

export default function Welcome({ userName }: { userName: string | null }) {
  const t = useTranslations('Welcome');
  const isLoggedIn = useSelector(selectLoginState);
  const router = useRouter();
  const handleClick = (href: string) => {
    router.push(`${href}`);
    router.refresh();
  };

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
            <button className={styles.btn} onClick={() => handleClick('/GET')}>
              {t('rest')}
            </button>
            <button
              className={styles.btn}
              onClick={() => handleClick('/GRAPHQL')}
            >
              {t('graphiql')}
            </button>
            <button
              className={styles.btn}
              onClick={() => handleClick('/history')}
            >
              {t('history')}
            </button>
          </>
        )}
      </div>
      <Link href={'/about'} className={styles.link}>
        {t('about')}
      </Link>
    </div>
  );
}
