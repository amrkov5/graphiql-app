import Link from 'next/link';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  return (
    <header>
      <Link href={'/'}>Link to /</Link>
      <LocaleSwitcher />
      <button>{t('login')}</button>
      <button>{t('register')}</button>
    </header>
  );
}
