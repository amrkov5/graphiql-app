'use client';

import Image from 'next/image';
import photoAnton from '../../../assets/img/about/photo-Anton.jpg';
import photoIrina from '../../../assets/img/about/photo-Irina.png';
import photoVitalii from '../../../assets/img/about/photo-Vitalii.jpg';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import styles from './about.module.css';

export default function AboutUs() {
  const t = useTranslations('About');

  return (
    <>
      <h1 className={styles.aboutHeading}>{t('aboutTeam')}</h1>
      <div className={styles.aboutWrapper}>
        <div className={styles.personCard} data-testid="card">
          <div className={styles.photoContainer}>
            <Image
              className={styles.photo}
              src={photoAnton}
              alt="member_photo"
              width={160}
              height={160}
            />
          </div>
          <p className={styles.personName}>{t('Anton.name')}</p>
          <p>{t('Anton.role')}</p>
          <p className={styles.personBio} data-testid="person-bio">
            {t('Anton.bio')}
          </p>
          <Link
            className={styles.personGitHub}
            href={'https://github.com/amrkov5'}
          >
            GitHub
          </Link>
        </div>
        <div className={styles.personCard} data-testid="card">
          <div className={styles.photoContainer}>
            <Image
              className={styles.photo}
              src={photoIrina}
              alt="member_photo"
              width={160}
              height={160}
            />
          </div>
          <p className={styles.personName}>{t('Irina.name')}</p>
          <p>{t('Irina.role')}</p>
          <p className={styles.personBio} data-testid="person-bio">
            {t('Irina.bio')}
          </p>
          <Link
            className={styles.personGitHub}
            href={'https://github.com/kolirina'}
          >
            GitHub
          </Link>
        </div>
        <div className={styles.personCard} data-testid="card">
          <div className={styles.photoContainer}>
            <Image
              className={styles.photo}
              src={photoVitalii}
              alt="member_photo"
              width={160}
              height={160}
            />
          </div>
          <p className={styles.personName}>{t('Vitalii.name')}</p>
          <p>{t('Vitalii.role')}</p>
          <p className={styles.personBio} data-testid="person-bio">
            {t('Vitalii.bio')}
          </p>
          <Link
            className={styles.personGitHub}
            href={'https://github.com/veta306'}
          >
            GitHub
          </Link>
        </div>
      </div>
    </>
  );
}
