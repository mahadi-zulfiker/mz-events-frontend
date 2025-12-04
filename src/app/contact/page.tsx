'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiMapPin, FiMessageCircle, FiPhoneCall, FiSend } from 'react-icons/fi';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

const contactChannels = [
  {
    title: 'Product & UX',
    description: 'Feedback on navigation, dashboards, or polish? Tell us where to reduce friction.',
    icon: FiMessageCircle,
    action: 'Product inbox',
  },
  {
    title: 'Support',
    description: 'Account issues, billing, or host verifications. We respond within one business day.',
    icon: FiPhoneCall,
    action: 'Support desk',
  },
  {
    title: 'Partnerships',
    description: 'Bring your community, venue, or brand. We craft co-branded experiences together.',
    icon: FiMail,
    action: 'Partner with us',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      toast.error('Please add a message');
      return;
    }
    try {
      setSending(true);
      await axios.post('/notifications/contact', form);
      toast.success('Message sent to admin');
      setForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-slate-950 text-slate-100">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_30%)]" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Contact</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                We are here to make every event experience smooth, responsive, and human.
              </h1>
              <p className="text-lg text-slate-300 max-w-3xl">
                Share feedback, request support, or start a partnership. We respond quickly and keep you in the loop.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {contactChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
                    <channel.icon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{channel.title}</h3>
                    <p className="text-sm text-slate-300">{channel.description}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white hover:border-white/30">
                    {channel.action} <FiSend className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Drop us a note</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Full name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none"
                    placeholder="Alex Morgan"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">How can we help?</label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none"
                  placeholder="Share details about your request..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:translate-y-[-1px]"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
              <p className="text-sm font-semibold text-white">Office hours</p>
              <p className="text-sm text-slate-300">Mon - Fri, 9:00 AM - 6:00 PM GMT</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Studio</p>
                  <p className="text-sm text-slate-300">Remote-first with hubs in NYC & London.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FiPhoneCall />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Call us</p>
                  <p className="text-sm text-slate-300">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FiMail />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Support inbox</p>
                  <p className="text-sm text-slate-300">support@eventhub.fake</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
