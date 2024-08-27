import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import RootLayout from './layout';

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
  getMessages: vi.fn(() => ({ greeting: 'Hello' })),
}));

describe('Layout test', () => {
  it('renders layout with header and footer', async () => {
    const layout = await RootLayout({ children: <div>test div</div> });
    const { getByTestId } = render(layout);

    const header = getByTestId('header');
    expect(header).toBeInTheDocument();

    const footer = getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
