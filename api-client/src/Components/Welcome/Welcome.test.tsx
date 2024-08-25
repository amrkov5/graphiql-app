import { render } from '@testing-library/react';
import Welcome from './Welcome';

describe('Welcome test', () => {
  it('Should render Welcome page', () => {
    const { getByTestId, getByText } = render(<Welcome />);

    const welcomeBlock = getByTestId('welcome');
    expect(welcomeBlock).toBeInTheDocument();

    const signIn = getByText('Sign In');
    const signUp = getByText('Sign Up');
    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
  });
});
