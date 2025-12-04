'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDays, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth, startOfWeek } from 'date-fns';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadEvents();
  }, [authLoading, user]);

  const loadEvents = async () => {
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

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = addDays(endOfMonth(currentMonth), 6);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((ev) => {
      const key = format(new Date(ev.date), 'yyyy-MM-dd');
      map[key] = map[key] ? [...map[key], ev] : [ev];
    });
    return map;
  }, [events]);

  return (
    <DashboardShell
      title="Calendar"
      subtitle="Navigate your joined events by date."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentMonth(addDays(currentMonth, -30))}>Prev</Button>
          <Button variant="outline" onClick={() => setCurrentMonth(addDays(currentMonth, 30))}>Next</Button>
          <Button variant="ghost" onClick={() => setCurrentMonth(new Date())}>Today</Button>
        </div>
      }
    >
      <div className="glass-panel rounded-2xl border border-white/10 p-4">
        <div className="grid grid-cols-7 text-center text-xs uppercase tracking-wide text-slate-300 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, idx) => (
              <div key={idx} className="h-20 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDay[key] || [];
              const inMonth = day.getMonth() === currentMonth.getMonth();
              return (
                <div key={key} className={`min-h-[90px] rounded-lg border border-white/10 p-2 ${inMonth ? 'bg-white/5' : 'bg-slate-800/50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{format(day, 'd')}</span>
                    {isSameDay(day, new Date()) && <Badge variant="outline" className="text-[10px]">Today</Badge>}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="rounded bg-indigo-500/20 text-[11px] text-indigo-50 px-1 py-0.5">
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-[11px] text-slate-300">+{dayEvents.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
