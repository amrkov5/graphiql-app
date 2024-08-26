import * as yup from 'yup';

export const AuthFormSchema = (
  isRegistering: boolean,
  t: (key: string) => string
) => {
  return yup.object().shape({
    name: isRegistering
      ? yup.string().required(t('nameRequired'))
      : yup.string().nullable(),

    email: yup.string().email(t('emailFormat')).required(t('emailRequired')),

    password: yup
      .string()
      .required(t('PSWDrequired'))
      .matches(/[a-zA-Zа-яА-ЯёЁ]/, t('PSWDletterRequired'))
      .matches(/\d/, t('PSWDdigitRequired'))
      .matches(/[!@#$%^&*(),.?":{}|<>]/, t('PSWDspecCharRequired'))
      .matches(/[\p{L}\p{N}\p{P}\p{S}\p{M}]/u, t('PSWDsupportUnicode'))
      .min(8, t('PSWDlength')),

    confirmPassword: isRegistering
      ? yup
          .string()
          .oneOf([yup.ref('password')], t('ConfirmPSWDdoNotMatch'))
          .required(t('ConfirmPSWDrequired'))
      : yup.string().nullable(),
  });
};
