'use client';

import { useEffect, useState } from 'react';
import { logInWithEmailAndPassword } from '../../firebase/firebase';
import Modal from '@/Components/Modal/Modal';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch } from 'react-redux';
import { setError, setLogIn, setLogOut } from '@/slices/loginSlice';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { FirebaseError } from 'firebase-admin';

const SignInPage: React.FC = () => {
  const [isSignInFaulty, setIsSignInFaulty] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations('SignInPage');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    dispatch(setLogOut());
  }, [dispatch]);

  const handleSignIn = async (data: AuthFormInputs, reset: () => void) => {
    try {
      const userInfo = await logInWithEmailAndPassword(
        data.email,
        data.password
      );
      fetch('/api/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await userInfo?.getIdToken()}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            dispatch(setLogIn());
            router.push('/');
            router.refresh();
          }
        })
        .catch(() => {
          setErrorMsg('API Error. Please check your internet connection');
        });
    } catch (error) {
      const msg = (error as FirebaseError).message;
      setIsSignInFaulty(true);
      reset();
      dispatch(setError(true));
      if (msg.includes('auth/invalid-credential')) {
        setErrorMsg(t('invalidCredentials'));
      }
      if (msg.includes('auth/network-request-failed')) {
        setErrorMsg(t('noInternet'));
      }
    }
  };

  const handleCloseModal = () => {
    setIsSignInFaulty(false);
    dispatch(setError(false));
    setErrorMsg('');
  };

  return (
    <>
      <div>
        <div>
          <AuthForm
            isRegistering={false}
            onSubmit={(data) => {
              handleSignIn(data, () => {
                document.querySelector('form')?.reset();
              });
            }}
          />
        </div>
        {isSignInFaulty && (
          <Modal message={errorMsg} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
};

export default SignInPage;
