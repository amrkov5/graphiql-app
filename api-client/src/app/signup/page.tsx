'use client';

import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { registerWithEmailAndPassword } from '@/firebase';

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const handleSignUp = async (data: AuthFormInputs) => {
    console.log('Sign up data:', data);
    if (data.name) {
      await registerWithEmailAndPassword(data.name, data.email, data.password);
    }
    router.push('/');
  };

  return (
    <div>
      <AuthForm isRegistering={true} onSubmit={handleSignUp} />
    </div>
  );
};

export default SignUpPage;
