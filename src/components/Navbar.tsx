'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { confirmToast } from '@/components/ui/confirm-toast';
import { Avatar } from './ui/avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const dashboardHref = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const profileHref = user ? `/profile/${user.id}` : '/login';
  const userInitial = user
    ? (user.fullName || user.email || 'U').trim().charAt(0).toUpperCase()
    : '';

  const navLinks = useMemo(
    () =>
      user
        ? [
            { href: '/', label: 'Home' },
            { href: '/events', label: 'Events' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
            { href: dashboardHref, label: 'Dashboard' },
          ]
        : [
            { href: '/', label: 'Home' },
            { href: '/events', label: 'Events' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ],
    [dashboardHref, user]
  );

  const secondaryLinks = useMemo(
    () =>
      user
        ? [
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
            { href: '/faq', label: 'Help Center' },
          ]
        : [
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
            { href: '/faq', label: 'Help Center' },
          ],
    [user]
  );

  const isActive = (href: string) => {
    const target = href.split('#')[0].split('?')[0];
    return (
      pathname === target || (target !== '/' && pathname.startsWith(target))
    );
  };

  // For portals (so we don't touch document during SSR)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Change navbar style on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    confirmToast({
      title: 'Logout?',
      description: 'You will need to sign back in to join or host events.',
      confirmText: 'Logout',
      tone: 'danger',
      onConfirm: logout,
    });
  };

  const navStyles = cn(
    'sticky top-0 z-[9999] transition-all duration-300',
    scrolled || pathname !== '/'
      ? 'backdrop-blur-xl bg-slate-950/90 border-b border-white/10 shadow-lg shadow-black/30'
      : 'backdrop-blur-0 bg-transparent'
  );

  const NavLogo = () => (
    <Link href="/" className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden">
        <Image
          src="/logo-eventhub.svg"
          alt="EventHub"
          width={36}
          height={36}
          priority
        />
      </div>
      <div className="leading-tight hidden sm:block">
        <span className="text-lg font-extrabold text-white tracking-tight">
          EventHub
        </span>
        <p className="text-xs text-slate-300">Experiences that stick</p>
      </div>
    </Link>
  );

  const UserMenu = () =>
    user ? (
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setUserMenuOpen((p) => !p)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30"
          aria-expanded={userMenuOpen}
        >
          <Avatar
            src={user.profileImage}
            fallback={user.fullName || user.email}
            className="h-9 w-9 shadow-lg shadow-indigo-500/30 border border-white/10"
          />
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[11px] text-slate-300">Signed in</span>
            <span className="text-sm font-semibold text-white max-w-[140px] truncate">
              {user.fullName || user.email}
            </span>
          </div>
          <FiChevronDown
            className={cn(
              'text-slate-200 transition',
              userMenuOpen && 'rotate-180'
            )}
          />
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 animate-slide-down">
            <Link
              href={profileHref}
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-100 hover:bg-white/5"
            >
              <FiUser /> View profile
            </Link>
            <Link
              href={dashboardHref}
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-100 hover:bg-white/5"
            >
              <FiSettings /> Settings &amp; dashboard
            </Link>
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-100 hover:bg-white/5"
              >
                <HiSparkles className="text-indigo-300" /> Admin panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-100 hover:bg-white/5 hover:text-white"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    ) : null;

  const NotificationBell = () =>
    user ? (
      <Link
        href="/notifications"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
        aria-label="Notifications"
      >
        <FiBell />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </Link>
    ) : null;

  // Mobile drawer rendered in a portal so it can’t appear behind other content
  const MobileMenuPortal =
    isClient && mobileOpen
      ? createPortal(
          <>
            <div
              className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-[99999] w-80 max-w-[88vw] overflow-y-auto border-r border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 transition-transform duration-300 animate-slide-right will-change-transform">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <NavLogo />
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white hover:border-white/30"
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              <div className="px-5 py-4 space-y-3">
                {user ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profileImage}
                        fallback={user.fullName || user.email}
                        className="h-10 w-10 shadow-lg shadow-indigo-500/30 border border-white/10"
                      />
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-white">
                          {user.fullName || user.email}
                        </p>
                        <p className="text-xs text-slate-300">
                          {user.role} mode
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Link
                        href={dashboardHref}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-center text-sm font-semibold text-slate-100 hover:bg-white/5"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={profileHref}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-center text-sm font-semibold text-slate-100 hover:bg-white/5"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition',
                        isActive(item.href)
                          ? 'bg-white/10 text-white border border-white/10'
                          : 'text-slate-200 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  {secondaryLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {!user ? (
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="text-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-red-100 hover:bg-white/5 hover:text-white"
                  >
                    <FiLogOut /> Logout
                  </button>
                )}
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <>
      <nav className={navStyles}>
        <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <NavLogo />

          <div className="hidden md:flex items-center gap-2 lg:gap-3 whitespace-nowrap py-1 no-scrollbar overflow-visible">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
                  isActive(item.href)
                    ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                )}
              >
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
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user && <NotificationBell />}
            <button
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-lg border text-white transition',
                mobileOpen
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5'
              )}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {MobileMenuPortal}
    </>
  );
}
