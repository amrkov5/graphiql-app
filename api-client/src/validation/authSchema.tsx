import * as yup from 'yup';

export const AuthFormSchema = (isRegistering: boolean) => {
  return yup.object().shape({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),

    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
      .matches(/\d/, 'Password must contain at least one digit')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      )
      .matches(
        /[\p{L}\p{N}\p{P}\p{S}\p{M}]/u,
        'Password must support Unicode characters'
      )
      .required('Password is required'),

    confirmPassword: isRegistering
      ? yup
          .string()
          .oneOf([yup.ref('password')], 'Passwords do not match')
          .required('Confirm your password')
      : yup.string().nullable(),
  });
};
