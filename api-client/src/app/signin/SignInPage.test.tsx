import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignInPage from './page';
import { useRouter } from 'next/navigation';
import { logInWithEmailAndPassword, auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/firebase', () => ({
  logInWithEmailAndPassword: vi.fn(),
  auth: {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

describe('SignInPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    const router = useRouter();
    router.push = pushMock;
    pushMock.mockClear();
    (logInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockClear();

    (onAuthStateChanged as ReturnType<typeof vi.fn>).mockImplementation(
      (auth, callback) => {
        callback(null);
        return () => {};
      }
    );
  });

  it('renders the AuthForm component', () => {
    render(<SignInPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
