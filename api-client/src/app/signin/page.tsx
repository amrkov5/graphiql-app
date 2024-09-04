'use client';

// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logInWithEmailAndPassword } from '../../firebase/firebase';
import Modal from '@/Components/Modal/Modal';
import AuthForm, { AuthFormInputs } from '@/Components/AuthForm/AuthForm';
import { useDispatch } from 'react-redux';
import { setLogIn, setLogOut } from '@/slices/loginSlice';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

const SignInPage: React.FC = () => {
  const [isSignInFaulty, setIsSignInFaulty] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations('SignInPage');

  useEffect(() => {
    dispatch(setLogOut());
  }, []);

  const handleSignIn = async (data: AuthFormInputs, reset: () => void) => {
    try {
      const userInfo = await logInWithEmailAndPassword(
        data.email,
        data.password
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
        <div>
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
          <Modal message={t('modalMessage')} onClose={handleCloseModal} />
        )}
      </div>
      {/* )} */}
    </>
  );
};

export default SignInPage;
