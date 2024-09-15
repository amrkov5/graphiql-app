import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));

import KeyValueEditor, { KeyValuePair } from './KeyValueEditor';
import { NextIntlClientProvider } from 'next-intl';

const TestProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NextIntlClientProvider
      locale="en"
      messages={{
        RestClient: {
          addButton: 'Add',
          keyPlaceholder: 'Key',
          valuePlaceholder: 'Value',
          deleteButton: 'Delete',
        },
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
};

describe('KeyValueEditor', () => {
  const initialKeyValues: KeyValuePair[] = [
    { id: 1, key: 'key1', value: 'value1' },
    { id: 2, key: 'key2', value: 'value2' },
  ];

  const setKeyValues = vi.fn();

  it('adds a new key-value pair when "Add" button is clicked', () => {
    render(
      <TestProviders>
        <KeyValueEditor
          name="Test Editor"
          keyValues={initialKeyValues}
          setKeyValues={setKeyValues}
        />
      </TestProviders>
    );

    fireEvent.click(screen.getByText('addButton'));

    expect(setKeyValues).toHaveBeenCalledWith([
      ...initialKeyValues,
      { id: 3, key: '', value: '' },
    ]);
  });

  it('deletes a key-value pair when "Delete" button is clicked', () => {
    render(
      <TestProviders>
        <KeyValueEditor
          name="Test Editor"
          keyValues={initialKeyValues}
          setKeyValues={setKeyValues}
        />
      </TestProviders>
    );

    fireEvent.click(screen.getAllByText('deleteButton')[0]);

    expect(setKeyValues).toHaveBeenCalledWith([
      { id: 2, key: 'key2', value: 'value2' },
    ]);
  });
});
