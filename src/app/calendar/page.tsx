'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const today = useMemo(() => new Date(), []);
  const monthLabel = format(currentMonth, 'MMMM yyyy');
  const mobileDays = useMemo(
    () =>
      days
        .filter((day) => day.getMonth() === currentMonth.getMonth())
        .filter((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const hasEvents = (eventsByDay[key] || []).length > 0;
          return hasEvents || isSameDay(day, today);
        }),
    [currentMonth, days, eventsByDay, today]
  );

  return (
    <DashboardShell
      title="Calendar"
      subtitle="Navigate your joined events by date."
      actions={
        <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
          <Button size="sm" variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
            Prev
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
        </div>
      }
    >
      <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-white">{monthLabel}</p>
            <p className="text-xs text-slate-400">Mobile cards show only days with plans or today.</p>
          </div>
          <Badge variant="outline" className="bg-white/5 border-white/10 text-white">
            {events.length} events
          </Badge>
        </div>

        {loading ? (
          <>
            <div className="md:hidden space-y-2">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-20 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
            <div className="hidden md:grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, idx) => (
                <div key={idx} className="h-20 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="md:hidden space-y-3">
              {mobileDays.length === 0 ? (
                <p className="text-sm text-slate-300">No events scheduled this month yet.</p>
              ) : (
                mobileDays.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayEvents = eventsByDay[key] || [];
                  const isToday = isSameDay(day, today);

                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2 shadow-lg shadow-indigo-500/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{format(day, 'EEEE')}</p>
                          <p className="text-xs text-slate-400">{format(day, 'MMM d')}</p>
                        </div>
                        {isToday && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-indigo-500/50 text-indigo-300 bg-indigo-500/10"
                          >
                            Today
                          </Badge>
                        )}
                      </div>
                      {dayEvents.length === 0 ? (
                        <p className="text-xs text-slate-300">No events for this day.</p>
                      ) : (
                        <div className="space-y-2">
                          {dayEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-50"
                            >
                              <p className="text-sm font-semibold leading-tight">{ev.title}</p>
                              <p className="text-xs text-indigo-100/90">
                                {ev.time} - {ev.location || 'TBD'}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-7 text-center text-xs uppercase tracking-wide text-slate-300 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayEvents = eventsByDay[key] || [];
                  const inMonth = day.getMonth() === currentMonth.getMonth();
                  const isToday = isSameDay(day, today);

                  return (
                    <div
                      key={key}
                      className={cn(
                        'rounded-lg border border-white/10 p-2 min-h-[90px] transition-colors',
                        inMonth ? 'bg-white/5' : 'bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn('text-sm font-medium', isToday ? 'text-indigo-400' : 'text-white')}>
                          {format(day, 'd')}
                        </span>
                        {isToday && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-indigo-500/50 text-indigo-300 bg-indigo-500/10"
                          >
                            Today
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <div
                            key={ev.id}
                            className="rounded bg-indigo-500/20 text-[11px] text-indigo-50 px-1 py-0.5 truncate border border-indigo-500/20"
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <p className="text-[11px] text-slate-400 pl-1">+{dayEvents.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
