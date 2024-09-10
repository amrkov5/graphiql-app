'use client';

import { registerWithEmailAndPassword } from '../../firebase/firebase';
import { useEffect, useState } from 'react';
import Modal from '../../Components/Modal/Modal';
import { useTranslations } from 'next-intl';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch } from 'react-redux';
import { setError, setLogIn, setLogOut } from '@/slices/loginSlice';
import { useRouter } from 'nextjs-toploader/app';
import { FirebaseError } from 'firebase-admin';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSignUpFaulty, setIsSignUpFaulty] = useState(false);
  const t = useTranslations('SignUpPage');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    dispatch(setLogOut());
  }, [dispatch]);

  const handleSignUp = async (data: AuthFormInputs, reset: () => void) => {
    if (data.name) {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      };
      try {
        const userInfo = await registerWithEmailAndPassword(
          trimmedData.name,
          trimmedData.email,
          trimmedData.password
        );

        const apiUrl =
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api/login'
            : 'https://ai-team-api-app.vercel.app/api/login';

        fetch(apiUrl, {
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
        setIsSignUpFaulty(true);
        reset();
        dispatch(setError(true));
        if (msg.includes('auth/network-request-failed')) {
          setErrorMsg(t('noInternet'));
        }
        if (msg.includes('auth/email-already-in-use')) {
          setErrorMsg(t('inUse'));
        }
      }
    }
  };
  const handleCloseModal = () => {
    setIsSignUpFaulty(false);
    dispatch(setError(false));
  };

  return (
    <>
      <div>
        <AuthForm
          isRegistering={true}
          onSubmit={(data) => {
            handleSignUp(data, () => {
              document.querySelector('form')?.reset();
            });
          }}
        />

        {isSignUpFaulty && (
          <Modal message={errorMsg} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
};

export default SignUpPage;
