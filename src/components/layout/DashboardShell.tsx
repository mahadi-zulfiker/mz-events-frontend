'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiActivity,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiGrid,
  FiHome,
  FiMapPin,
  FiMenu,
  FiSettings,
  FiStar,
  FiUser,
  FiUsers,
  FiShield,
  FiX,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { confirmToast } from '../ui/confirm-toast';

type NavItem = {
  label: string;
  href?: string;
  icon: IconType;
  children?: NavItem[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

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

  const requestLogout = () =>
    confirmToast({
      title: 'Logout?',
      description: 'You will need to sign in again to access your workspace.',
      confirmText: 'Logout',
      tone: 'danger',
      onConfirm: logout,
    });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const profileHref = user ? `/profile/${user.id}` : '/login';

  const navSections = useMemo<NavSection[]>(() => {
    if (!user) return [];

    const attendeeSection: NavSection = {
      title: 'User Workspace',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: FiGrid },
        { href: '/events/joined', label: 'Joined Events', icon: FiCalendar },
        { href: '/events?tab=saved', label: 'Saved Events', icon: FiStar },
        { href: '/calendar', label: 'Calendar', icon: FiCalendar },
        { href: '/map', label: 'Map View', icon: FiMapPin },
        { href: '/friends', label: 'Friends', icon: FiUsers },
        { href: '/notifications', label: 'Notifications', icon: FiBell },
        { href: '/payments/history', label: 'Payment History', icon: FiCreditCard },
        { href: profileHref, label: 'Profile & Settings', icon: FiUser },
      ],
    };

    const hostSection: NavSection = {
      title: 'Host Tools',
      items: [
        { href: '/dashboard', label: 'Host Dashboard', icon: FiBarChart2 },
        { href: '/events/create', label: 'Create Event', icon: FiCalendar },
        { href: '/payments/revenue', label: 'Revenue & Payouts', icon: FiBarChart2 },
        { href: '/calendar', label: 'Calendar', icon: FiCalendar },
        { href: '/map', label: 'Map View', icon: FiMapPin },
      ],
    };

    const adminSection: NavSection = {
      title: 'Admin',
      items: [
        { href: '/admin', label: 'Admin Dashboard', icon: FiGrid },
        { href: '/admin/users', label: 'Users', icon: FiUsers },
        { href: '/admin/users?role=HOST', label: 'Hosts', icon: FiUsers },
        { href: '/admin/events', label: 'Events', icon: FiCalendar },
        { href: '/payments/revenue', label: 'Payments & Revenue', icon: FiCreditCard },
        { href: '/admin/reviews', label: 'Reviews & Ratings', icon: FiStar },
        { href: '/notifications', label: 'Notifications', icon: FiBell },
        { href: profileHref, label: 'Settings', icon: FiSettings },
      ],
    };

    if (user.role === 'ADMIN') {
      const adminHostSection: NavSection = {
        ...hostSection,
        items: [
          { href: '/dashboard', label: 'Host Dashboard', icon: FiBarChart2 },
          { href: '/events/create', label: 'Create Event', icon: FiCalendar },
          { href: '/admin/events', label: 'Manage Events', icon: FiGrid },
          { href: '/payments/revenue', label: 'Revenue & Payouts', icon: FiBarChart2 },
          { href: '/calendar', label: 'Calendar', icon: FiCalendar },
          { href: '/map', label: 'Map View', icon: FiMapPin },
        ],
      };
      return [adminSection, adminHostSection, attendeeSection];
    }
    if (user.role === 'HOST') return [hostSection, attendeeSection];
    return [attendeeSection];
  }, [profileHref, user]);

  useEffect(() => {
    const defaults: Record<string, boolean> = {};
    const itemDefaults: Record<string, boolean> = {};
    navSections.forEach((section) => {
      defaults[section.title] = true;
      section.items.forEach((item) => {
        if (item.children?.length) {
          itemDefaults[`${section.title}-${item.label}`] = true;
        }
      });
    });
    setOpenSections(defaults);
    setOpenItems(itemDefaults);
  }, [navSections]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const normalizeHref = (href?: string) => href?.split('#')[0].split('?')[0] ?? '';

  const isActiveHref = (href?: string) => {
    const target = normalizeHref(href);
    if (!target) return false;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const isItemActive = (item: NavItem): boolean =>
    (item.href && isActiveHref(item.href)) || !!item.children?.some((child) => isItemActive(child));

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    let accumulated = '';
    return segments.map((segment) => {
      accumulated += `/${segment}`;
      const label = segment
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      return { label, href: accumulated };
    });
  }, [pathname]);

  const renderNavItem = (item: NavItem, sectionKey: string, depth = 0) => {
    const key = `${sectionKey}-${item.label}`;
    const hasChildren = !!item.children?.length;
    const expanded = openItems[key] ?? false;
    const active = isItemActive(item);

    const ItemContent = (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition border border-transparent',
          active
            ? 'bg-white/10 text-white border-white/10 shadow-lg shadow-indigo-500/20'
            : 'text-slate-200 hover:bg-white/5 hover:text-white'
        )}
      >
        <item.icon className={iconSize} />
        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
        {hasChildren && !sidebarCollapsed && (
          <FiChevronDown
            className={cn('ml-auto text-xs transition-transform', expanded && 'rotate-180')}
          />
        )}
        {sidebarCollapsed && <span className="sr-only">{item.label}</span>}
      </div>
    );

    if (hasChildren) {
      return (
        <div key={key} className="space-y-1">
          <button
            onClick={() => setOpenItems((prev) => ({ ...prev, [key]: !expanded }))}
            className="w-full text-left"
            aria-expanded={expanded}
          >
            {ItemContent}
          </button>
          {!sidebarCollapsed && (
            <div
              className={cn(
                'pl-3 border-l border-white/5 transition-all duration-200 space-y-1',
                expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              )}
            >
              {item.children?.map((child) => renderNavItem(child, sectionKey, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link key={key} href={item.href || '#'} className="block">
        {ItemContent}
      </Link>
    );
  };

  const SidebarNav = ({ collapsed }: { collapsed: boolean }) => (
    <div className="space-y-5">
      <Link
        href="/"
        className={cn(
          'flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10',
          collapsed ? 'justify-center' : 'border border-white/10'
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30">
          <HiSparkles className="text-white text-lg" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Workspace</p>
            <p className="text-base font-semibold">EventHub</p>
          </div>
        )}
      </Link>

      {navSections.map((section) => {
        const open = openSections[section.title] ?? true;
        return (
          <div key={section.title} className="space-y-2">
            <button
              onClick={() => setOpenSections((prev) => ({ ...prev, [section.title]: !open }))}
              className={cn(
                'flex w-full items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-300',
                collapsed && 'justify-center'
              )}
              aria-expanded={open}
            >
              {!collapsed && section.title}
              {collapsed ? (
                <span className="sr-only">{section.title}</span>
              ) : (
                <FiChevronDown
                  className={cn('text-sm transition-transform', open ? 'rotate-180' : '')}
                />
              )}
            </button>
            {open && (
              <div className="space-y-1">
                {section.items.map((item) => renderNavItem(item, section.title))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'hidden lg:flex flex-col border-r border-white/10 bg-slate-950/85 backdrop-blur-xl transition-all duration-300',
            sidebarCollapsed ? 'w-20' : 'w-64'
          )}
        >
          <div className="flex items-center justify-between px-3 py-4 border-b border-white/5">
            {!sidebarCollapsed && (
              <p className="text-sm font-semibold text-white leading-tight">
                Navigation
                <span className="block text-[11px] text-slate-400 font-normal">
                  Role-aware shortcuts
                </span>
              </p>
            )}
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white hover:border-white/30"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav collapsed={sidebarCollapsed} />
          </div>
          <div className="border-t border-white/5 px-3 py-4 space-y-2">
            <button
              onClick={() => router.push(profileHref)}
              className="w-full inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              <FiUser /> {!sidebarCollapsed && 'Profile'}
            </button>
            <button
              onClick={requestLogout}
              className="w-full inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-white/10"
            >
              <FiX /> {!sidebarCollapsed && 'Logout'}
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/70 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <FiMenu />
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    <Link href="/dashboard" className="hover:text-white">
                      Workspace
                    </Link>
                    {breadcrumbs.map((crumb, idx) => (
                      <div key={crumb.href} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <Link href={crumb.href} className="hover:text-white">
                          {crumb.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
                  {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative hidden md:block">
                  <input
                    placeholder="Quick search"
                    className="w-52 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/40 focus:outline-none"
                  />
                </div>
                <Link
                  href="/notifications"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  <FiBell /> Alerts
                </Link>
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  <FiHome /> Home
                </Link>
                {actions}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-slate-950/95 border-r border-white/10 p-5 space-y-6 animate-slide-right z-[95] shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Navigation</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
              >
                <FiX />
              </button>
            </div>
            <SidebarNav collapsed={false} />
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => router.push(profileHref)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                <FiUser /> Profile
              </button>
              <button
                onClick={requestLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-white/10"
              >
                <FiX /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
