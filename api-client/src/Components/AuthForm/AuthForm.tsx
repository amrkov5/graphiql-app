'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthFormSchema } from '@/validation/authSchema';
import { useRouter } from 'next/navigation';
import styles from './authForm.module.css';

interface AuthFormProps {
  isRegistering: boolean;
  onSubmit: (data: AuthFormInputs) => void;
}

export interface AuthFormInputs {
  email: string;
  password: string;
  confirmPassword?: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthFormInputs>({
    resolver: yupResolver(AuthFormSchema(isRegistering)),
    mode: 'onChange',
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <p>{isRegistering ? 'Sign Up' : 'Sign In'}</p>
      <div className={styles.formWrapper}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            className={styles.formInput}
            {...register('email')}
            id="email"
            type="email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            {...register('password')}
            id="password"
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {isRegistering && (
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className={styles.formInput}
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
        )}
      </div>{' '}
      <button className={styles.btn} type="submit" disabled={!isValid}>
        {isRegistering ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
};

export default AuthForm;
