'use client';

import { useRouter } from 'next/navigation';
import { auth, registerWithEmailAndPassword } from '../../firebase/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Modal from '../../Components/Modal/Modal';
import { useTranslations } from 'next-intl';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoginState, setLogIn } from '@/slices/loginSlice';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSignUpFaulty, setIsSignUpFaulty] = useState(false);
  const t = useTranslations('SignUpPage');
  const isSignedIn = useSelector(selectLoginState);

  if (isSignedIn) {
    router.replace('/');
  }

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

        fetch('/api/login', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await userInfo?.getIdToken()}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            dispatch(setLogIn());
            router.push('/');
          }
        });
        setIsSignUpFaulty(false);
      } catch (error) {
        // console.error('Error during sign-up:', error);
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
      {/* {!isSignedIn && ( */}
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
          <Modal message={t('modalMessage')} onClose={handleCloseModal} />
        )}
      </div>
      {/* )} */}
    </>
  );
};

export default SignUpPage;
