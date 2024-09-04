import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResponseSection from './ResponseSection';
import { IntlProvider } from 'next-intl';

describe('ResponseSection', () => {
  const renderWithIntl = (ui: React.ReactNode, locale = 'en') => {
    const messages = {
      RequestErrors: {
        'Something went wrong': 'Что-то пошло не так',
        status: 'Status Code:',
      },
    };

    return render(
      <IntlProvider locale={locale} messages={messages}>
        {ui}
      </IntlProvider>
    );
  };

  it('renders status code when provided', () => {
    renderWithIntl(
      <ResponseSection response={null} error={null} statusCode={200} />
    );

    expect(screen.getByText(/Status Code:/)).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders response in MonacoEditor when provided', async () => {
    const response = JSON.stringify({ name: 'John Doe', age: 30 }, null, 2);

    renderWithIntl(
      <ResponseSection response={response} error={null} statusCode={200} />
    );

    await waitFor(() => {
      const editorContainer = screen.getByTestId('editor-container');
      expect(editorContainer).toBeInTheDocument();
    });
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders localized error message when provided', () => {
    renderWithIntl(
      <ResponseSection
        response={null}
        error="Something went wrong"
        statusCode={null}
      />
    );

    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
  });
});
