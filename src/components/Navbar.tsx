'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  FiCalendar,
  FiGrid,
  FiHome,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiShield,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = useMemo(() => {
    if (!user) {
      return [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/events', label: 'Explore Events', icon: FiCalendar },
        { href: '/register?role=HOST', label: 'Become a Host', icon: HiSparkles },
      ];
    }

    if (user.role === 'ADMIN') {
      return [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/admin', label: 'Admin Dashboard', icon: FiShield },
        { href: '/admin/users', label: 'Manage Users', icon: FiUsers },
        { href: '/admin/users?role=HOST', label: 'Manage Hosts', icon: FiUsers },
        { href: '/admin/events', label: 'Manage Events', icon: FiCalendar },
        { href: '/admin/faq', label: 'Manage FAQs', icon: FiHelpCircle },
        { href: `/profile/${user.id}`, label: 'Profile', icon: FiUser },
      ];
    }

    if (user.role === 'HOST') {
      return [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/events', label: 'Explore Events', icon: FiCalendar },
        { href: '/dashboard#hosted', label: 'My Events', icon: FiGrid },
        { href: '/events/create', label: 'Create Event', icon: FiPlus },
        { href: `/profile/${user.id}`, label: 'Profile', icon: FiUser },
      ];
    }

    return [
      { href: '/', label: 'Home', icon: FiHome },
      { href: '/events', label: 'Explore Events', icon: FiCalendar },
      { href: '/dashboard#joined', label: 'My Events', icon: FiGrid },
      { href: `/profile/${user.id}`, label: 'Profile', icon: FiUser },
    ];
  }, [user]);

  const isActive = (href: string) => {
    const target = href.split('#')[0].split('?')[0];
    return pathname === target || (target !== '/' && pathname.startsWith(target));
  };

  const UserBadge = () =>
    user ? (
      <div className="flex items-center gap-3 rounded-full bg-white/5 px-3 py-2 border border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white">
          {user.fullName?.[0] || 'U'}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">{user.fullName}</p>
          <p className="text-xs text-slate-300">{user.role}</p>
        </div>
      </div>
    ) : null;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/70 border-b border-white/10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <HiSparkles className="text-white text-xl" />
          </div>
          <div className="leading-tight">
            <span className="text-lg font-extrabold text-white tracking-tight">EventHub</span>
            <p className="text-xs text-slate-300">Experiences that stick</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 lg:gap-3 overflow-x-auto whitespace-nowrap py-1">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="text-lg" />
              <span>{item.label}</span>
            </Link>
          ))}
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-slate-200 hover:text-white text-sm font-semibold px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:translate-y-[-1px]"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <UserBadge />
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <FiLogOut /> Logout
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white"
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            ))}

            {!user ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="text-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-3">
                <UserBadge />
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
