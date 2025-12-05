'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/layout/StatCard';
import Link from 'next/link';
import { FiArrowRight, FiCalendar, FiHelpCircle, FiStar, FiUsers } from 'react-icons/fi';

export default function AdminHomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    } else {
      loadStats();
    }
  }, [authLoading, user]);

  const loadStats = async () => {
    try {
      const { data } = await axios.get('/admin/stats');
      setStats(data.data);
    } catch {
      // soft fail to keep UI usable
    }
  };

  return (
    <DashboardShell
      title="Admin Command"
      subtitle="High-level health of users, events, and sentiment."
      actions={<span className="text-sm text-slate-300">Role: Admin</span>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total users" value={stats?.totalUsers ?? 0} tone="cyan" />
        <StatCard label="Live events" value={stats?.totalEvents ?? 0} tone="indigo" />
        <StatCard label="Completed payments" value={stats?.completedPayments ?? 0} tone="emerald" />
        <StatCard label="Revenue" value={`$${stats?.revenue ?? 0}`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLink href="/admin/users" icon={FiUsers} title="User management" copy="Promote, demote, or remove accounts." />
        <QuickLink href="/admin/events" icon={FiCalendar} title="Events oversight" copy="Audit, pause, or remove listings." />
        <QuickLink href="/admin/reviews" icon={FiStar} title="Review moderation" copy="Keep the feedback loop healthy." />
        <QuickLink href="/admin/faq" icon={FiHelpCircle} title="FAQ library" copy="Publish and edit help center content." />
      </div>
    </DashboardShell>
  );
}

const QuickLink = ({
  href,
  icon: Icon,
  title,
  copy,
}: {
  href: string;
  icon: any;
  title: string;
  copy: string;
}) => (
  <Link
    href={href}
    className="glass-panel rounded-2xl border border-white/10 p-4 flex items-start gap-3 transition hover:-translate-y-1"
  >
    <div className="rounded-xl bg-white/5 p-3 text-white">
      <Icon />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-white">{title}</p>
      <p className="text-sm text-slate-300">{copy}</p>
    </div>
    <FiArrowRight className="text-slate-300" />
  </Link>
);
