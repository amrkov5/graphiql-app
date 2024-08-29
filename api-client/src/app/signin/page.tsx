'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logInWithEmailAndPassword } from '../../firebase/firebase';
import styles from './SignInPage.module.css';
import Modal from '@/Components/Modal/Modal';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch } from 'react-redux';
import { setLogIn } from '@/slices/loginSlice';

const SignInPage: React.FC = () => {
  const [isSignInFaulty, setIsSignInFaulty] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignIn = async (data: AuthFormInputs, reset: () => void) => {
    try {
      const userInfo = await logInWithEmailAndPassword(
        data.email,
        data.password
      );
      fetch('/api/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await userInfo.getIdToken()}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setIsSignInFaulty(false);
          dispatch(setLogIn());
          router.push('/');
        }
      });
    } catch (error) {
      setIsSignInFaulty(true);
      reset();
    }
  };

  const handleCloseModal = () => {
    setIsSignInFaulty(false);
  };

  return (
    <>
      {/* {!isSignedIn && ( */}
      <div>
        <div
          className={
            isSignInFaulty
              ? styles.formContainerWithModal
              : styles.formContainer
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
        </div>
        {isSignInFaulty && (
          <Modal
            message="Sign-in failed. Please check your credentials and try again."
            onClose={handleCloseModal}
          />
        )}
      </div>
      {/* )} */}
    </>
  );
};

export default SignInPage;
