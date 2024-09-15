import { render, screen } from '@testing-library/react';
import Header from './Header';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'nextjs-toploader/app';
import { vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl'; // Импортируем провайдер

vi.mock('react-redux', () => ({
  useDispatch: vi.fn() as ReturnType<typeof vi.fn>,
  useSelector: vi.fn() as ReturnType<typeof vi.fn>,
}));

vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn() as ReturnType<typeof vi.fn>,
}));

describe('Header Component', () => {
  const mockDispatch = vi.fn();
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    // Настройка моков
    (useDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch
    );
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false); // или true
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const messages = {
    // Добавьте ваши переводы
    Header: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      main: 'Main',
    },
  };

  const renderWithIntl = (component: React.ReactNode) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    );
  };

  it('renders the header with login and register buttons', () => {
    renderWithIntl(<Header initialLoggedIn={false} />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});
