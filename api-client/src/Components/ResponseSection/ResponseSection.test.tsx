import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResponseSection from './ResponseSection';

describe('ResponseSection', () => {
  it('renders status code when provided', () => {
    render(<ResponseSection response={null} error={null} statusCode={200} />);

    expect(screen.getByText(/Status Code:/)).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders response in MonacoEditor when provided', async () => {
    const response = JSON.stringify({ name: 'John Doe', age: 30 }, null, 2);

    render(
      <ResponseSection response={response} error={null} statusCode={200} />
    );

    await waitFor(() => {
      const editorContainer = screen.getByTestId('editor-container');
      expect(editorContainer).toBeInTheDocument();
    });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(
      <ResponseSection
        response={null}
        error="Something went wrong"
        statusCode={null}
      />
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
