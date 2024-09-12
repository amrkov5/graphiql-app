import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HistorySection from './HistorySection';
import { getHistory } from '@/services/historyUtils';

const mockRouterPush = vi.fn();
const mockRouterRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    refresh: mockRouterRefresh,
  }),
}));

vi.mock('@/services/historyUtils', () => ({
  getHistory: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('HistorySection', () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
    mockRouterRefresh.mockClear();
    (getHistory as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renders empty state when no requests are in history', () => {
    (getHistory as ReturnType<typeof vi.fn>).mockReturnValue({});

    render(<HistorySection />);

    expect(screen.getByTestId('history-title')).toBeInTheDocument();
    expect(screen.getByTestId('no-requests-msg')).toBeInTheDocument();
    expect(screen.getByTestId('rest-link')).toBeInTheDocument();
    expect(screen.getByTestId('graphiql-link')).toBeInTheDocument();
  });

  it('renders history list when requests are in history', () => {
    (getHistory as ReturnType<typeof vi.fn>).mockReturnValue({
      '/test-url': {
        method: 'get',
        fullUrl: 'http://example.com/api/test',
        headers: { 'Content-Type': 'application/json' },
        body: null,
        savedUrl: '/test-url',
      },
    });

    render(<HistorySection />);

    expect(screen.getByTestId('history-list')).toBeInTheDocument();
    expect(screen.getByTestId('history-item')).toBeInTheDocument();
  });

  it('navigates to the saved URL when a history item is clicked', () => {
    (getHistory as ReturnType<typeof vi.fn>).mockReturnValue({
      '/test-url': {
        method: 'get',
        fullUrl: 'http://example.com/api/test',
        headers: { 'Content-Type': 'application/json' },
        body: null,
        savedUrl: '/test-url',
      },
    });

    render(<HistorySection />);

    const requestButton = screen.getByTestId('history-item');
    fireEvent.click(requestButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/test-url');
  });
});
