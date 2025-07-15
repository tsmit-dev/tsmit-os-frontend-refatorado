'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/os', label: 'Ordens de Serviço' },
  { href: '/clients', label: 'Clientes' },
  { href: '/services', label: 'Serviços' },
  { href: '/statuses', label: 'Status' },
  { href: '/users', label: 'Usuários' },
  { href: '/roles', label: 'Cargos' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/dashboard" passHref>
          <span className={styles.logoLink}>Controle de OS</span>
        </Link>
      </div>
      <ul>
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} passHref>
              <span className={pathname === href ? styles.active : ''}>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
