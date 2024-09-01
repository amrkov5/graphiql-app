import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

vi.mock('next-intl', () => ({
  useTranslations: (key: string) => (text: string) => text,
}));

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  it('should render the modal with the correct message', () => {
    const message = 'Test message';
    render(<Modal message={message} onClose={mockOnClose} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    render(<Modal message="Test message" onClose={mockOnClose} />);

    fireEvent.click(screen.getByText(/Close/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when the overlay is clicked', () => {
    render(<Modal message="Test message" onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('dialog'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
