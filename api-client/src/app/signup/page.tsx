'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { auth, registerWithEmailAndPassword } from '@/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [isSignedIn, setIisSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        router.push('/');
      } else setIisSignedIn(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignUp = async (data: AuthFormInputs) => {
    console.log('Sign up data:', data);
    if (data.name) {
      await registerWithEmailAndPassword(data.name, data.email, data.password);
    }
    router.push('/');
  };

  return (
    <div>
      {' '}
      {!isSignedIn && <AuthForm isRegistering={true} onSubmit={handleSignUp} />}
    </div>
  );
};

export default SignUpPage;
