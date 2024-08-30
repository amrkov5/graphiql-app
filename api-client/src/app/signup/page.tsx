'use client';

import { useRouter } from 'next/navigation';
import { auth, registerWithEmailAndPassword } from '../../firebase/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch } from 'react-redux';
import { setLogIn } from '@/slices/loginSlice';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignUp = async (data: AuthFormInputs) => {
    if (data.name) {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      };

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
    }
  };

  return (
    <div>
      {' '}
      <AuthForm isRegistering={true} onSubmit={handleSignUp} />
    </div>
  );
};

export default SignUpPage;
