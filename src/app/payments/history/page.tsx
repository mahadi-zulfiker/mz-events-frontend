'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Payment } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusColor: Record<Payment['status'], string> = {
  COMPLETED: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
  PENDING: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
  FAILED: 'bg-red-500/20 text-red-200 border-red-500/30',
  REFUNDED: 'bg-slate-500/20 text-slate-200 border-slate-400/30',
};

export default function PaymentHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<{ totalSpent: number }>({ totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadPayments();
  }, [user, authLoading]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/payments/history');
      setPayments(data.data);
      setMeta(data.meta);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Payment history"
      subtitle="Receipts for every transaction."
      actions={<Button variant="outline" onClick={loadPayments}>Refresh</Button>}
    >
      <div className="glass-panel rounded-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-300">Total spent</p>
          <p className="text-2xl font-bold text-white">${meta.totalSpent?.toFixed(2) || '0.00'}</p>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-slate-300">No payments yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white">{p.event?.title || 'Event'}</p>
                  <p className="text-xs text-slate-400">
                    {p.event?.location} • {p.event?.date ? format(new Date(p.event.date), 'PP') : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${Number(p.amount).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{format(new Date(p.createdAt), 'PP p')}</p>
                </div>
                <Badge className={statusColor[p.status] || ''}>{p.status}</Badge>
                {p.receiptUrl && (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-200 hover:text-white underline"
                  >
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
