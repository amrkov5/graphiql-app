import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpPage from './page';
import { useRouter } from 'nextjs-toploader/app';
import { registerWithEmailAndPassword } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { configureStore } from '@reduxjs/toolkit';
import loginStateReducer from '../../slices/loginSlice';
import { Provider } from 'react-redux';

const localeMessages = {
  AuthForm: {
    login: 'Sign In',
    register: 'Sign Up',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirm: 'Confirm password',
  },
  SignUpPage: {
    modalMessage: 'An account with this email already exists.',
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

vi.mock('firebase/auth', () => {
  return {
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock('../../firebase/firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
  auth: {},
}));

const store = configureStore({
  reducer: {
    loginState: loginStateReducer,
  },
  preloadedState: {
    loginState: { loggedIn: false, error: false },
  },
});

describe('SignUpPage', () => {
  const pushMock = vi.fn();
  const unsubscribeMock = vi.fn();

  beforeEach(() => {
    const router = useRouter();
    router.push = pushMock;
    pushMock.mockClear();
    (registerWithEmailAndPassword as ReturnType<typeof vi.fn>).mockClear();

    (onAuthStateChanged as ReturnType<typeof vi.fn>).mockImplementation(
      (auth, callback) => {
        callback(null);
        return unsubscribeMock;
      }
    );
  });

  it('renders the AuthForm component', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <SignUpPage />
        </Provider>
      </NextIntlClientProvider>
    );
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });

  // it('calls the unsubscribe function on unmount', async () => {
  //   const locale = await getLocale();
  //   const messages = await getMessages();
  //   const { unmount } = render(
  //     <NextIntlClientProvider locale={locale} messages={messages}>
  //       <Provider store={store}>
  //         <SignUpPage />
  //       </Provider>
  //     </NextIntlClientProvider>
  //   );
  //   unmount();
  //   expect(unsubscribeMock).toHaveBeenCalled();
  // });
});
