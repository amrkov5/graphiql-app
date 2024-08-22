'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { logInWithEmailAndPassword } from '@/firebase';
import { useState } from 'react';

const SignInPage: React.FC = () => {
  const [isSignInFaulty, setIsSignInFaulty] = useState(false);
  const router = useRouter();

  const handleSignIn = async (data: AuthFormInputs) => {
    console.log('Sign in data:', data);
    try {
      await logInWithEmailAndPassword(data.email, data.password);
      setIsSignInFaulty(false);
    } catch (error) {
      console.error('Error during sign-in:', error);
      setIsSignInFaulty(true);
    }
  };

  return (
    <div>
      <AuthForm isRegistering={false} onSubmit={handleSignIn} />
      {isSignInFaulty && (
        <p style={{ color: 'red' }}>
          Sign-in failed. Please check your credentials and try again.
        </p>
      )}
    </div>
  );
};

export default SignInPage;
