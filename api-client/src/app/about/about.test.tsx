import { render } from '@testing-library/react';
import AboutUs from './page';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const localeMessages = {
  About: {
    aboutTeam: 'Our team:',
    Anton: {
      name: 'Anton Markov',
      role: 'Team Lead',
      bio: 'I am an information security specialist currently studying front-end development. Programming is an important part of my life, and I am fascinated with front-end development, which I now aspire to do daily. With each project and challenge, I have discovered my passion for front-end development and am ready to continue my journey towards becoming a professional in the field.',
      github: 'https://github.com/amrkov5',
    },
    Irina: {
      name: 'Irina Kolotilkina',
      role: 'Developer',
      bio: 'With a background in finance and linguistics, I started my journey into front-end development at RS School Stage 1 in November 2023. Before beginning studies at RS School, I worked for several years as a financial analyst for a bank and then as a corporate and private English teacher. Despite some ups and downs along the way, I have undeniably found my passion in this new field. I truly enjoy the challenges and mental exercise it provides.',
      github: 'https://github.com/kolirina',
    },
    Vitalii: {
      name: 'Vitalii Zomsha',
      role: 'Developer',
      bio: 'I am a third-year student majoring in Software Engineering. My background has primarily been in working with C# and Java, where I have gained a solid understanding of programming principles and practices. Recently, I have decided to venture into the exciting world of web development. I am passionate about expanding my knowledge and skills, and I am eager to see where this path in web development will take me.',
      github: 'https://github.com/veta306',
    },
  },
};

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => 'en'),
  getMessages: vi.fn(() => localeMessages),
}));

describe('about us test', () => {
  it('render cards', async () => {
    const locale = await getLocale();
    const messages = await getMessages();
    const { getByText, getAllByTestId, getAllByAltText, getAllByText } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AboutUs />
      </NextIntlClientProvider>
    );

    const cards = getAllByTestId('card');
    const images = getAllByAltText('member_photo');
    const AntonName = getByText('Anton Markov');
    const VitaliiName = getByText('Vitalii Zomsha');
    const IrinaName = getByText('Irina Kolotilkina');
    const tlText = getByText('Team Lead');
    const devText = getAllByText('Developer');
    const personBio = getAllByTestId('person-bio');

    expect(cards.length).toEqual(3);
    expect(images.length).toEqual(3);
    expect(AntonName).toBeInTheDocument();
    expect(VitaliiName).toBeInTheDocument();
    expect(IrinaName).toBeInTheDocument();
    expect(tlText).toBeInTheDocument();
    expect(devText.length).toEqual(2);
    expect(personBio.length).toEqual(3);
  });
});
