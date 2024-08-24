import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpPage from './page';
import { useRouter } from 'next/navigation';
import { registerWithEmailAndPassword } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

  it('renders the AuthForm component', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('calls the unsubscribe function on unmount', () => {
    const { unmount } = render(<SignUpPage />);
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
