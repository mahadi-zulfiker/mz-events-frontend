'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';
import { Faq } from '@/types';
import { FiHelpCircle, FiPlusCircle, FiSearch } from 'react-icons/fi';
import { cn } from '@/lib/utils';

const fallbackFaqs: Faq[] = [
  {
    id: '1',
    question: 'How do I become a host?',
    answer:
      'Register with the Host role or upgrade from your profile, then publish your first event from the dashboard.',
    category: 'Hosting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'How are payments processed?',
    answer: 'We use Stripe in test mode. After a successful card confirmation, your spot is reserved instantly.',
    category: 'Payments',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'Can I change my RSVP?',
    answer: 'Yes. Open the event page and use the leave button. Fees may be non-refundable depending on the host.',
    category: 'Events',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/faqs', {
          params: category ? { category } : {},
        });
        setFaqs(data.data || []);
      } catch {
        setFaqs(fallbackFaqs);
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, [category]);

  const filteredFaqs = useMemo(() => {
    const source = faqs.length ? faqs : fallbackFaqs;
    return source.filter(
      (faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (faqs.length ? faqs : fallbackFaqs).forEach((faq) => {
      if (faq.category) set.add(faq.category);
    });
    return Array.from(set);
  }, [faqs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.25),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.2),transparent_35%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
            <FiHelpCircle /> Help center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-200 max-w-3xl">
            Answers for hosts, attendees, and admins. Everything here is powered by live data from the platform.
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder:text-slate-400 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-semibold transition',
                  category === '' ? 'bg-white/20 border-white/30 text-white' : 'border-white/10 text-slate-200 hover:border-white/30'
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs font-semibold transition',
                    category === cat
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'border-white/10 text-slate-200 hover:border-white/30'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl border border-white/10 p-5">
            <p className="text-sm text-slate-300">Still stuck?</p>
            <p className="text-white font-semibold">Reach support</p>
            <p className="text-xs text-slate-400 mt-2">
              We respond within one business day. Include your event ID for faster help.
            </p>
            <a
              href="mailto:support@eventhub.dev"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:translate-y-[-1px]"
            >
              <FiPlusCircle /> Email support
            </a>
          </div>
          <div className="md:col-span-2 glass-panel rounded-2xl border border-white/10 p-5">
            <p className="text-sm font-semibold text-white mb-3">Helpful tips</p>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-2">
              <li>Hosts manage their events and see participants in the dashboard.</li>
              <li>Paid events require a completed card payment before you join.</li>
              <li>Only attendees of completed events can leave reviews for the host.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Answers</h2>
            <span className="text-sm text-slate-300">{filteredFaqs.length} FAQs</span>
          </div>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="h-14 rounded-lg bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="p-6 text-slate-200">No FAQs match your search.</div>
            ) : (
              filteredFaqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const FaqItem = ({ faq }: { faq: Faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((p) => !p)}
      className="w-full text-left p-5 transition hover:bg-white/5"
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold text-white">{faq.question}</p>
          {faq.category && <span className="text-xs text-indigo-200">{faq.category}</span>}
          {open && <p className="text-sm text-slate-200">{faq.answer}</p>}
        </div>
        <span className="text-indigo-200 text-xl">{open ? '-' : '+'}</span>
      </div>
    </button>
  );
};
