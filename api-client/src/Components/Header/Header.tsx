import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Link href={'/'}>Link to /</Link>
      <div>Language toggler</div>
      <button>Sign In</button>
      <button>Sign Up</button>
    </header>
  );
}
