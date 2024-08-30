import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignInPage from './page';
import { useRouter } from 'next/navigation';
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
};

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

vi.mock('next/navigation', () => ({
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
