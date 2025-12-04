'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Faq } from '@/types';
import { format } from 'date-fns';
import { confirmToast } from '@/components/ui/confirm-toast';

const emptyForm = { question: '', answer: '', category: '' };

export default function AdminFaqPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    } else {
      loadFaqs();
    }
  }, [authLoading, user]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/faqs');
      setFaqs(data.data || []);
    } catch {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    try {
      if (editingId) {
        await axios.patch(`/faqs/${editingId}`, {
          ...form,
          category: form.category || undefined,
        });
        toast.success('FAQ updated');
      } else {
        await axios.post('/faqs', {
          ...form,
          category: form.category || undefined,
        });
        toast.success('FAQ created');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadFaqs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
    }
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
    });
  };

  const deleteFaq = async (id: string) => {
    try {
      await axios.delete(`/faqs/${id}`);
      toast.success('FAQ deleted');
      loadFaqs();
    } catch {
      toast.error('Failed to delete FAQ');
    }
  };

  const confirmDeleteFaq = (id: string, question: string) =>
    confirmToast({
      title: 'Delete this FAQ?',
      description: question,
      confirmText: 'Delete',
      tone: 'danger',
      onConfirm: () => deleteFaq(id),
    });

  return (
    <DashboardShell
      title="Admin - FAQs"
      subtitle="Manage the help center content shown to all users."
      actions={
        <Button variant="outline" onClick={loadFaqs}>
          Refresh
        </Button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-white">
              {editingId ? 'Edit FAQ' : 'Create FAQ'}
            </p>
            <p className="text-xs text-slate-300">
              Add actionable answers. Updates appear instantly on the public FAQ page.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Question</label>
              <Input
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                placeholder="How do payments work?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Answer</label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                required
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                placeholder="Stripe handles secure payments. Use the test card 4242 4242 4242 4242."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Category (optional)</label>
              <Input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                placeholder="Payments, Hosting, Policies..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit">{editingId ? 'Save changes' : 'Create FAQ'}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-6 text-slate-200">No FAQs yet. Add your first one.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-white">{faq.question}</p>
                    <p className="text-sm text-slate-200 line-clamp-2">{faq.answer}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {faq.category && <span className="rounded-full bg-white/5 px-2 py-1">{faq.category}</span>}
                      <span>{format(new Date(faq.updatedAt), 'PP')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => startEdit(faq)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => confirmDeleteFaq(faq.id, faq.question)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
