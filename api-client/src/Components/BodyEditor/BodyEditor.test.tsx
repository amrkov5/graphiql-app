import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BodyEditor from './BodyEditor';
import { vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

const messages = {
  RestClient: {
    body: 'Body',
    format: 'Format',
  },
};

const TestProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

describe('BodyEditor', () => {
  const body = btoa(encodeURIComponent('{"key": "value"}'));
  const setBody = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <TestProviders>
        <BodyEditor body={body} setBody={setBody} />
      </TestProviders>
    );

  it('changes the language when a different option is selected', async () => {
    renderComponent();

    const languageSelector = screen.getByLabelText(/body/i);
    await userEvent.selectOptions(languageSelector, 'plaintext');

    expect(languageSelector).toHaveValue('plaintext');
  });
});
