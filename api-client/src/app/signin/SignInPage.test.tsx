import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignInPage from './page';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loginStateReducer from '../../slices/loginSlice';
import { logInWithEmailAndPassword } from '../../firebase/firebase';

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
    loginState: { loggedIn: false, error: false },
  },
});

const locale = 'en';
const messages = {
  SignInPage: {
    modalMessage:
      'Sign-in failed. Please check your credentials and try again.',
  },
  AuthForm: {
    email: 'Email',
    password: 'Password',
    login: 'Sign In',
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

describe('SignInPage', () => {
  it('logs in successfully and redirects', async () => {
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <SignInPage />
        </Provider>
      </NextIntlClientProvider>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });

    const submitButton = screen.getByRole('button', {
      name: /sign in/i,
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(logInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
    });
  });
  it('renders the AuthForm component', async () => {
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

process.on('unhandledRejection', (error) => {});
