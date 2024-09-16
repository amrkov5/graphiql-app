'use client';
import { useTranslations } from 'next-intl';
import styles from './notFound.module.css';
import { useRouter } from 'nextjs-toploader/app';

const NotFound = () => {
  const router = useRouter();
  const t = useTranslations('NotFound');
  return (
    <div className={styles.wrapper}>
      <h1>404 | {t('404')}</h1>
      <p className={styles.message}>{t('message')}</p>
      <button className={styles.btn} onClick={() => router.push('/')}>
        {t('toMain')}
      </button>
    </div>
  );
};

export default NotFound;
