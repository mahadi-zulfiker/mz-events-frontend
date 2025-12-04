'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function JoinedEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
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
      const { data } = await axios.get('/events/joined/me');
      setEvents(data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell title="Joined events" subtitle="Everything you RSVP’d to." actions={null}>
      <div className="glass-panel rounded-2xl border border-white/10 p-4">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-slate-300">No events joined yet.</p>
        ) : (
          <div className="space-y-2">
            {events.map((ev) => (
              <Link key={ev.id} href={`/events/${ev.id}`} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                  {ev.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{ev.title}</p>
                  <p className="text-xs text-slate-300">
                    {format(new Date(ev.date), 'PP')} at {ev.time} • {ev.location}
                  </p>
                </div>
                <Badge variant="outline">{ev.status}</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
