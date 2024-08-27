'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '../../Components/AuthForm/AuthForm';
import { auth, registerWithEmailAndPassword } from '../../firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Modal from '../../Components/Modal/Modal';
import { useTranslations } from 'next-intl';
import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [isSignedIn, setIisSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignUpFaulty, setIsSignUpFaulty] = useState(false);
  const t = useTranslations('SignUpPage');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        router.push('/');
      } else setIisSignedIn(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignUp = async (data: AuthFormInputs, reset: () => void) => {
    console.log('Sign up data:', data);
    if (data.name) {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      };
      try {
        await registerWithEmailAndPassword(
          trimmedData.name,
          trimmedData.email,
          trimmedData.password
        );
        setIsSignUpFaulty(false);
        router.push('/');
      } catch (error) {
        console.error('Error during sign-up:', error);
        setIsSignUpFaulty(true);
        reset();
      }
    }
  };

  const handleCloseModal = () => {
    setIsSignUpFaulty(false);
  };

  return (
    <>
      {!isSignedIn && (
        <div>
          <div
            className={
              isSignUpFaulty
                ? styles.formContainerWithModal
                : styles.formContainer
            }
          >
            <AuthForm
              isRegistering={true}
              onSubmit={(data) => {
                handleSignUp(data, () => {
                  document.querySelector('form')?.reset();
                });
              }}
            />
          </div>
          {isSignUpFaulty && (
            <Modal message={t('modalMessage')} onClose={handleCloseModal} />
          )}
        </div>
      )}
    </>
  );
};

export default SignUpPage;
