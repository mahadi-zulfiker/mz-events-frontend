'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Event, Review } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [joined, setJoined] = useState<Event[]>([]);
  const [hosted, setHosted] = useState<Event[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminEvents, setAdminEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [authLoading, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'ADMIN') {
        const [statsRes, usersRes, eventsRes] = await Promise.all([
          axios.get('/admin/stats'),
          axios.get('/admin/users'),
          axios.get('/admin/events'),
        ]);
        setAdminStats(statsRes.data.data);
        setAdminUsers(usersRes.data.data);
        setAdminEvents(eventsRes.data.data);
      } else {
        const [eventsRes, reviewsRes] = await Promise.all([
          axios.get(`/users/${user?.id}/events`),
          user?.role === 'HOST' ? axios.get(`/users/${user?.id}/reviews`) : Promise.resolve(null),
        ]);
        setHosted(eventsRes.data.data.hosted || []);
        setJoined(eventsRes.data.data.joined || []);
        if (reviewsRes) setReviews(reviewsRes.data.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const revenue = useMemo(() => {
    if (!hosted) return 0;
    return hosted.reduce((sum, e) => {
      const paidParticipants = Array.isArray(e.participants)
        ? e.participants.filter((p) => p.paymentStatus === 'COMPLETED').length
        : e._count?.participants ?? 0;
      return sum + Number(e.joiningFee || 0) * paidParticipants;
    }, 0);
  }, [hosted]);

  if (!user) return null;

  return (
    <DashboardShell
      title={`Welcome back, ${user.fullName?.split(' ')[0] || 'there'}`}
      subtitle={
        user.role === 'ADMIN'
          ? 'Monitor the platform pulse at a glance.'
          : 'Your personal workspace for everything events.'
      }
      actions={
        user.role === 'HOST' ? (
          <Button onClick={() => router.push('/events/create')}>Create event</Button>
        ) : user.role === 'ADMIN' ? (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => router.push('/events/create')}>Create event</Button>
            <Button variant="outline" onClick={() => router.push('/admin/events')}>
              Manage events
            </Button>
            <Button variant="ghost" onClick={() => router.push('/admin/users')}>
              Manage users
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => router.push('/events')}>
            Browse events
          </Button>
        )
      }
    >
      {loading ? (
        <DashboardSkeleton />
      ) : user.role === 'ADMIN' ? (
        <AdminDashboard stats={adminStats} users={adminUsers} events={adminEvents} />
      ) : (
        <UserDashboard
          role={user.role}
          hosted={hosted}
          joined={joined}
          revenue={revenue}
          reviews={reviews}
          onRefresh={loadData}
        />
      )}
    </DashboardShell>
  );
}

const UserDashboard = ({
  role,
  hosted,
  joined,
  revenue,
  reviews,
  onRefresh,
}: {
  role: 'USER' | 'HOST';
  hosted: Event[];
  joined: Event[];
  revenue: number;
  reviews: Review[];
  onRefresh: () => void;
}) => {
  const upcomingJoined = joined.filter((e) => new Date(e.date) >= new Date());
  const pastJoined = joined.filter((e) => new Date(e.date) < new Date());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatBox label="Upcoming" value={upcomingJoined.length} tone="indigo" />
        <StatBox label="Completed" value={pastJoined.length} tone="emerald" />
        {role === 'HOST' && (
          <StatBox label="Est. revenue" value={formatCurrency(revenue)} tone="amber" />
        )}
      </div>

      {role === 'HOST' && (
        <Section
          id="hosted"
          title="My hosted events"
          description="Keep tabs on your live and upcoming experiences."
          emptyText="No hosted events yet."
        >
          {hosted.length === 0 ? (
            <EmptyState
              message="Launch your first experience."
              actionLabel="Refresh"
              onAction={onRefresh}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hosted.map((e) => (
                <EventCard key={e.id} event={e} manage />
              ))}
            </div>
          )}
        </Section>
      )}

      <Section
        id="joined"
        title="Joined events"
        description="Everything you have RSVP'd to in one clean view."
        emptyText="You have not joined any events yet."
      >
        {joined.length === 0 ? (
          <EmptyState message="Explore events to join." actionLabel="Refresh" onAction={onRefresh} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {joined.map((e) => (
              <Link key={e.id} href={`/events/${e.id}`} className="block">
                <EventCard event={e} />
              </Link>
            ))}
          </div>
        )}
      </Section>
      {role === 'HOST' && (
        <Section
          id="reviews"
          title="Latest reviews"
          description="Feedback from attendees across your events."
          emptyText="No reviews yet."
        >
          {reviews.length === 0 ? (
            <EmptyState message="No reviews yet." actionLabel="Refresh" onAction={onRefresh} />
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="font-semibold text-white">{r.user.fullName}</span>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white">
                      {r.rating}/5
                    </Badge>
                  </div>
                  {r.event?.title && (
                    <p className="text-xs text-slate-400">Event: {r.event.title}</p>
                  )}
                  <p className="text-sm text-slate-100">{r.comment || 'No comment left.'}</p>
                  <p className="text-xs text-slate-500">
                    {format(new Date(r.createdAt), 'PP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
      <div className="text-right">
        <Button variant="ghost" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
};

const AdminDashboard = ({
  stats,
  users,
  events,
}: {
  stats: any;
  users: any[];
  events: Event[];
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatBox label="Users" value={stats?.totalUsers || 0} tone="cyan" />
      <StatBox label="Events" value={stats?.totalEvents || 0} tone="indigo" />
      <StatBox label="Payments" value={stats?.completedPayments || 0} tone="emerald" />
      <StatBox label="Revenue" value={formatCurrency(stats?.revenue || 0)} tone="amber" />
    </div>

    <Section
      title="Recent users"
      description="Latest signups and their roles."
      emptyText="No users"
      id="admin-users"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.slice(0, 6).map((u) => (
          <div key={u.id} className="glass-panel rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{u.fullName}</p>
                <p className="text-xs text-slate-300">{u.email}</p>
              </div>
              <Badge variant="outline">{u.role}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section
      title="Recent events"
      description="Latest activity across the platform."
      emptyText="No events"
      id="admin-events"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.slice(0, 6).map((e) => (
          <EventCard key={e.id} event={e} manage />
        ))}
      </div>
    </Section>
  </div>
);

const EventCard = ({ event, manage = false }: { event: Event; manage?: boolean }) => (
  <div className="glass-panel rounded-xl border border-white/10 p-4 space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-white">{event.title}</p>
        <p className="text-xs text-slate-300">
          {format(new Date(event.date), 'PP')} at {event.time}
        </p>
      </div>
      <Badge variant="outline">{event.status}</Badge>
    </div>
    <p className="text-sm text-slate-200 line-clamp-2">{event.description}</p>
    {manage && (
      <div className="flex gap-2 pt-2">
        <Link href={`/events/${event.id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
        <Link href={`/events/edit/${event.id}`}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>
    )}
  </div>
);

const StatBox = ({
  label,
  value,
  tone = 'indigo',
}: {
  label: string;
  value: number | string;
  tone?: 'indigo' | 'emerald' | 'amber' | 'cyan';
}) => {
  const toneClasses: Record<'indigo' | 'emerald' | 'amber' | 'cyan', string> = {
    indigo: 'from-indigo-500/20 via-indigo-400/10 to-cyan-400/20',
    emerald: 'from-emerald-500/20 via-emerald-400/10 to-cyan-300/20',
    amber: 'from-amber-500/25 via-amber-300/10 to-orange-300/10',
    cyan: 'from-cyan-500/20 via-cyan-400/10 to-sky-300/20',
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-indigo-500/10">
      <div className={`rounded-xl bg-gradient-to-br ${toneClasses[tone]} p-3 mb-3`} />
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

const Section = ({
  title,
  description,
  children,
  emptyText,
  id,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  emptyText?: string;
}) => (
  <div className="space-y-3" id={id}>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-slate-300">{description}</p>}
      </div>
    </div>
    <div className="space-y-2">{children ?? <p className="text-slate-400">{emptyText}</p>}</div>
  </div>
);

const EmptyState = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <div className="glass-panel rounded-xl border border-dashed border-white/20 p-6 text-center text-slate-200">
    <p className="mb-3 font-semibold">{message}</p>
    <Button variant="outline" onClick={onAction}>
      {actionLabel}
    </Button>
  </div>
);

const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(4)].map((_, idx) => (
      <div key={idx} className="glass-panel h-24 rounded-2xl animate-pulse bg-white/5" />
    ))}
  </div>
);
