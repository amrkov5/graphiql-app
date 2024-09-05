'use client';

// import { useRouter } from 'next/navigation';
import { registerWithEmailAndPassword } from '../../firebase/firebase';
import { useEffect, useState } from 'react';
import Modal from '../../Components/Modal/Modal';
import { useTranslations } from 'next-intl';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch } from 'react-redux';
import { setError, setLogIn, setLogOut } from '@/slices/loginSlice';
import { useRouter } from 'nextjs-toploader/app';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSignUpFaulty, setIsSignUpFaulty] = useState(false);
  // const [isLoading, setIfLoading] = useState(false);
  const t = useTranslations('SignUpPage');

  useEffect(() => {
    dispatch(setLogOut());
  }, [dispatch]);

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
            router.refresh();
          }
        });
      } catch (error) {
        setIsSignUpFaulty(true);
        reset();
        dispatch(setError(true));
      }
    }
  };
  const handleCloseModal = () => {
    setIsSignUpFaulty(false);
    dispatch(setError(false));
  };

  return (
    <>
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
    </>
  );
};

export default SignUpPage;
