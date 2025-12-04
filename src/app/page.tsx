'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  MapPin,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';

const howSteps = [
  {
    title: 'Create your vibe',
    description: 'Build a profile that highlights your interests and goals.',
    icon: UserPlus,
  },
  {
    title: 'Discover experiences',
    description: 'Search and filter events curated for your city and hobbies.',
    icon: Search,
  },
  {
    title: 'Reserve your spot',
    description: 'Join instantly or pay securely with Stripe test mode.',
    icon: CalendarDays,
  },
  {
    title: 'Meet your people',
    description: 'Connect with attendees, hosts, and leave trusted reviews.',
    icon: PartyPopper,
  },
];

const categories = [
  { value: 'CONCERT', label: 'Concert', icon: Sparkles },
  { value: 'SPORTS', label: 'Sports', icon: Users },
  { value: 'GAMING', label: 'Gaming', icon: ShieldCheck },
  { value: 'FOOD', label: 'Food', icon: Star },
  { value: 'TECH', label: 'Tech', icon: Search },
  { value: 'ART', label: 'Art', icon: BadgeCheck },
  { value: 'TRAVEL', label: 'Travel', icon: MapPin },
  { value: 'OTHER', label: 'Other', icon: Clock3 },
];

const stats = [
  { value: '500+', label: 'Events live now' },
  { value: '2K+', label: 'Active members' },
  { value: '50+', label: 'Cities covered' },
  { value: '4.8/5', label: 'Average host rating' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Music Enthusiast',
    text: 'Found my concert crew and never miss a show now.',
  },
  {
    name: 'Mike Chen',
    role: 'Adventure Seeker',
    text: 'Weekend hikes and new friends every month. Perfect.',
  },
  {
    name: 'Emma Davis',
    role: 'Tech Professional',
    text: 'Met co-founders at a meetup I discovered here.',
  },
];

const fallbackEvents: Partial<Event>[] = [
  {
    id: '1',
    title: 'Sunset Rooftop Concert',
    category: 'CONCERT',
    location: 'Barcelona',
    date: new Date().toISOString(),
    time: '18:30',
    joiningFee: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '2',
    title: 'Trail Hiking Escape',
    category: 'TRAVEL',
    location: 'Denver',
    date: new Date().toISOString(),
    time: '08:00',
    joiningFee: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '3',
    title: 'City Street Food Crawl',
    category: 'FOOD',
    location: 'Bangkok',
    date: new Date().toISOString(),
    time: '19:00',
    joiningFee: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
  },
];

type TopHost = {
  id?: string;
  name: string;
  rating: number;
  location?: string | null;
  avatar?: string | null;
  tagline?: string;
};

const fallbackHosts: TopHost[] = [
  {
    id: 'host-fallback-1',
    name: 'Host One',
    rating: 4.9,
    location: 'Barcelona',
    tagline: 'Curating intimate rooftop sessions.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'host-fallback-2',
    name: 'Host Two',
    rating: 4.8,
    location: 'Denver',
    tagline: 'Weekend adventures and fresh air.',
    avatar:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'host-fallback-3',
    name: 'Host Three',
    rating: 4.7,
    location: 'Bangkok',
    tagline: 'Food crawls that feel like home.',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
  },
];

export default function Home() {
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const { data } = await axios.get('/events?limit=8&status=OPEN');
        setFeaturedEvents(data.data || []);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to load featured events'
        );
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  const displayedEvents = useMemo(
    () => (featuredEvents.length ? featuredEvents : fallbackEvents),
    [featuredEvents]
  );

  const topHosts = useMemo<TopHost[]>(() => {
    const map = new Map<string, TopHost>();

    featuredEvents.forEach((ev) => {
      if (!ev.host) return;
      if (map.has(ev.host.id)) return;
      map.set(ev.host.id, {
        id: ev.host.id,
        name: ev.host.fullName,
        rating: ev.host.averageRating || 4.5,
        location: ev.host.location,
        avatar: ev.host.profileImage,
      });
    });

    const values = Array.from(map.values()).sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (values.length === 0) {
      return fallbackHosts;
    }
    return values.slice(0, 3);
  }, [featuredEvents]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.25),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.2),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col gap-12">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">
              <Sparkles size={16} /> Events & Activities Platform
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Connect through{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                shared passions
              </span>{' '}
              and unforgettable experiences.
            </h1>
            <p className="text-lg text-slate-200 md:text-xl">
              Curated events, trusted hosts, and seamless payments. Discover
              something new every week and meet people who love what you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:translate-y-[-2px] hover:bg-indigo-400"
              >
                Explore events <ArrowRight size={18} />
              </Link>
              <Link
                href={user ? '/events/create' : '/register?role=HOST'}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-lg font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Become a host <BadgeCheck size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-indigo-400/50"
              >
                <div className="mb-3 inline-flex rounded-full bg-indigo-500/20 p-2 text-indigo-200">
                  <step.icon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-200">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                Discover
              </p>
              <h2 className="text-3xl font-bold text-white">Featured events</h2>
              <p className="text-slate-300">
                Pulled live from the API with status OPEN (showing {displayedEvents.length}{' '}
                events).
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 text-sm font-semibold"
            >
              View all events <ArrowRight size={16} />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 rounded-2xl bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedEvents.map((event) => (
                <EventCard key={event.id || event.title} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                Trusted hosts
              </p>
              <h2 className="text-3xl font-bold text-white">Top-rated organizers</h2>
              <p className="text-slate-300">
                Curated from live events and reviews. Explore their public profiles before you join.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 text-sm font-semibold"
            >
              Browse events <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topHosts.map((host) => (
              <Link
                key={host.id || host.name}
                href={host.id ? `/profile/${host.id}` : '/register?role=HOST'}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3 transition hover:-translate-y-1 hover:border-indigo-400/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full bg-cover bg-center border border-white/20"
                    style={{
                      backgroundImage: `url(${host.avatar ||
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
                        })`,
                    }}
                  />
                  <div>
                    <p className="text-lg font-semibold text-white">{host.name}</p>
                    <p className="text-xs text-slate-300">{host.location || 'Worldwide'}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-200">{host.tagline || 'Community-first host'}</p>
                <div className="flex items-center justify-between text-sm text-indigo-200">
                  <span className="inline-flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {host.rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition">
                    View profile <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col gap-2">
            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
              Browse by category
            </p>
            <h2 className="text-3xl font-bold text-white">
              Find your next obsession
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/events?category=${cat.value}`}
                className="group rounded-xl border border-white/10 bg-slate-900 p-4 flex items-center gap-3 text-white transition hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-slate-800"
              >
                <div className="rounded-full bg-indigo-500/10 p-2 text-indigo-300 group-hover:bg-indigo-500/20">
                  <cat.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{cat.label}</p>
                  <p className="text-xs text-slate-300">Tap to filter</p>
                </div>
                <ArrowRight size={14} className="text-indigo-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
              Loved by members
            </p>
            <h2 className="text-3xl font-bold text-white">
              Stories from the community
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-lg shadow-indigo-900/30"
              >
                <div className="flex items-center gap-2 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-200 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Background Image + Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
            alt="People enjoying an event"
            className="w-full h-full object-cover object-center scale-[1.03] sm:scale-100"
          />

          {/* Color overlay to match indigo → pink CTA */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/85 via-indigo-700/80 to-pink-600/85" />

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

          {/* Animated light sweep */}
          <motion.div
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "180%", opacity: 0.6 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-white/10 via-white/5 to-transparent blur-2xl"
          />

          {/* Floating particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute w-2 h-2 bg-white/30 rounded-full top-1/4 left-1/3 animate-pulse" />
            <div className="absolute w-1.5 h-1.5 bg-white/20 rounded-full top-2/3 left-1/2 animate-bounce" />
            <div className="absolute w-1 h-1 bg-white/20 rounded-full top-1/2 left-2/3 animate-ping" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl"
          >
            Ready to build your next experience?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-lg md:text-xl text-indigo-50 max-w-2xl mx-auto"
          >
            Browse curated events or start hosting. Secure payments, fast onboarding,
            and trusted reviews built in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Primary CTA – matches your simple CTA styles */}
            <Link
              href="/events"
              className="relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-lg hover:-translate-y-1 transition"
            >
              Explore events <ArrowRight size={18} />
              {/* Button glow */}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-white/40 blur-xl opacity-20" />
            </Link>

            {/* Secondary CTA – same as earlier section */}
            <Link
              href={user ? '/events/create' : '/register?role=HOST'}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-lg font-semibold text-white hover:bg-white/10 transition"
            >
              Launch an event <CalendarDays size={18} />
            </Link>
          </motion.div>
        </div>
      </section>


      <Footer />
    </div>
  );
}

const EventCard = ({ event }: { event: Partial<Event> }) => {
  const participantCount = event._count?.participants ?? 0;
  const fee = Number(event.joiningFee || 0);
  const dateLabel = event.date
    ? format(new Date(event.date), 'EEE, MMM d')
    : 'TBD';
  const timeLabel = event.time ? ` at ${event.time}` : '';
  const image =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80';

  return (
    <Link
      href={event.id ? `/events/${event.id}` : '/events'}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-lg transition hover:-translate-y-1 hover:border-indigo-400/60"
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="rounded-full bg-white/5 px-2 py-1 text-indigo-200">
            {event.category || 'EVENT'}
          </span>
          <span className="font-semibold text-white">
            {fee > 0 ? `$${fee}` : 'Free'}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-1 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-indigo-300" />
            <span>
              {dateLabel}
              {timeLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-indigo-300" />
            <span>{event.location || 'See details'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-indigo-300" />
            <span>
              {participantCount}
              {event.maxParticipants ? `/${event.maxParticipants}` : ''} joined
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 text-sm text-indigo-300">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} /> Live now
          </span>
          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition">
            View details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};
