'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number }>({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    } else {
      loadEvents();
    }
  }, [user, authLoading, meta.page]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/admin/events', {
        params: { page: meta.page, limit: meta.limit },
      });
      setEvents(data.data);
      if (data.meta) setMeta(data.meta);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`/admin/events/${id}`);
      toast.success('Event deleted');
      loadEvents();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 1)));

  return (
    <DashboardShell
      title="Admin · Events"
      subtitle="Full visibility into the experience pipeline."
      actions={
        <Button variant="outline" onClick={loadEvents}>
          Refresh
        </Button>
      }
    >
      <div className="glass-panel rounded-2xl border border-white/10">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-20 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {events.map((e) => (
              <div key={e.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="text-xs text-slate-300">
                    {format(new Date(e.date), 'PP')} at {e.time}
                  </p>
                  <p className="text-sm text-slate-200 mt-1 line-clamp-2">{e.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{e.status}</Badge>
                  <Badge variant="outline">{e.category}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="destructive" onClick={() => deleteEvent(e.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          disabled={meta.page <= 1}
          onClick={() => setMeta((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-300">
          Page {meta.page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={meta.page >= totalPages}
          onClick={() =>
            setMeta((p) => ({
              ...p,
              page: Math.min(Math.ceil(meta.total / meta.limit || 1), p.page + 1),
            }))
          }
        >
          Next
        </Button>
      </div>
    </DashboardShell>
  );
}
