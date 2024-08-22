import Link from 'next/link';

import styles from './footer.module.css';
import RSLogo from './RSLogo';

export default function Footer() {
  return (
    <footer className={styles.footer} data-testid="footer">
      <Link
        href={'https://github.com/amrkov5/graphiql-app'}
        className={styles.footerLink}
      >
        AI Team Repo
      </Link>
      <span>2024</span>
      <Link href="https://rs.school/courses/reactjs">
        <RSLogo />
      </Link>
    </footer>
  );
}
