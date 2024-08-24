import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpPage from './page';
import { useRouter } from 'next/navigation';
import { registerWithEmailAndPassword } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const localeMessages = {
  AuthForm: {
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

vi.mock('firebase/auth', () => {
  return {
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock('../../firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
  auth: {},
}));

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
        <SignUpPage />
      </NextIntlClientProvider>
    );
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });

  it('calls the unsubscribe function on unmount', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    const { unmount } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SignUpPage />
      </NextIntlClientProvider>
    );
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
