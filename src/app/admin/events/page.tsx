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
import { confirmToast } from '@/components/ui/confirm-toast';
import Link from 'next/link';

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

  const confirmDeleteEvent = (id: string, title: string) =>
    confirmToast({
      title: 'Delete event?',
      description: `This removes "${title}" and its attendees.`,
      confirmText: 'Delete',
      tone: 'danger',
      onConfirm: () => deleteEvent(id),
    });

  const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 1)));

  return (
    <DashboardShell
      title="Admin - Events"
      subtitle="Full visibility into the experience pipeline."
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href="/events/create">
            <Button>Create event</Button>
          </Link>
          <Button variant="outline" onClick={loadEvents}>
            Refresh
          </Button>
        </div>
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
          <div className="space-y-3 md:space-y-0 md:divide-y md:divide-white/5">
            {events.map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-sm md:grid md:grid-cols-[1.4fr_auto] md:items-start md:gap-4 md:rounded-none md:border-none md:bg-transparent md:shadow-none"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white text-base md:text-sm">{e.title}</p>
                      <p className="text-sm text-slate-300">
                        {format(new Date(e.date), 'PP')} at {e.time}
                      </p>
                    </div>
                    <Badge variant="outline" className="md:hidden text-[10px]">
                      {e.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-200 mt-1 line-clamp-3 bg-white/5 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                    {e.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="hidden md:inline-flex">
                      {e.status}
                    </Badge>
                    <Badge variant="outline">{e.category}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 mt-3 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-none">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <Link href={`/events/edit/${e.id}`}>
                      <Button variant="outline" size="sm" className="h-8">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() => confirmDeleteEvent(e.id, e.title)}
                    >
                      Delete
                    </Button>
                  </div>
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
