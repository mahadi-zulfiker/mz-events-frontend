'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Payment } from '@/types';
import { formatCurrency } from '@/lib/utils';

type RevenueMeta = {
  summary: { completed: number; pending: number; refunded: number };
  monthly: Record<string, number>;
};

export default function RevenuePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<RevenueMeta>({ summary: { completed: 0, pending: 0, refunded: 0 }, monthly: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== 'HOST' && user.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }
    loadRevenue();
  }, [authLoading, user]);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/payments/revenue');
      setPayments(data.data);
      setMeta(data.meta);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load revenue');
    } finally {
      setLoading(false);
    }
  };

  const monthlyList = useMemo(
    () =>
      Object.entries(meta.monthly || {}).sort(([a], [b]) => (a > b ? -1 : 1)),
    [meta.monthly]
  );

  return (
    <DashboardShell
      title="Revenue dashboard"
      subtitle="Track earnings, refunds, and payout readiness."
      actions={<Button variant="outline" onClick={loadRevenue}>Refresh</Button>}
    >
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Completed" value={formatCurrency(meta.summary.completed || 0)} tone="emerald" />
        <SummaryCard label="Pending" value={formatCurrency(meta.summary.pending || 0)} tone="amber" />
        <SummaryCard label="Refunded" value={formatCurrency(meta.summary.refunded || 0)} tone="slate" />
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 p-4 mb-6">
        <p className="font-semibold text-white mb-2">Monthly breakdown</p>
        {monthlyList.length === 0 ? (
          <p className="text-sm text-slate-300">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {monthlyList.map(([month, value]) => (
              <div key={month} className="flex items-center justify-between rounded-lg bg-white/5 p-2 text-sm text-white">
                <span>{month}</span>
                <span>{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 p-4">
        <p className="font-semibold text-white mb-3">Recent transactions</p>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-slate-300">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.slice(0, 20).map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white">{p.event?.title}</p>
                  <p className="text-xs text-slate-400">
                    {p.event?.date ? format(new Date(p.event.date), 'PP') : ''} • {p.status}
                  </p>
                </div>
                <p className="text-white font-semibold">{formatCurrency(p.amount)}</p>
                <Badge variant="outline">{p.status}</Badge>
                {p.receiptUrl && (
                  <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-200 underline">
                    Receipt
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

const SummaryCard = ({ label, value, tone }: { label: string; value: string; tone: 'emerald' | 'amber' | 'slate' }) => {
  const toneMap: Record<typeof tone, string> = {
    emerald: 'from-emerald-500/30 to-teal-400/20',
    amber: 'from-amber-500/30 to-orange-400/20',
    slate: 'from-slate-500/30 to-slate-400/20',
  };
  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-4 shadow-lg">
      <div className={`h-2 w-full rounded-full bg-gradient-to-r ${toneMap[tone]} mb-3`} />
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};
