import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal'; // Adjust the import path if necessary
import { describe, it, expect, vi } from 'vitest';

describe('Modal component', () => {
  it('renders the message correctly', () => {
    render(<Modal message="Test message" onClose={vi.fn()} />);

    // Check if the message is displayed
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal message="Test message" onClose={onClose} />);

    // Click the close button
    fireEvent.click(screen.getByText('Close'));

    // Check if the onClose function was called
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking outside the modal content', () => {
    const onClose = vi.fn();
    render(<Modal message="Test message" onClose={onClose} />);

    // Click outside the modal content (on the overlay)
    fireEvent.click(screen.getByRole('dialog'));

    // Check if the onClose function was called
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside the modal content', () => {
    const onClose = vi.fn();
    render(<Modal message="Test message" onClose={onClose} />);

    // Click inside the modal content
    fireEvent.click(screen.getByRole('dialog').firstChild!);

    // Check if the onClose function was not called
    expect(onClose).not.toHaveBeenCalled();
  });
});
