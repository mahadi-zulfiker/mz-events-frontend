'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
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
  Zap,
  Shield,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  PlusCircle,
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
  { value: 'CONCERT', label: 'Concert', icon: PartyPopper, count: '124 events', color: 'from-pink-500 to-rose-500', image: 'https://images.unsplash.com/photo-1459749411177-042180ce6739?auto=format&fit=crop&w=800&q=80' },
  { value: 'SPORTS', label: 'Sports', icon: Flame, count: '86 events', color: 'from-orange-500 to-red-500', image: 'https://images.unsplash.com/photo-1461896704690-464a0196a588?auto=format&fit=crop&w=800&q=80' },
  { value: 'GAMING', label: 'Gaming', icon: ShieldCheck, count: '45 events', color: 'from-cyan-500 to-blue-500', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
  { value: 'FOOD', label: 'Food', icon: Star, count: '112 events', color: 'from-yellow-400 to-orange-500', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
  { value: 'TECH', label: 'Tech', icon: Zap, count: '98 events', color: 'from-indigo-500 to-purple-500', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { value: 'ART', label: 'Art', icon: Sparkles, count: '56 events', color: 'from-emerald-400 to-teal-500', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' },
  { value: 'TRAVEL', label: 'Travel', icon: Globe2, count: '73 events', color: 'from-sky-400 to-blue-600', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80' },
  { value: 'OTHER', label: 'Other', icon: Clock3, count: '32 events', color: 'from-slate-500 to-slate-700', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80' },
];

const stats = [
  { value: '1,200+', label: 'Events Hosted', tone: 'indigo' },
  { value: '15k+', label: 'Active Members', tone: 'emerald' },
  { value: '45+', label: 'Cities Covered', tone: 'amber' },
  { value: '4.9/5', label: 'Avg User Rating', tone: 'cyan' },
];

const features = [
  {
    icon: Shield,
    title: "Secure Verification",
    description: "Multi-step verification for all hosts and event organizers to ensure community safety."
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Seamless reservation system with real-time availability and instant confirmations."
  },
  {
    icon: MessageCircle,
    title: "Smart Networking",
    description: "Connect with like-minded attendees through our intelligent interest-matching algorithm."
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description: "Discover exclusive experiences in major cities across the globe, from London to Tokyo."
  }
];

const faqs = [
  {
    question: "How do I join an event?",
    answer: "Simply browse our events catalog, select an event that interests you, and click on the 'Reserve Spot' or 'Join' button. Some events may require a small fee processed securely via Stripe."
  },
  {
    question: "Can I host my own event?",
    answer: "Absolutely! Create a Host account, complete your profile verification, and you can start listing your events in minutes using our intuitive event builder."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use Stripe for all financial transactions. We never store your credit card details on our servers, ensuring the highest level of payment security."
  },
  {
    question: "What happens if an event is cancelled?",
    answer: "In the rare case of a cancellation, you will receive an automatic notification and a full refund if the event was paid, processed within 5-10 business days."
  }
];

const partners = [
  { name: "Google", icon: Globe2 },
  { name: "Apple", icon: Shield },
  { name: "Nike", icon: Zap },
  { name: "Amazon", icon: Globe2 },
  { name: "Tesla", icon: Zap },
  { name: "CocaCola", icon: HeartHandshake }
];

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Hidden Gem Experiences in Barcelona",
    date: "Dec 28, 2025",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
    link: "/blog/1"
  },
  {
    id: 2,
    title: "How to Build a Thriving Local Community",
    date: "Dec 25, 2025",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    link: "/blog/2"
  },
  {
    id: 3,
    title: "Designing for IRL Connections in a Digital World",
    date: "Dec 20, 2025",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    link: "/blog/3"
  }
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
    name: 'Sarah Chen',
    rating: 4.9,
    location: 'Barcelona',
    tagline: 'Curating intimate rooftop sessions.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'host-fallback-2',
    name: 'Marcus Thorne',
    rating: 4.8,
    location: 'Denver',
    tagline: 'Weekend adventures and fresh air.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'host-fallback-3',
    name: 'Lila Okafor',
    rating: 4.7,
    location: 'London',
    tagline: 'Secret supper clubs and long dinners.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
];

export default function Home() {
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      8000
    );
    return () => clearInterval(timer);
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

  const activeHero = heroSlides[activeSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${activeHero.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20 z-[1]" />

        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse z-[1]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] mix-blend-screen animate-bounce z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-indigo-100"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} className="text-yellow-400" /> Curated Experiences
              </span>
              <span className="h-1 w-8 bg-indigo-500 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                {activeHero.tag}
              </span>
            </motion.div>

            <motion.h1
              key={`title-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black leading-[1.1] tracking-tight"
            >
              Meet people through <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-pink-400">
                unforgettable plans
              </span>.
            </motion.h1>

            <motion.p
              key={`desc-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 md:text-xl max-w-2xl font-medium leading-relaxed"
            >
              {activeHero.description} Discover new cities, supper clubs, hikes, and nights out with trusted hosts across the globe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link
                href="/events"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:bg-indigo-400 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Explore Events <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={user ? '/events/create' : '/register?role=HOST'}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
              >
                Become a Host <PlusCircle size={20} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-10 flex flex-wrap gap-6 border-t border-white/5"
            >
              {heroHighlights.map((item, idx) => (
                <div key={item.label} className="flex items-center gap-3 text-slate-400 group cursor-default">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-colors">
                    <item.icon size={16} className="text-indigo-400" />
                  </div>
                  <span className="text-sm font-semibold group-hover:text-slate-200 transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 transition-all rounded-full ${idx === activeSlide ? 'w-12 bg-indigo-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="relative py-12 border-y border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center space-y-1"
              >
                <h3 className="text-3xl md:text-5xl font-black text-white tabular-nums tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-400/80">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-radial from-indigo-500/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Platform Excellence</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Designed for meaningful <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">connections</span>.
            </h3>
            <p className="text-slate-400 text-lg">
              We provide the tools. You bring the energy. Together, we create experiences that resonate long after the lights go out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-indigo-500/30 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">The Process</h2>
                <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Your journey from <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">browser to host</span>.
                </h3>
              </div>

              <div className="space-y-8">
                {howSteps.map((step, idx) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 z-10 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all">
                        {idx + 1}
                      </div>
                      {idx < howSteps.length - 1 && (
                        <div className="absolute top-12 w-0.5 h-[calc(100%+2rem)] bg-gradient-to-b from-indigo-500/30 to-transparent" />
                      )}
                    </div>
                    <div className="space-y-2 pt-1">
                      <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px] opacity-20" />
              <div className="relative rounded-[2.5rem] border border-white/10 bg-slate-950 p-3 shadow-2xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
                  alt="Process illustration"
                  className="w-full h-full object-cover rounded-[2rem] opacity-80"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-10 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-3">
                      {[
                        { icon: Users, color: 'bg-indigo-500' },
                        { icon: PartyPopper, color: 'bg-pink-500' },
                        { icon: Sparkles, color: 'bg-amber-500' },
                        { icon: MapPin, color: 'bg-emerald-500' }
                      ].map((item, n) => (
                        <div key={n} className={cn("w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center text-white text-xs", item.color)}>
                          <item.icon size={16} />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 ml-2">+2.4k others</span>
                  </div>
                  <p className="text-xl font-bold text-white uppercase tracking-tight">Community Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED EVENTS */}
      <section className="py-24">
        <FeaturedEventsSlider
          events={displayedEvents}
          renderCard={(event) => <EventCard event={event} />}
        />
      </section>

      {/* 6. CATEGORIES GRID */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Diversify your vibe</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white">Find your obsession</h3>
            </div>
            <Link href="/events" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 group">
              View All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.value}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/events?category=${cat.value}`}
                  className="group relative flex flex-col justify-end h-64 rounded-3xl overflow-hidden border border-white/5 bg-slate-900 hover:border-indigo-500/50 transition-all"
                >
                  <div className="absolute inset-0 z-0">
                    <img src={cat.image} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt={cat.label} />
                    <div className={cn("absolute inset-0 bg-gradient-to-t mix-blend-multiply opacity-60", cat.color)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-all z-[2]">
                    <cat.icon size={22} />
                  </div>
                  <div className="relative z-[2] p-6 space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                      {cat.count}
                    </p>
                    <h4 className="text-2xl font-black text-white group-hover:translate-x-1 transition-transform origin-left">
                      {cat.label}
                    </h4>
                  </div>
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TOP HOSTS */}
      <section className="py-24 bg-slate-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Community Icons</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white">Trust the experts</h3>
            <p className="text-slate-400">Our hosts are verified, reviewed, and passionate about creating unique spaces for connection.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {topHosts.map((host, idx) => (
              <motion.div
                key={host.id || host.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={host.id ? `/profile/${host.id}` : '/register?role=HOST'}
                  className="group relative block rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl mx-auto group-hover:rotate-3 transition-transform duration-500">
                      <img
                        src={host.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
                        alt={host.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white rounded-full px-4 py-1 flex items-center gap-1.5 text-sm font-bold shadow-xl">
                      <Star size={14} className="fill-white" /> {host.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <h4 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                      {host.name}
                      <BadgeCheck size={20} className="text-indigo-400" />
                    </h4>
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                      {host.location || 'Worldwide'}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                      {host.tagline || 'Passionate community builder and event architect.'}
                    </p>
                    <div className="pt-4 flex items-center justify-center gap-2 text-indigo-400 font-bold text-sm group-hover:text-indigo-300">
                      View Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ABOUT US / MISSION */}
      <section className="py-24 relative overflow-hidden bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-[3rem] border border-white/5 bg-slate-950 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80"
                alt="Our mission"
                className="rounded-[2rem] w-full h-[500px] object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-8">
                    <HeartHandshake size={40} className="text-indigo-400" />
                  </div>
                  <p className="text-3xl font-black text-white italic tracking-tight">"To make every evening an opportunity for awe."</p>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">— Our Founding Vision</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Our Story</h2>
                <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Beyond just <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">attendance</span>.
                </h3>
              </div>

              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  EventHub was born from a simple realization: the digital world was pulling us apart, yet we all crave real, analog connections. We wanted to create a bridge between the screen and the street.
                </p>
                <p>
                  Today, we're more than a platform. We are a community of hosts, artists, explorers, and dreamers. Every event listed here is a testament to the fact that people still want to meet, share stories, and create memories that don't just exist in a cloud.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <h4 className="text-3xl font-black text-white mb-2">100%</h4>
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">Verified Hosts</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-2">Zero</h4>
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">Boredom Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <Testimonials />

      {/* 10. PARTNERS SECTION */}
      <section className="py-20 border-t border-white/5 bg-slate-950/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-12">Empowering Excellence with Global Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            {partners.map(brand => (
              <div key={brand.name} className="group flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                  <brand.icon size={24} className="text-white group-hover:text-indigo-400" />
                </div>
                <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Got Questions?</h2>
            <h3 className="text-4xl font-black text-white">Common Curiosities</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="group border border-white/5 rounded-3xl bg-white/[0.02] overflow-hidden transition-all hover:border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className="text-lg md:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full bg-slate-900 border border-white/10 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-slate-400" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-0 text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-3xl border border-dashed border-indigo-500/30 bg-indigo-500/5 text-center">
            <p className="text-slate-300 font-medium mb-4">Still need help? Our support team is here 24/7.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Contact Support <MessageCircle size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 12. RESOURCES / BLOG PREVIEW */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Latest Intel</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white">Community Journal</h3>
            </div>
            <Link href="/blog" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 group">
              Read All Articles <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={post.link} className="group block space-y-6">
                  <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/5">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">{post.date}</p>
                    <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">{post.title}</h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. NEWSLETTER CTA (Premium Overlay) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 px-8 py-20 text-center space-y-12">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Zap size={200} className="text-white" />
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Join the inner circle of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">event pulse</span>.
              </h2>
              <p className="text-slate-400 text-lg">
                Get proprietary access to weekly secret drops, early-bird pricing, and host-only masterclasses. No spam, only value.
              </p>
            </div>

            <form
              className="max-w-md mx-auto relative px-2"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Welcome to the inner circle!');
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-full bg-slate-950 border border-white/10 px-8 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-8 py-4 text-slate-950 font-black hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  Get Updates
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 uppercase font-black tracking-widest">By joining you agree to our terms & privacy policy</p>
            </form>
          </div>
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
      className="group relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900 shadow-2xl transition-all hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
      <div
        className="h-56 bg-cover bg-center overflow-hidden"
      >
        <img
          src={image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-slate-950/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-white/10">
          <Clock3 size={12} />
          Verified Event
        </div>
      </div>

      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            {event.category || 'EVENT'}
          </span>
          <span className="text-lg font-black text-white">
            {fee > 0 ? `$${fee}` : 'FREE'}
          </span>
        </div>

        <h3 className="text-2xl font-black text-white line-clamp-2 leading-tight tracking-tight group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
            <CalendarDays size={18} className="text-indigo-500" />
            <span>{dateLabel} {timeLabel}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
            <MapPin size={18} className="text-indigo-500" />
            <span className="truncate">{event.location || 'See details'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
            <Users size={18} className="text-indigo-500" />
            <span>{participantCount} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} RSVPs</span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[
              { icon: Users, color: 'bg-indigo-500' },
              { icon: Star, color: 'bg-amber-500' },
              { icon: Flame, color: 'bg-orange-500' }
            ].map((item, n) => (
              <div key={n} className={cn("w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white scale-90", item.color)}>
                <item.icon size={12} />
              </div>
            ))}
          </div>
          <span className="text-indigo-400 font-black text-sm group-hover:translate-x-1 transition-transform">
            View Spot <ArrowRight size={18} className="inline ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};
