import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignInPage from './page';
import { useRouter } from 'next/navigation';
import { logInWithEmailAndPassword } from '@/firebase';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/firebase', () => ({
  logInWithEmailAndPassword: vi.fn(),
}));

describe('SignInPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    const router = useRouter();
    router.push = pushMock;
    pushMock.mockClear();
    (logInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renders the AuthForm component', () => {
    render(<SignInPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
