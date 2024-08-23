import * as yup from 'yup';

export const AuthFormSchema = (isRegistering: boolean) => {
  return yup.object().shape({
    name: isRegistering
      ? yup
          .string()
          .required('Name is required')
          .test(
            'no-leading-trailing-spaces',
            'No leading or trailing spaces allowed',
            (value) => {
              return value === value?.trim();
            }
          )
      : yup.string().nullable(),

    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),

    password: yup
      .string()
      .min(8, 'Must be at least 8 characters long')
      .matches(/[a-zA-Z]/, 'At least one letter required')
      .matches(/\d/, 'At least one digit required')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'At least one special character required'
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