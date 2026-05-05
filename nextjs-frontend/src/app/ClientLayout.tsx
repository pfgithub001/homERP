'use client';

import { Navbar } from '@/components/generic/Navbar/Navbar';

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Categories', href: '/categories' },
  { label: 'Accounts', href: '/accounts' },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar
        brand={{ label: 'homERP', href: '/' }}
        links={navLinks}
      />
      {children}
    </>
  );
}