import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { describe, it, expect, vi } from 'vitest';

describe('Modal component', () => {
  it('renders the message correctly', () => {
    render(<Modal message="Test message" onClose={vi.fn()} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal message="Test message" onClose={onClose} />);
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking outside the modal content', () => {
    const onClose = vi.fn();
    render(<Modal message="Test message" onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside the modal content', () => {
    const onClose = vi.fn();
    render(<Modal message="Test message" onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog').firstChild!);
    expect(onClose).not.toHaveBeenCalled();
  });
});
