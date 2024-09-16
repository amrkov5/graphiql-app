import * as yup from 'yup';

export const AuthFormSchema = (isRegistering: boolean) => {
  return yup.object().shape({
    name: isRegistering
      ? yup.string().required('nameRequired')
      : yup.string().nullable(),

    email: yup
      .string()
      .required('emailRequired')
      .test('is-valid-email', 'emailFormat', (value) => {
        const template = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return value ? template.test(value.trim()) : false;
      }),

    password: yup
      .string()
      .required('PSWDrequired')
      .matches(/[a-zA-Zа-яА-ЯёЁ]/, 'PSWDletterRequired')
      .matches(/\d/, 'PSWDdigitRequired')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'PSWDspecCharRequired')
      .matches(/[\p{L}\p{N}\p{P}\p{S}\p{M}]/u, 'PSWDsupportUnicode')
      .min(8, 'PSWDlength'),

    confirmPassword: isRegistering
      ? yup
          .string()
          .oneOf([yup.ref('password')], 'ConfirmPSWDdoNotMatch')
          .required('ConfirmPSWDrequired')
      : yup.string().nullable(),
  });
};
