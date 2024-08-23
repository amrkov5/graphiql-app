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
  name?: string | null;
  email: string;
  password: string;
  confirmPassword?: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<AuthFormInputs>({
    resolver: yupResolver(AuthFormSchema(isRegistering)),
    mode: 'onChange',
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>{isRegistering ? 'Sign Up' : 'Sign In'}</h1>
      <div className={styles.formWrapper}>
        {isRegistering && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              className={styles.formInput}
              {...register('name')}
              id="name"
            />
            <p className={styles.errorMessage}>{errors.name?.message}</p>
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            className={styles.formInput}
            {...register('email')}
            id="email"
            type="email"
          />
          <p className={styles.errorMessage}>{errors.email?.message}</p>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            {...register('password')}
            id="password"
            type="password"
          />
          <p className={styles.errorMessage}>{errors.password?.message}</p>
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
            <p className={styles.errorMessage}>
              {errors.confirmPassword?.message}
            </p>
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
