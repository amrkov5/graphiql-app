import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestClient from './RestClient';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    entries: () => [
      ['key1', 'value1'],
      ['key2', 'value2'],
    ],
    get: vi.fn(),
    has: vi.fn(),
    toString: vi.fn(),
  }),
}));

const renderComponent = (props = {}) => {
  return render(
    <NextIntlClientProvider locale="en">
      <RestClient
        propMethod="GET"
        propUrl="aHR0cHM6Ly9leGFtcGxlLmNvbQ=="
        propBody=""
        // {...props}
      />
    </NextIntlClientProvider>
  );
};

describe('RestClient', () => {
  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Error' }),
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('send-button'));

    expect(await screen.findByText(/Error/)).toBeInTheDocument();
  });

  it('shows error when URL is invalid', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Invalid URL'));

    renderComponent();

    fireEvent.click(screen.getByTestId('send-button'));

    expect(await screen.findByText(/Error/)).toBeInTheDocument();
  });
});
