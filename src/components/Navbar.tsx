'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  FiCalendar,
  FiGrid,
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiX,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const navLinks = useMemo(() => {
    const publicLinks = [
      { href: '/events', label: 'Explore Events', icon: FiCalendar },
      { href: '/register?role=HOST', label: 'Become a Host', icon: HiSparkles },
    ];

    if (!user) return publicLinks;

    const dashboardLink = {
      href: user.role === 'ADMIN' ? '/admin' : '/dashboard',
      label: user.role === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard',
      icon: FiGrid,
    };

    return [...publicLinks, dashboardLink];
  }, [user]);

  const isActive = (href: string) => {
    const target = href.split('#')[0].split('?')[0];
    return pathname === target || (target !== '/' && pathname.startsWith(target));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dashboardHref = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const userInitial = user ? (user.fullName || user.email || 'U').trim().charAt(0).toUpperCase() : '';
  const handleLogout = () => {
    setUserMenuOpen(false);
    setOpen(false);
    logout();
  };

  const UserMenu = () =>
    user ? (
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setUserMenuOpen((p) => !p)}
          className="flex items-center gap-3 rounded-full bg-white/5 px-3 py-2 border border-white/10 hover:border-white/30 transition text-white text-sm font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold uppercase text-white shadow-lg shadow-indigo-500/30">
            {userInitial}
          </span>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs text-slate-300">Signed in</span>
            <span className="text-sm font-semibold text-white max-w-[140px] truncate">
              {user.fullName || user.email}
            </span>
          </div>
          <FiChevronDown className="text-slate-200" />
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-900/95 shadow-lg shadow-indigo-900/30 overflow-hidden">
            <Link
              href={dashboardHref}
              onClick={() => {
                setUserMenuOpen(false);
                setOpen(false);
              }}
              className="block px-4 py-3 text-sm text-slate-100 hover:bg-white/10"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
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

        <div className="hidden md:flex flex-wrap items-center gap-2 lg:gap-3 whitespace-nowrap py-1 no-scrollbar overflow-visible">
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
            <UserMenu />
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
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3 animate-slide-down">
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
              <div className="space-y-2">
                <UserMenu />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
