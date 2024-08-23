import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpPage from './page';
import { useRouter } from 'next/navigation';
import { registerWithEmailAndPassword } from '@/firebase';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
}));

describe('SignUpPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    const router = useRouter();
    router.push = pushMock;
    pushMock.mockClear();
    (registerWithEmailAndPassword as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renders the AuthForm component', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });
});
