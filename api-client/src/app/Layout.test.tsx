import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import RootLayout from './layout';
import { useRouter as mockUseRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    query: {},
    asPath: '',
  })),
}));

describe('Layout test', () => {
  it('renders layout with header and footer', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>test div</div>
      </RootLayout>
    );

    const header = getByTestId('header');
    expect(header).toBeInTheDocument();

    const footer = getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
