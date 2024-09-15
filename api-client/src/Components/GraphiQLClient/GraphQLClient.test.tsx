import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GraphiQLClient from './GraphiQLClient';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]),
}));

vi.mock('@/services/safeBase64', () => ({
  fromBase64: vi.fn((str) => str),
  toBase64: vi.fn((str) => str),
}));

vi.mock('@/services/historyUtils', () => ({
  saveRequestToHistory: vi.fn(),
}));

vi.mock('https://unpkg.com/prettier@3.3.3/standalone.mjs', () => ({
  format: vi.fn((text) => text.trim()),
}));

vi.mock('https://unpkg.com/prettier@3.3.3/plugins/graphql.mjs', () => ({}));

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

describe('GraphiQLClient', () => {
  const renderGraphiQLClient = (props = {}) =>
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <GraphiQLClient propUrl="test-url" propBody="test-body" {...props} />
      </NextIntlClientProvider>
    );

  it('renders initial components correctly', () => {
    renderGraphiQLClient();

    expect(screen.getByTestId('send-button')).toBeInTheDocument();

    expect(screen.getByTestId('sdl-input')).toBeInTheDocument();

    expect(screen.getByTestId('get-button')).toBeDisabled();
  });

  it('sends GraphQL request when the send button is clicked', async () => {
    renderGraphiQLClient();

    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/response/i)).toBeInTheDocument();
    });
  });

  it('enables GET button when SDL URL is entered', () => {
    renderGraphiQLClient();

    const sdlInput = screen.getByPlaceholderText(/Enter SDL URL/i);
    const getButton = screen.getByRole('button', { name: /GET/i });

    expect(getButton).toBeDisabled();

    fireEvent.change(sdlInput, { target: { value: 'http://example.com/sdl' } });

    expect(getButton).not.toBeDisabled();
  });

  it('displays error when invalid URL is provided', async () => {
    renderGraphiQLClient({ propUrl: '' });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid URL: The URL must be base64 encoded./i)
      ).toBeInTheDocument();
    });
  });
});
