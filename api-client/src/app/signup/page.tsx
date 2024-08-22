'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const handleSignUp = async (data: AuthFormInputs) => {
    console.log('Sign up data:', data);
    router.push('/');
  };

  return (
    <div>
      <AuthForm isRegistering={true} onSubmit={handleSignUp} />
    </div>
  );
};

export default SignUpPage;
