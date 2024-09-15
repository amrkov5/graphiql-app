'use client';

import { logout } from '../../firebase/firebase';
import Link from 'next/link';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import styles from './header.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoginState, setLogIn, setLogOut } from '@/slices/loginSlice';
import { useRouter } from 'nextjs-toploader/app';
import Modal from '../Modal/Modal';

export default function Header({
  initialLoggedIn,
}: {
  initialLoggedIn: boolean;
}) {
  const router = useRouter();
  const t = useTranslations('Header');
  const [sticky, setSticky] = useState(false);
  const dispatch = useDispatch();
  const loginStatus = useSelector(selectLoginState);
  const [isAuth, setIsAuth] = useState(initialLoggedIn);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [headerError, setHeaderError] = useState('');

  useEffect(() => {
    const checkCookies = async () => {
      if (loginStatus) {
        try {
          const apiUrl =
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3000/api/login'
              : 'https://ai-team-api-app.vercel.app/api/login';
          const checkResult = await fetch(apiUrl, {
            headers: {
              Cookie: '',
            },
            cache: 'no-store',
          });
          if (checkResult.status !== 200) {
            dispatch(setLogOut());
            onSignUpOutClick();
          }
        } catch {}
      }
    };

    const cookiesTimer = setInterval(checkCookies, 30000);
    return () => clearInterval(cookiesTimer);
  }, [loginStatus, dispatch]);

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
    if (initialLoggedIn) {
      dispatch(setLogIn());
    }
  }, [initialLoggedIn, dispatch]);

  useEffect(() => {
    if (!isFirstLoad) {
      setIsAuth(loginStatus);
    }
    setIsFirstLoad(false);
  }, [loginStatus, isFirstLoad]);

  const onSignInMainClick = () => {
    if (loginStatus) {
      router.push('/');
    } else {
      router.push('/signin');
    }
  };

  const onSignUpOutClick = async () => {
    if (loginStatus) {
      const apiUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/logout'
          : 'https://ai-team-api-app.vercel.app/api/logout';

      try {
        logout();
        const response = await fetch(apiUrl, {
          method: 'POST',
        });

        if (response.status === 200) {
          dispatch(setLogOut());
          router.refresh();
          router.push('/');
        }
      } catch (err) {
        setHeaderError(
          'Failed to connect to the server... \nCheck Internet connection'
        );
      }
    } else {
      router.push('/signup');
    }
  };

  const buttons = (
    <>
      <button onClick={onSignInMainClick} className={styles.btn}>
        {`${isAuth ? t('main') : t('login')}`}
      </button>
      <button className={styles.btn} onClick={onSignUpOutClick}>
        {`${isAuth ? t('logout') : t('register')}`}
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
      {headerError && (
        <Modal message={headerError} onClose={() => router.refresh()} />
      )}
    </header>
  );
}
