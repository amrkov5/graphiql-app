import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResponseSection from './ResponseSection';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const localeMessages = {
  RequestErrors: {
    URLbase64: 'Invalid URL: The URL must be base64 encoded.',
    errorSending: 'Error sending request.',
    unknownError: 'Unknown error occurred.',
    status: 'Status code:',
    'Failed to fetch': 'Failed to fetch data. Please check Internet connection',
  },
};

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

describe('ResponseSection', () => {
  it('renders status code when provided', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ResponseSection response={null} error={null} statusCode={200} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Status code:')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders response in MonacoEditor when provided', async () => {
    const response = JSON.stringify({ name: 'John Doe', age: 30 }, null, 2);
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ResponseSection response={response} error={null} statusCode={200} />
      </NextIntlClientProvider>
    );

    await waitFor(() => {
      const editorContainer = screen.getByTestId('editor-container');
      expect(editorContainer).toBeInTheDocument();
    });
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders localized error message when provided', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ResponseSection
          response={null}
          error="unknownError"
          statusCode={200}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Unknown error occurred.')).toBeInTheDocument();
  });
});
