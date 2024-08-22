import { render } from '@testing-library/react';
import RootLayout from './layout';

describe('Layout test', () => {
  it('renders layout', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>test div</div>
      </RootLayout>
    );

    const header = getByTestId('header');
    expect(header).toBeInTheDocument();

    const footer = getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
