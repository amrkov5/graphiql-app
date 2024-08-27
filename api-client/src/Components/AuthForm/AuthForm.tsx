'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthFormSchema } from '../../validation/authSchema';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import styles from './authForm.module.css';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('AuthForm');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = useMemo(
    () => AuthFormSchema(isRegistering, t),
    [isRegistering, t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    trigger,
    watch,
  } = useForm<AuthFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  useEffect(() => {
    trigger();
  }, [t, trigger]);

  useEffect(() => {
    const subscription = watch(() => {
      trigger();
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>{isRegistering ? t('register') : t('login')}</h1>
      <div className={styles.formWrapper}>
        <div className={styles.formInputsWrapper}>
          {isRegistering && (
            <div className={styles.passwordContainer}>
              <label htmlFor="name">{t('name')}</label>
              <input
                className={styles.formInput}
                {...register('name')}
                id="name"
              />
            </div>
          )}
          {isRegistering && (
            <p className={styles.errorMessage}>
              {touchedFields.name && errors.name && errors.name.message}
            </p>
          )}
          <div className={styles.passwordContainer}>
            <label htmlFor="email">{t('email')}</label>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.formInput}
                {...register('email')}
                id="email"
                type="email"
              />
            </div>
          </div>
          <p className={styles.errorMessage}>
            {touchedFields.email && errors.email && errors.email.message}
          </p>

          <div className={styles.passwordContainer}>
            <label htmlFor="password">{t('password')}</label>
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
          {
            <p className={styles.errorMessage}>
              {touchedFields.password &&
                errors.password &&
                errors.password.message}
            </p>
          }
          {isRegistering && (
            <div className={styles.passwordContainer}>
              <label htmlFor="confirmPassword" className={styles.lbl}>
                {t('confirm')}
              </label>
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
          )}
          {isRegistering && (
            <p className={styles.errorMessage}>
              {touchedFields.confirmPassword &&
                errors.confirmPassword &&
                errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button className={styles.btn} type="submit" disabled={!isValid}>
          {isRegistering ? t('register') : t('login')}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
