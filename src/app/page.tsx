'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Flame,
  Globe2,
  HeartHandshake,
  MapPin,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  UserPlus,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import FeaturedEventsSlider from '@/components/events/FeaturedEventsSlider';
import Testimonials from '@/components/Testimonials';

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

const heroSlides = [
  {
    tag: 'Nightlife | Rooftops',
    title: 'Skyline sessions with live DJs',
    description:
      'Sip under the stars with curated music lovers and hosts that keep things intimate.',
    image:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=2000&q=80',
    meta: 'Tonight | 40 spots',
    location: 'Barcelona, ES',
    priceLabel: 'From $22',
  },
  {
    tag: 'Outdoors | Sunrise',
    title: 'Trail breakfast + new hiking friends',
    description:
      'Catch first light with guides who know the routes and fellow early risers.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
    meta: 'Saturday | 18 guests',
    location: 'Denver, US',
    priceLabel: 'Free to join',
  },
  {
    tag: 'Food | Supper club',
    title: 'Secret supper clubs across the city',
    description:
      'Farm-to-table menus, playlists, and people who love long dinners.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    meta: 'Weekly drops | Seats go fast',
    location: 'Global',
    priceLabel: 'From $18',
  },
];

const heroHighlights = [
  { label: 'Verified hosts', icon: BadgeCheck },
  { label: 'Protected by Stripe', icon: ShieldCheck },
  { label: 'Go solo or bring friends', icon: Users },
  { label: 'Happening worldwide', icon: Globe2 },
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [eventsSliderIndex, setEventsSliderIndex] = useState(0);
  const [eventsPaused, setEventsPaused] = useState(false);
  const eventsSliderRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const timer = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % heroSlides.length),
      6500
    );
    return () => clearInterval(timer);
  }, []);

  const displayedEvents = useMemo(
    () => (featuredEvents.length ? featuredEvents : fallbackEvents),
    [featuredEvents]
  );
  const loopedEvents = useMemo(
    () =>
      displayedEvents.length
        ? [...displayedEvents, ...displayedEvents, ...displayedEvents]
        : [],
    [displayedEvents]
  );

  useEffect(() => {
    const slider = eventsSliderRef.current;
    if (!slider || !displayedEvents.length) return;
    const handleScroll = () => {
      const slideWidth = getEventSlideWidth();
      const total = displayedEvents.length;
      if (!total) return;
      let rawIndex = Math.round(slider.scrollLeft / slideWidth);
      if (rawIndex < total) {
        slider.scrollLeft += slideWidth * total;
        rawIndex += total;
      } else if (rawIndex >= total * 2) {
        slider.scrollLeft -= slideWidth * total;
        rawIndex -= total;
      }
      const baseIndex = rawIndex % total;
      setEventsSliderIndex(baseIndex);
    };
    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [displayedEvents.length]);

  useEffect(() => {
    const slider = eventsSliderRef.current;
    if (!slider || !displayedEvents.length) return;
    const startPosition = getEventSlideWidth() * displayedEvents.length;
    slider.scrollLeft = startPosition;
    setEventsSliderIndex(0);
  }, [displayedEvents.length]);

  useEffect(() => {
    if (eventsPaused || loadingEvents || !displayedEvents.length) return;
    const slider = eventsSliderRef.current;
    if (!slider) return;
    const amount = getEventSlideWidth();
    const id = setInterval(() => {
      const nextIdx = (eventsSliderIndex + 1) % displayedEvents.length;
      slider.scrollTo({ left: nextIdx * amount, behavior: 'smooth' });
      setEventsSliderIndex(nextIdx);
    }, 4500);
    return () => clearInterval(id);
  }, [eventsPaused, eventsSliderIndex, displayedEvents.length, loadingEvents]);

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

  const handlePrevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const handleNextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  const activeHero = heroSlides[activeSlide];
  const totalEventsSlides = displayedEvents.length;

  const getEventSlideWidth = () => {
    const slider = eventsSliderRef.current;
    if (!slider) return 1;
    return slider.clientWidth * 0.9 || 1;
  };

  const handleEventSlide = (direction: 'next' | 'prev') => {
    const slider = eventsSliderRef.current;
    if (!slider) return;
    const amount = getEventSlideWidth();
    const nextLeft =
      direction === 'next'
        ? slider.scrollLeft + amount
        : slider.scrollLeft - amount;
    slider.scrollTo({ left: nextLeft, behavior: 'smooth' });
    const approxIdx = Math.round(nextLeft / amount);
    setEventsSliderIndex(Math.min(Math.max(approxIdx, 0), totalEventsSlides - 1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <section className="relative overflow-hidden">
        <motion.div
          key={activeHero.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${activeHero.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-slate-900/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.2),transparent_35%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap text-indigo-100">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                  <Sparkles size={16} /> Curated IRL & online
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs">
                  <Flame size={14} className="text-amber-300" />
                  {activeHero.meta}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Meet people through{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-pink-300 bg-clip-text text-transparent">
                  unforgettable plans
                </span>
                .
              </h1>

              <p className="text-lg text-slate-200 md:text-xl max-w-2xl">
                {activeHero.description}{' '}
                Discover new cities, supper clubs, hikes, and nights out with trusted hosts.
              </p>

              <div className="flex items-center gap-3 text-sm text-indigo-50">
                <Ticket size={16} className="text-indigo-200" />
                <span className="font-semibold">{activeHero.title}</span>
                <span className="hidden sm:inline-flex items-center gap-2 pl-3 border-l border-white/10">
                  <MapPin size={14} className="text-indigo-200" />
                  {activeHero.location}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-1 hover:bg-indigo-400"
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

              <div className="flex flex-wrap gap-2">
                {heroHighlights.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-indigo-50"
                  >
                    <item.icon size={14} className="text-indigo-200" />
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-lg shadow-indigo-900/20"
                  >
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-xs text-slate-200">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -translate-x-6 -translate-y-6 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-pink-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
                <motion.div
                  key={activeHero.title}
                  initial={{ opacity: 0.35, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="h-[420px] sm:h-[480px] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeHero.image})` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-black/65 via-black/35 to-transparent" />
                </motion.div>
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between text-xs text-indigo-50">
                    <span className="rounded-full bg-black/50 px-3 py-1 border border-white/10">
                      {activeHero.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-white">
                      <Ticket size={14} /> {activeHero.priceLabel}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white drop-shadow">
                      {activeHero.title}
                    </h3>
                    <p className="text-sm text-indigo-50/90 max-w-xl">
                      {activeHero.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-indigo-50">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} className="text-indigo-200" />
                      {activeHero.meta}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} className="text-indigo-200" />
                      {activeHero.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.title}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-10 w-10 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-indigo-400/80 ${idx === activeSlide
                        ? 'border-indigo-300 bg-white/20 ring-2 ring-indigo-400/60'
                        : 'border-white/10 bg-white/10 hover:border-white/40'
                        }`}
                      style={{
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      aria-label={`Show slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-white/40 hover:bg-white/20 transition"
                    aria-label="Previous slide"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-white/40 hover:bg-white/20 transition"
                    aria-label="Next slide"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-14 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_30%,rgba(168,85,247,0.12),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                How it works
              </p>
              <h2 className="text-3xl font-bold text-white">Plan less. Show up more.</h2>
              <p className="text-slate-300 max-w-2xl">
                Build your profile, join experiences, and feel confident every step with verified hosts and secure payments.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start gap-3 shadow-lg shadow-indigo-900/30 max-w-md">
              <div className="rounded-full bg-indigo-500/20 p-2 text-indigo-200">
                <HeartHandshake size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-indigo-50 font-semibold">Community-first guarantees</p>
                <p className="text-xs text-slate-200">
                  Host verification, real reviews, and instant refunds when events are cancelled.
                </p>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {howSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-lg shadow-indigo-900/20 transition hover:-translate-y-1 hover:border-indigo-400/50"
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
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 shadow-xl shadow-indigo-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-300 text-xs uppercase tracking-wide">Built-in trust</p>
                  <h3 className="text-xl font-semibold text-white">Every RSVP protected</h3>
                </div>
                <ShieldCheck size={24} className="text-indigo-200" />
              </div>
              <p className="text-sm text-slate-200">
                Instant confirmations, clear refunds, and secure payments mean you can focus on showing up, not logistics.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-xs text-indigo-50 flex items-center gap-2"
                  >
                    <item.icon size={14} className="text-indigo-200" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedEventsSlider
        events={displayedEvents}
        renderCard={(event) => <EventCard event={event} />}
      />

      <section className="relative py-20 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_40%,rgba(94,234,212,0.08),transparent_32%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_30%,rgba(129,140,248,0.12),transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-2">
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                Trusted hosts
              </p>
              <h2 className="text-3xl font-bold text-white">Top-rated organizers</h2>
              <p className="text-slate-300 max-w-2xl">
                Curated from live events and reviews. Explore their public profiles before you join.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-100 hover:border-white/30 hover:bg-white/10 transition"
            >
              Browse events <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topHosts.map((host, idx) => (
              <Link
                key={host.id || host.name}
                href={host.id ? `/profile/${host.id}` : '/register?role=HOST'}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black/80 p-5 flex flex-col gap-4 shadow-xl shadow-indigo-900/30 transition hover:-translate-y-1 hover:border-indigo-400/50"
              >
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/20 via-cyan-500/15 to-pink-500/20 blur-3xl" />
                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className="h-12 w-12 rounded-full bg-cover bg-center border border-white/20"
                    style={{
                      backgroundImage: `url(${host.avatar ||
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
                        })`,
                    }}
                  />
                  <div>
                    <p className="text-lg font-semibold text-white flex items-center gap-2">
                      {host.name}
                      <BadgeCheck size={16} className="text-indigo-300" />
                    </p>
                    <p className="text-xs text-slate-300">{host.location || 'Worldwide'}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-200 relative z-10">
                  {host.tagline || 'Community-first host'}
                </p>
                <div className="flex items-center justify-between text-sm text-indigo-200 relative z-10">
                  <span className="inline-flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {host.rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition">
                    View profile <ArrowRight size={14} />
                  </span>
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
                  <div className="absolute inset-0 border border-white/5 rounded-2xl" />
                  <div className={`absolute -right-12 -top-6 h-24 w-24 rounded-full ${idx === 0 ? 'bg-indigo-500/15' : idx === 1 ? 'bg-sky-400/15' : 'bg-pink-500/15'} blur-2xl`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-slate-950/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.14),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,0.12),transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-2">
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                Browse by category
              </p>
              <h2 className="text-3xl font-bold text-white">
                Find your next obsession
              </h2>
              <p className="text-sm text-slate-300">
                Tap a tile to filter events instantly. Curated by vibe, pace, and community.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-100 hover:border-white/30 hover:bg-white/10 transition"
            >
              View calendar <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={cat.value}
                href={`/events?category=${cat.value}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4 flex items-center gap-3 text-white transition hover:-translate-y-1 hover:border-indigo-400/50"
              >
                <div className="absolute inset-0 opacity-70">
                  <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${idx % 3 === 0 ? 'bg-indigo-500/20' : idx % 3 === 1 ? 'bg-cyan-400/20' : 'bg-pink-500/20'} blur-2xl`} />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/5 to-transparent" />
                </div>
                <div className="rounded-full bg-indigo-500/10 p-2 text-indigo-300 group-hover:bg-indigo-500/20 relative z-10">
                  <cat.icon size={18} />
                </div>
                <div className="flex-1 relative z-10">
                  <p className="font-semibold">{cat.label}</p>
                  <p className="text-xs text-slate-300">Tap to filter</p>
                </div>
                <ArrowRight size={14} className="text-indigo-300 relative z-10" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="relative py-20 sm:py-20 overflow-hidden">
        {/* Background Image + Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
            alt="People enjoying an event"
            className="w-full h-full object-cover object-center scale-[1.03] sm:scale-100"
          />

          {/* Color overlay to match indigo + pink CTA */}
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
            {/* Primary CTA - matches your simple CTA styles */}
            <Link
              href="/events"
              className="relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-lg hover:-translate-y-1 transition"
            >
              Explore events <ArrowRight size={18} />
              {/* Button glow */}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-white/40 blur-xl opacity-20" />
            </Link>

            {/* Secondary CTA - same as earlier section */}
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
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black shadow-xl shadow-indigo-900/30 transition hover:-translate-y-1 hover:border-indigo-400/60">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs text-indigo-100 border border-white/10">
          <Clock3 size={12} />
          Live now
        </div>
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
          <span className="inline-flex items-center gap-1 text-slate-200">
            <Sparkles size={14} />
            Curated pick
          </span>
          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition">
            View details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};
