// AuthForm.test.tsx
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthForm from './AuthForm';
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
  SignUpPage: {
    modalMessage: 'An account with this email already exists.',
  },
  SignInPage: {
    modalMessage:
      'Sign-in failed. Please check your credentials and try again.',
  },
  Modal: {
    modalClose: 'Close',
  },
};

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

vi.mock('react-icons/ai', () => ({
  AiFillEye: () => <span>eye</span>,
  AiFillEyeInvisible: () => <span>eye-invisible</span>,
}));

const store = configureStore({
  reducer: {
    loginState: loginStateReducer,
  },
  preloadedState: {
    loginState: { loggedIn: false, error: false },
  },
});

describe('AuthForm', () => {
  it('renders form fields correctly based on isRegistering prop', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <AuthForm isRegistering={true} onSubmit={vi.fn()} />
        </Provider>
      </NextIntlClientProvider>
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });

  it('renders form fields correctly in login mode', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <AuthForm isRegistering={false} onSubmit={vi.fn()} />
        </Provider>
      </NextIntlClientProvider>
    );

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm password')).not.toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <AuthForm isRegistering={true} onSubmit={vi.fn()} />
        </Provider>
      </NextIntlClientProvider>
    );
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const eyeIcon = screen.getByTestId('password-toggle-icon');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(eyeIcon);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(eyeIcon);
    expect(passwordInput.type).toBe('password');
  });

  it('toggles confirm password visibility when eye icon is clicked', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <AuthForm isRegistering={true} onSubmit={vi.fn()} />
        </Provider>
      </NextIntlClientProvider>
    );

    const confirmPasswordInput = screen.getByLabelText(
      'Confirm password'
    ) as HTMLInputElement;
    const eyeIconConfirm = screen.getByTestId('confirm-password-toggle-icon');

    expect(confirmPasswordInput.type).toBe('password');

    fireEvent.click(eyeIconConfirm);
    expect(confirmPasswordInput.type).toBe('text');

    fireEvent.click(eyeIconConfirm);
    expect(confirmPasswordInput.type).toBe('password');
  });

  it('submits form with correct data', async () => {
    const onSubmit = vi.fn();
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <AuthForm isRegistering={true} onSubmit={onSubmit} />
        </Provider>
      </NextIntlClientProvider>
    );

    fireEvent.input(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'P@ssw0rd!' },
    });
    fireEvent.input(screen.getByLabelText('Confirm password'), {
      target: { value: 'P@ssw0rd!' },
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      const expectedData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'P@ssw0rd!',
        confirmPassword: 'P@ssw0rd!',
      };

      const actualData = onSubmit.mock.calls[0][0];

      expect(actualData).toEqual(expectedData);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
