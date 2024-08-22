import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <Link href={'https://github.com/amrkov5/graphiql-app'}>Dev repo</Link>
      <span>2024</span>
      <Link href="https://rs.school/">RSS pic</Link>
    </footer>
  );
}
