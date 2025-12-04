'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Notification } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    load();
  }, [authLoading, user]);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/notifications');
      setItems(data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAll = async () => {
    await axios.put('/notifications/read-all');
    load();
  };

  const markOne = async (id: string) => {
    await axios.put(`/notifications/${id}/read`);
    load();
  };

  return (
    <DashboardShell
      title="Notifications"
      subtitle="Keep up with event updates, payments, and friends."
      actions={<Button variant="outline" onClick={markAll}>Mark all read</Button>}
    >
      <div className="glass-panel rounded-2xl border border-white/10 p-4">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-slate-300">You’re all caught up.</p>
        ) : (
          <div className="space-y-2">
            {items.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-3 flex items-start gap-3 ${n.read ? 'border-white/5 bg-white/5' : 'border-indigo-400/40 bg-indigo-500/10'}`}
              >
                <Badge variant="outline">{n.type}</Badge>
                <div className="flex-1">
                  <p className="font-semibold text-white">{n.title}</p>
                  <p className="text-sm text-slate-200">{n.body}</p>
                  <p className="text-xs text-slate-400 mt-1">{format(new Date(n.createdAt), 'PPp')}</p>
                </div>
                {!n.read && (
                  <Button className="px-3 py-1 text-sm" variant="ghost" onClick={() => markOne(n.id)}>
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
