'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { logInWithEmailAndPassword } from '@/firebase';
import { useState } from 'react';
import Modal from '@/Components/Modal/Modal';
import styles from './SignInPage.module.css';

const SignInPage: React.FC = () => {
  const [isSignInFaulty, setIsSignInFaulty] = useState(false);
  const router = useRouter();

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

  return (
    <div>
      <div
        className={
          isSignInFaulty ? styles.formContainerWithModal : styles.formContainer
        }
      >
        <AuthForm
          isRegistering={false}
          onSubmit={(data) => {
            handleSignIn(data, () => {
              document.querySelector('form')?.reset();
            });
          }}
        />
      </div>{' '}
      {isSignInFaulty && (
        <Modal
          message="Sign-in failed. Please check your credentials and try again."
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SignInPage;
