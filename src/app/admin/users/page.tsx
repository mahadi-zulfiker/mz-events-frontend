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
          <div className="divide-y divide-white/5">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{u.fullName}</p>
                  <p className="text-xs text-slate-300 truncate">{u.email}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <Badge variant="outline" className="shrink-0">{u.role}</Badge>
                  <Select
                    value={u.role}
                    onChange={(e) => updateUser(u.id, e.target.value)}
                    className="w-32 sm:w-36 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    <option value="USER">USER</option>
                    <option value="HOST">HOST</option>
                    <option value="ADMIN">ADMIN</option>
                  </Select>
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
