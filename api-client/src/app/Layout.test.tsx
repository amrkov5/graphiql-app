import { render } from '@testing-library/react';
import RootLayout from './layout';

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => ({ greeting: 'Hello' })),
}));

describe('Layout test', () => {
  it('renders layout', async () => {
    const layout = await RootLayout({ children: <div>test div</div> });
    const { getByTestId } = render(layout);

    const header = getByTestId('header');
    expect(header).toBeInTheDocument();

    const footer = getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
