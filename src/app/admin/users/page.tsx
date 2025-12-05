'use client';

import { Suspense, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DashboardShell } from '@/components/layout/DashboardShell';

function AdminUsersPageInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number }>({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    const initialRole = searchParams.get('role');
    if (initialRole && ['USER', 'HOST', 'ADMIN'].includes(initialRole)) {
      setRoleFilter(initialRole);
      setMeta((prev) => ({ ...prev, page: 1 }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    } else {
      loadUsers();
    }
  }, [user, authLoading, meta.page, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/admin/users', {
        params: { page: meta.page, limit: meta.limit, role: roleFilter || undefined },
      });
      setUsers(data.data);
      if (data.meta) setMeta(data.meta);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, role: string) => {
    try {
      await axios.patch(`/admin/users/${id}`, { role });
      toast.success('User updated');
      loadUsers();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 1)));

  return (
    <DashboardShell
      title="Admin - Users"
      subtitle="Control access and roles across the platform."
      actions={
        <div className="flex items-center gap-2">
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setMeta((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-36 rounded-lg border border-slate-300 bg-white text-slate-900"
          >
            <option value="">All roles</option>
            <option value="USER">Users</option>
            <option value="HOST">Hosts</option>
            <option value="ADMIN">Admins</option>
          </Select>
          <Button variant="outline" onClick={loadUsers}>
            Refresh
          </Button>
        </div>
      }
    >
      <div className="glass-panel rounded-2xl border border-white/10">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-0 md:divide-y md:divide-white/5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-sm md:grid md:grid-cols-[1.6fr_auto] md:items-center md:gap-4 md:rounded-none md:border-none md:bg-transparent md:shadow-none"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate text-base">{u.fullName}</p>
                      <p className="text-sm text-slate-300 truncate">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="md:hidden shrink-0 text-[10px] px-2">
                      {u.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-none">
                  <Badge variant="outline" className="hidden md:inline-flex shrink-0 text-xs px-2.5">
                    {u.role}
                  </Badge>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="md:hidden text-xs text-slate-400">Role:</span>
                    <Select
                      value={u.role}
                      onChange={(e) => updateUser(u.id, e.target.value)}
                      className="flex-1 sm:flex-none sm:w-48 md:w-40 h-9 md:h-10 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                    >
                      <option value="USER">USER</option>
                      <option value="HOST">HOST</option>
                      <option value="ADMIN">ADMIN</option>
                    </Select>
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
          onClick={() => setMeta((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))}
        >
          Next
        </Button>
      </div>
    </DashboardShell>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-200">Loading...</div>}>
      <AdminUsersPageInner />
    </Suspense>
  );
}
