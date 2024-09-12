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

const messages = {
  RestClient: {
    sendButton: 'Send',
    addButton: 'Add New',
    headers: 'Headers:',
    body: 'Body:',
    query: 'Query params:',
    format: 'Format',
    bodyVariables: 'Body variables:',
    endpointPlaceholder: 'Enter endpoint URL',
    deleteButton: 'Delete',
    keyPlaceholder: 'Key',
    valuePlaceholder: 'Value',
  },
  RequestErrors: {
    URLbase64: 'Invalid URL: The URL must be base64 encoded.',
    errorSending: 'Error sending request.',
    unknownError: 'Unknown error occurred.',
    status: 'Status code:',
    'Failed to fetch': 'Failed to fetch data. Please check Internet connection',
  },
};

const renderComponent = () => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
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
        'https://ai-team-api-app.vercel.app/api/proxy',
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

    expect(
      await screen.findByText('Error sending request.')
    ).toBeInTheDocument();
  });

  it('shows error when URL is invalid', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('URLbase64'));

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
