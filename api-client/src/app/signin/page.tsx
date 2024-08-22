'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';

const SignInPage: React.FC = () => {
  const router = useRouter();

  const handleSignIn = async (data: AuthFormInputs) => {
    console.log('Sign in data:', data);
    router.push('/');
  };

  return (
    <div>
      <h1>Sign In</h1>
      <AuthForm isRegistering={false} onSubmit={handleSignIn} />
    </div>
  );
};

export default SignInPage;
