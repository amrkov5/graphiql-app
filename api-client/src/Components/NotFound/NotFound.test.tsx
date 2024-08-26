import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from './NotFound';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Mock the useRouter and useTranslations hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      '404': 'Page not found',
      message: 'Sorry, the page you are looking for does not exist.',
      toMain: 'Go to main page',
    };
    return translations[key];
  },
}));

describe('NotFound Component', () => {
  it('should render the 404 message', () => {
    render(<NotFound />);

    expect(screen.getByText('404 | Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('Sorry, the page you are looking for does not exist.')
    ).toBeInTheDocument();
    expect(screen.getByText('Go to main page')).toBeInTheDocument();
  });

  it('should redirect to main page on button click', () => {
    const mockPush = vi.fn();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush });

    render(<NotFound />);

    const button = screen.getByText('Go to main page');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
