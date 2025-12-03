'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiGrid,
  FiHelpCircle,
  FiHome,
  FiMenu,
  FiPlus,
  FiSearch,
  FiStar,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
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
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dashboardLabel = user?.role === 'ADMIN' ? 'Dashboard' : 'My Events';

  const navItems = useMemo(() => {
    if (!user) return [];

    const base = [
      { href: '/dashboard', label: dashboardLabel, icon: FiGrid, roles: ['USER', 'HOST', 'ADMIN'] },
      { href: '/events', label: 'Browse Events', icon: FiCalendar, roles: ['USER', 'HOST', 'ADMIN'] },
      { href: '/events/create', label: 'Create Event', icon: FiPlus, roles: ['HOST', 'ADMIN'] },
      { href: '/admin', label: 'Admin', icon: FiBarChart2, roles: ['ADMIN'] },
      { href: '/admin/users', label: 'Users', icon: FiUsers, roles: ['ADMIN'] },
      { href: '/admin/users?role=HOST', label: 'Hosts', icon: FiUsers, roles: ['ADMIN'] },
      { href: '/admin/events', label: 'Events', icon: FiCalendar, roles: ['ADMIN'] },
      { href: '/admin/reviews', label: 'Reviews', icon: FiStar, roles: ['ADMIN'] },
      { href: '/admin/faq', label: 'FAQs', icon: FiHelpCircle, roles: ['ADMIN'] },
      { href: `/profile/${user.id}`, label: 'Profile', icon: FiUser, roles: ['USER', 'HOST', 'ADMIN'] },
    ];

    return base.filter((item) => item.roles.includes(user.role));
  }, [user, dashboardLabel]);

  const isActive = (href: string) => {
    const target = href.split('?')[0];
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const NavLinks = () => (
    <div className="space-y-1">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
        onClick={() => setOpen(false)}
      >
        <FiHome className={iconSize} />
        <span>Home</span>
      </Link>
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
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="hidden lg:block border-r border-white/10 bg-slate-950/80 backdrop-blur">
          <div className="sticky top-0 h-screen p-5 space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-white">
                EventHub
              </Link>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="glass-panel rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Navigation</p>
              </div>
              <NavLinks />
            </div>
            <div className="glass-panel rounded-2xl p-4 space-y-2">
              <p className="text-sm font-semibold text-white">Need help?</p>
              <p className="text-xs text-slate-300">Open the help center for quick answers.</p>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Help center
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Workspace</p>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search..."
                  className="w-48 rounded-xl border border-white/10 bg-white/5 px-10 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/40 focus:outline-none"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100">
                <FiBell /> Alerts
              </button>
              <button
                onClick={() => router.push('/')}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                <FiHome /> Home
              </button>
              {actions}
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">{children}</div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-80 bg-slate-900/95 border-r border-white/10 p-5 space-y-6 animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Navigation</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
              >
                <FiX />
              </button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}
    </div>
  );
}
