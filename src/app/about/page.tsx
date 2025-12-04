'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FiCheckCircle, FiGlobe, FiMapPin, FiShield, FiUsers } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const pillars = [
  {
    title: 'Human-first design',
    description: 'Micro-interactions, thoughtful spacing, and accessibility that make every action feel effortless.',
    icon: HiSparkles,
  },
  {
    title: 'Trust at the core',
    description: 'Verified hosts, transparent reviews, and clear payment states keep every attendee confident.',
    icon: FiShield,
  },
  {
    title: 'Local + global',
    description: 'Location-aware discovery surfaces what is near you, while keeping remote events one tap away.',
    icon: FiMapPin,
  },
  {
    title: 'Communities, not crowds',
    description: 'Tools for following friends, hosts, and interests so your feed always feels personal.',
    icon: FiUsers,
  },
];

const milestones = [
  { label: 'Ideation', detail: 'Shaping a streamlined event-to-attendee journey with zero dead-ends.' },
  { label: 'Navigation overhaul', detail: 'Role-based sidebar, minimal public navbar, and mobile-first drawer.' },
  { label: 'Experience polish', detail: 'Animations, skeletons, and tactile cards that celebrate every tap.' },
  { label: 'Next up', detail: 'Deeper analytics, richer maps, and collaborative planning for groups.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-slate-950 text-slate-100">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.12),transparent_30%)]" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  About EventHub
                </p>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  We are crafting a joyful, modern way to gather — whether you are hosting or just showing up.
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed">
                  EventHub is built for curious attendees, thoughtful hosts, and admins who keep everything humming.
                  Every navigation touchpoint is intentional: minimal on the surface, powerful when you need it.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:translate-y-[-1px]"
                  >
                    Browse experiences
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/30"
                  >
                    Talk with our team
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[
                  { value: '500+', label: 'Events live' },
                  { value: '2K+', label: 'Active members' },
                  { value: '50+', label: 'Cities covered' },
                  { value: '4.8/5', label: 'Avg. host rating' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">What we stand for</p>
            <h2 className="text-2xl font-bold text-white">Design pillars</h2>
            <p className="text-slate-300 max-w-3xl">
              Everything from the fixed navbar to the role-aware sidebar is shaped to reduce friction and make discovery feel premium.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 shadow-xl shadow-black/30"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                    <pillar.icon className="text-xl" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                    <p className="text-sm text-slate-300">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Navigation journey</p>
              <h2 className="text-2xl font-bold text-white">How we evolved the experience</h2>
              <p className="text-slate-300 max-w-3xl">
                We separated public exploration from authenticated workflows, introduced a dedicated dashboard sidebar, and made the mobile drawer feel like a native sheet.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {milestones.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start gap-3"
                >
                  <FiCheckCircle className="mt-1 text-emerald-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-sm text-slate-300">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Built to be fearless on mobile</h3>
              <p className="text-slate-300">
                The hamburger morphs into a close icon, the drawer slides in from the left with a dimmed backdrop, and every tap target is sized for touch.
                You can swipe, tap outside to close, and move through the dashboard without ever losing context.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:border-white/30"
                >
                  Try the dashboard
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Explore events
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Snapshot</p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
                  <FiGlobe />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Global-ready</p>
                  <p className="text-sm text-slate-300">Optimized for 320px → 4K, with touch-friendly padding and WCAG-aware contrast.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Location-smart</p>
                  <p className="text-sm text-slate-300">Map view, calendar sync, and saved routes keep you oriented at a glance.</p>
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
