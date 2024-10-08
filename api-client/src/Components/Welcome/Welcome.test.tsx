import { render } from '@testing-library/react';
import Welcome from './Welcome';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { configureStore } from '@reduxjs/toolkit';
import loginStateReducer from '../../slices/loginSlice';
import { Provider } from 'react-redux';

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

vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    query: {},
    asPath: '',
  })),
}));

describe('Welcome test', () => {
  it('Should render Welcome page while is not` logged in', async () => {
    const store = configureStore({
      reducer: {
        loginState: loginStateReducer,
      },
      preloadedState: {
        loginState: { loggedIn: false, error: false },
      },
    });
    const locale = await getLocale();
    const messages = await getMessages();
    const { getByTestId, getByText } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <Welcome userName={null} />
        </Provider>
      </NextIntlClientProvider>
    );

    const welcomeBlock = getByTestId('welcome');
    expect(welcomeBlock).toBeInTheDocument();

    const signIn = getByText('Sign In');
    const signUp = getByText('Sign Up');
    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
  });
  it('Should render Welcome page while is not` logged in', async () => {
    const store = configureStore({
      reducer: {
        loginState: loginStateReducer,
      },
      preloadedState: {
        loginState: { loggedIn: true, error: false },
      },
    });
    const locale = await getLocale();
    const messages = await getMessages();
    const { getByTestId, getByText } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <Welcome userName={null} />
        </Provider>
      </NextIntlClientProvider>
    );

    const welcomeBlock = getByTestId('welcome');
    expect(welcomeBlock).toBeInTheDocument();

    const rest = getByText('REST Client');
    const graphi = getByText('GraphiQL Client');
    const history = getByText('History');
    expect(rest).toBeInTheDocument();
    expect(graphi).toBeInTheDocument();
    expect(history).toBeInTheDocument();
  });
});
