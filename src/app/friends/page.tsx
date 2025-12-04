'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Event } from '@/types';

interface FriendUser {
  id: string;
  fullName: string;
  profileImage?: string | null;
  location?: string | null;
}

export default function FriendsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [followers, setFollowers] = useState<FriendUser[]>([]);
  const [following, setFollowing] = useState<FriendUser[]>([]);
  const [suggestions, setSuggestions] = useState<FriendUser[]>([]);
  const [activities, setActivities] = useState<Event[]>([]);
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
      const [listRes, activityRes] = await Promise.all([
        axios.get('/friends/list'),
        axios.get('/friends/activities'),
      ]);
      setFollowers(listRes.data.data.followers || []);
      setFollowing(listRes.data.data.following || []);
      setSuggestions(listRes.data.data.suggestions || []);
      setActivities(activityRes.data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const follow = async (id: string) => {
    try {
      await axios.post(`/friends/follow/${id}`);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to follow');
    }
  };

  const unfollow = async (id: string) => {
    try {
      await axios.delete(`/friends/unfollow/${id}`);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unfollow');
    }
  };

  return (
    <DashboardShell
      title="Friends & follows"
      subtitle="Follow people and see what they are attending."
      actions={<Button variant="outline" onClick={loadData}>Refresh</Button>}
    >
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <FriendList title="Following" users={following} actionLabel="Unfollow" onAction={unfollow} />
        <FriendList title="Followers" users={followers} actionLabel="Follow back" onAction={follow} />
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-white">Suggestions</p>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-slate-300 text-sm">No suggestions right now.</p>
          ) : (
            <div className="space-y-3">
              {suggestions.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
                <Link href={`/profile/${u.id}`} className="flex items-center gap-3 flex-1">
                  <Avatar src={u.profileImage} fallback={u.fullName} />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{u.fullName}</p>
                    <p className="text-xs text-slate-300">{u.location || 'Anywhere'}</p>
                  </div>
                </Link>
                <Button className="px-3 py-1 text-sm" onClick={() => follow(u.id)}>Follow</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-white">Friend activity</p>
          <Badge variant="outline" className="bg-white/5 border-white/10 text-white">{activities.length} upcoming</Badge>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-slate-300 text-sm">No upcoming activity yet.</p>
        ) : (
          <div className="space-y-2">
            {activities.map((ev) => (
              <Link key={ev.id} href={`/events/${ev.id}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                  {ev.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{ev.title}</p>
                  <p className="text-xs text-slate-300">{ev.location} • {new Date(ev.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline">{ev.category}</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

const FriendList = ({
  title,
  users,
  actionLabel,
  onAction,
}: {
  title: string;
  users: FriendUser[];
  actionLabel: string;
  onAction: (id: string) => void;
}) => (
  <div className="glass-panel rounded-2xl border border-white/10 p-4">
    <div className="flex items-center justify-between mb-3">
      <p className="font-semibold text-white">{title}</p>
      <Badge variant="outline" className="bg-white/5 border-white/10 text-white">{users.length}</Badge>
    </div>
    {users.length === 0 ? (
      <p className="text-slate-300 text-sm">Empty for now.</p>
    ) : (
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
            <Link href={`/profile/${u.id}`} className="flex items-center gap-3 flex-1">
              <Avatar src={u.profileImage} fallback={u.fullName} />
              <div className="flex-1">
                <p className="font-semibold text-white">{u.fullName}</p>
                <p className="text-xs text-slate-300">{u.location || 'Anywhere'}</p>
              </div>
            </Link>
            <Button className="px-3 py-1 text-sm" variant="outline" onClick={() => onAction(u.id)}>
              {actionLabel}
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);
