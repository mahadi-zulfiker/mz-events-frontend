'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Review } from '@/types';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
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
      loadReviews();
    }
  }, [user, authLoading, meta.page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/admin/reviews', {
        params: { page: meta.page, limit: meta.limit },
      });
      setReviews(data.data);
      if (data.meta) setMeta(data.meta);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await axios.delete(`/admin/reviews/${id}`);
      toast.success('Review deleted');
      loadReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 1)));

  return (
    <DashboardShell
      title="Admin - Reviews"
      subtitle="Moderate community feedback without friction."
      actions={
        <Button variant="outline" onClick={loadReviews}>
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
            {reviews.map((r) => (
              <div key={r.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar src={r.user.profileImage} fallback={r.user.fullName} />
                  <div>
                    <p className="font-semibold text-white">{r.user.fullName}</p>
                    <p className="text-xs text-slate-300">{r.event?.title}</p>
                    <p className="text-sm text-slate-200">{r.comment}</p>
                  </div>
                </div>
                <div className="text-sm text-amber-300 font-semibold">{r.rating}/5</div>
                <div className="text-xs text-slate-300">{format(new Date(r.createdAt), 'PP')}</div>
                <Button variant="destructive" onClick={() => deleteReview(r.id)}>
                  Delete
                </Button>
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
