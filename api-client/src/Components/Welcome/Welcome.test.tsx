import { render } from '@testing-library/react';
import Welcome from './Welcome';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const localeMessages = {
  Welcome: {
    greeting: 'Welcome',
    return: 'Welcome back',
    history: 'History',
    about: 'About us',
    rest: 'REST Client',
    graphiql: 'GraphiQL Client',
    login: 'Sign In',
    register: 'Sign Up',
  },
};

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

describe('Welcome test', () => {
  it('Should render Welcome page', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    const { getByTestId, getByText } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Welcome />
      </NextIntlClientProvider>
    );

    const welcomeBlock = getByTestId('welcome');
    expect(welcomeBlock).toBeInTheDocument();

    const signIn = getByText('Sign In');
    const signUp = getByText('Sign Up');
    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
  });
});
