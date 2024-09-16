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
    get: () => {
      return null;
    },
  };
};

vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve({}),
    })
  )
);

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockCookies,
  })),
}));

vi.mock('nextjs-toploader/app', () => ({
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
    const layout = await RootLayout({ children: <>test div</> });
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
