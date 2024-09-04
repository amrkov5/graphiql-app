import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignInPage from './page';
import { useRouter } from 'nextjs-toploader/app';
import { logInWithEmailAndPassword } from '../../firebase/firebase';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loginStateReducer from '../../slices/loginSlice';

const localeMessages = {
  AuthForm: {
    login: 'Sign In',
    register: 'Sign Up',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirm: 'Confirm password',
  },
  SignInPage: {
    modalMessage:
      'Sign-in failed. Please check your credentials and try again.',
  },
  ValidationErrors: {
    nameRequired: 'Name is required',
    emailFormat: 'Invalid email format',
    emailRequired: 'Email is required',
    PSWDletterRequired: 'At least one letter required',
    PSWDdigitRequired: 'At least one digit required',
    PSWDspecCharRequired: 'At least one special character required',
    PSWDsupportUnicode: 'Password must support Unicode characters',
    PSWDlength: 'Must be at least 8 characters long',
    PSWDrequired: 'Password is required',
    ConfirmPSWDdoNotMatch: 'Passwords do not match',
    ConfirmPSWDrequired: 'Confirm your password',
  },
};

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

vi.mock('nextjs-toploader/app', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../firebase/firebase', () => ({
  logInWithEmailAndPassword: vi.fn(),
  auth: {},
}));

const store = configureStore({
  reducer: {
    loginState: loginStateReducer,
  },
  preloadedState: {
    loginState: {
      loggedIn: false,
    },
  },
});

describe('SignInPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    const router = useRouter();
    router.push = pushMock;
    pushMock.mockClear();
    (logInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renders the AuthForm component', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <SignInPage />
        </Provider>
      </NextIntlClientProvider>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
