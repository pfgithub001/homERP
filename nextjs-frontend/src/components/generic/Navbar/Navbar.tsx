'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './my.module.scss';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  brand?: {
    label: string;
    href?: string;
  };
  links?: NavLink[];
  actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand = { label: 'homERP', href: '/' },
  links = [],
  actions,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          {brand.href ? (
            <Link href={brand.href} className={styles.brandLink}>
              {brand.label}
            </Link>
          ) : (
            <span className={styles.brandText}>{brand.label}</span>
          )}
        </div>

        <div className={styles.desktopNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>{actions}</div>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburgerLine} ${isOpen ? styles.open : ''}`} />
          <span className={`${styles.hamburgerLine} ${isOpen ? styles.open : ''}`} />
          <span className={`${styles.hamburgerLine} ${isOpen ? styles.open : ''}`} />
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {actions && <div className={styles.mobileActions}>{actions}</div>}
        </div>
      </div>
    </nav>
  );
};