'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiGrid,
  FiMenu,
  FiPlus,
  FiSearch,
  FiStar,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const iconSize = 'text-lg';

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = useMemo(() => {
    if (!user) return [];

    const base = [
      { href: '/dashboard', label: 'Dashboard', icon: FiGrid, roles: ['USER', 'HOST', 'ADMIN'] },
      { href: '/events', label: 'Browse Events', icon: FiCalendar, roles: ['USER', 'HOST', 'ADMIN'] },
      { href: '/events/create', label: 'Create Event', icon: FiPlus, roles: ['HOST', 'ADMIN'] },
      { href: '/admin', label: 'Admin', icon: FiBarChart2, roles: ['ADMIN'] },
      { href: '/admin/users', label: 'Users', icon: FiUsers, roles: ['ADMIN'] },
      { href: '/admin/events', label: 'Events', icon: FiCalendar, roles: ['ADMIN'] },
      { href: '/admin/reviews', label: 'Reviews', icon: FiStar, roles: ['ADMIN'] },
      { href: `/profile/${user.id}`, label: 'Profile', icon: FiUser, roles: ['USER', 'HOST', 'ADMIN'] },
    ];

    return base.filter((item) => item.roles.includes(user.role));
  }, [user]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const NavLinks = () => (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition',
            isActive(item.href)
              ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-200 hover:bg-white/5 hover:text-white'
          )}
          onClick={() => setOpen(false)}
        >
          <item.icon className={iconSize} />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Navigation</p>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <NavLinks />
              </div>
              <div className="glass-panel rounded-2xl p-4 space-y-2">
                <p className="text-sm font-semibold text-white">Need help?</p>
                <p className="text-xs text-slate-300">
                  Check the help center or reach out to support for account updates.
                </p>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  Open help center
                </Link>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100"
              >
                <FiMenu /> Menu
              </button>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10 text-slate-200 text-sm">
                <FiBell /> Notifications
              </div>
            </div>

            <div className="glass-panel rounded-2xl border-white/10 p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Workspace</p>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
                  {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      placeholder="Search..."
                      className="w-52 rounded-xl border border-white/10 bg-white/5 px-10 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100">
                    <FiBell /> Alerts
                  </button>
                  {actions}
                </div>
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-80 bg-slate-900/95 border-r border-white/10 p-5 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Navigation</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
              >
                Close
              </button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
