import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import RootLayout from './layout';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { getLocale, getMessages } from 'next-intl/server';

const localeMessages = {
  Header: {
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    main: 'Main page',
  },
};

const mockCookies = () => {
  return {
    get: (name: string) => {
      return null;
    },
  };
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockCookies,
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    query: {},
    asPath: '',
  })),
}));

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

describe('Layout test', () => {
  it('renders layout with header and footer', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    const layout = await RootLayout({ children: <div>test div</div> });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
    const { getByTestId } = render(layout, { wrapper });

    const header = getByTestId('header');
    expect(header).toBeInTheDocument();

    const footer = getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
