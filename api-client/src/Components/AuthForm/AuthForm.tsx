'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthFormSchema } from '../../validation/authSchema';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthFormInputs>({
    resolver: yupResolver(AuthFormSchema(isRegistering)),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>{isRegistering ? 'Sign Up' : 'Sign In'}</h1>
      <div className={styles.formWrapper}>
        <div className={styles.formInputsWrapper}>
          {isRegistering && (
            <div className={styles.passwordContainer}>
              <label htmlFor="name">Name</label>
              <input
                className={styles.formInput}
                {...register('name')}
                id="name"
              />
            </div>
          )}
          {isRegistering && (
            <p className={styles.errorMessage}>{errors.name?.message}</p>
          )}
          <div className={styles.passwordContainer}>
            <label htmlFor="email">Email</label>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.formInput}
                {...register('email')}
                id="email"
                type="email"
              />
            </div>
          </div>
          <p className={styles.errorMessage}>{errors.email?.message}</p>
          <div className={styles.passwordContainer}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.formInput}
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
              />
              <span
                className={styles.passwordToggleIcon}
                data-testid="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          </div>
          <p className={styles.errorMessage}>{errors.password?.message}</p>
          {isRegistering && (
            <div className={styles.passwordContainer}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.formInput}
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                <span
                  className={styles.passwordToggleIcon}
                  data-testid="confirm-password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </div>
          )}{' '}
          {isRegistering && (
            <p className={styles.errorMessage}>
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>{' '}
        <button className={styles.btn} type="submit" disabled={!isValid}>
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
