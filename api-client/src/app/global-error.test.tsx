import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GlobalError from './global-error';

describe('GlobalError component', () => {
  it('should render the error message and button', () => {
    const resetMock = vi.fn();

    render(<GlobalError error={new Error('Test error')} reset={resetMock} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('should call reset function when the button is clicked', () => {
    const resetMock = vi.fn();

    render(<GlobalError error={new Error('Test error')} reset={resetMock} />);

    fireEvent.click(screen.getByText('Try again'));

    expect(resetMock).toHaveBeenCalled();
  });
});
