'use client';

import { Locale, setUserLocale } from '@/services/locale';
import { useLocale } from 'next-intl';
import styles from './LocaleSwitcher.module.css';

export default function LocaleSwitcher() {
  const locale = useLocale();

  function changeTo(value: string) {
    if (value !== locale) {
      const locale = value as Locale;
      setUserLocale(locale);
    }
  }

  return (
    <>
      <div
        className={`${styles.locale} ${locale === 'en' ? styles.selected : ''}`}
        onClick={() => changeTo('en')}
      >
        EN
      </div>
      <div
        className={`${styles.locale} ${locale === 'ru' ? styles.selected : ''}`}
        onClick={() => changeTo('ru')}
      >
        RU
      </div>
    </>
  );
}
