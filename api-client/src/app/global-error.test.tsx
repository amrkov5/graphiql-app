import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GlobalError from './global-error';

describe('GlobalError component', () => {
  it('should render the error message and button', () => {
    const resetMock = vi.fn();

    render(<GlobalError error={new Error('Test error')} reset={resetMock} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
