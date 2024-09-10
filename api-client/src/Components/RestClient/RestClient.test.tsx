import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestClient from './RestClient';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]),
  get: vi.fn(),
  has: vi.fn(),
  toString: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return render(
    <NextIntlClientProvider locale="en">
      <RestClient
        propMethod="GET"
        propUrl="aHR0cHM6Ly9leGFtcGxlLmNvbQ=="
        propBody=""
      />
    </NextIntlClientProvider>
  );
};

describe('RestClient', () => {
  it('calls the fetch function when send button is clicked', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    global.fetch = fetchMock;

    renderComponent();

    expect(screen.getByTestId('send-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('send-button'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  it('updates request method based on MethodSelector', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    global.fetch = fetchMock;

    renderComponent();

    const methodSelector = screen.getByText('GET') as HTMLSelectElement;

    fireEvent.change(methodSelector, {
      target: { value: 'POST' },
    });

    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/proxy',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Error' }),
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('send-button'));

    expect(await screen.findByText(/errorSending/)).toBeInTheDocument();
  });

  it('shows error when URL is invalid', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Invalid URL'));

    renderComponent();

    fireEvent.click(screen.getByTestId('send-button'));

    expect(await screen.findByText(/Invalid URL/)).toBeInTheDocument();
  });

  it('shows status code correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'JSON Response' }),
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('send-button'));

    expect(await screen.findByText(/200/)).toBeInTheDocument();
  });
});
