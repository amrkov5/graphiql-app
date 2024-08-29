'use client';

import { useRouter } from 'next/navigation';
import { auth, registerWithEmailAndPassword } from '../../firebase/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [isSignedIn, setIisSignedIn] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      } else setIisSignedIn(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignUp = async (data: AuthFormInputs) => {
    if (data.name) {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      };

      await registerWithEmailAndPassword(
        trimmedData.name,
        trimmedData.email,
        trimmedData.password
      );
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
