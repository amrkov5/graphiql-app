'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logInWithEmailAndPassword } from '../../firebase';
import styles from './SignInPage.module.css';
import Modal from '@/Components/Modal/Modal';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useTranslations } from 'next-intl';

const SignInPage: React.FC = () => {
  const [isSignInFaulty, setIsSignInFaulty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIisSignedIn] = useState(true);
  const router = useRouter();
  const t = useTranslations('SignInPage');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        router.push('/');
      } else setIisSignedIn(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async (data: AuthFormInputs, reset: () => void) => {
    console.log('Sign in data:', data);
    try {
      await logInWithEmailAndPassword(data.email, data.password);
      setIsSignInFaulty(false);
      router.push('/');
    } catch (error) {
      console.error('Error during sign-in:', error);
      setIsSignInFaulty(true);
      reset();
    }
  };

  const handleCloseModal = () => {
    setIsSignInFaulty(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!isSignedIn && (
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
            <Modal message={t('modalMessage')} onClose={handleCloseModal} />
          )}
        </div>
      )}
    </>
  );
};

export default SignInPage;
