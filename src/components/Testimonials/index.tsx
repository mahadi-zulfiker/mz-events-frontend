"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote, Briefcase, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/* -------------------- DATA -------------------- */

const testimonials = [
  {
    id: 1,
    name: "Emily R.",
    role: "HR Manager",
    company: "Future Innovations",
    testimonial:
      "Your platform has completely transformed our recruitment strategy. We've seen a 40% reduction in time-to-hire and a significant increase in candidate quality.",
    rating: 5,
    userType: "Recruiter",
    avatarSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Michael B.",
    role: "Talent Acquisition",
    company: "Global Services",
    testimonial:
      "A true game-changer in staffing! The seamless experience and automated matching features saved us countless hours.",
    rating: 5,
    userType: "Recruiter",
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Project Manager",
    company: "TechFlow",
    testimonial:
      "Finding the right people for our niche events used to be a nightmare. Now it's the easiest part of my job.",
    rating: 5,
    userType: "Host",
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Alex F.",
    role: "Operations Director",
    company: "Swift Hospitality",
    testimonial: "Consistently high-quality candidates and excellent service. The platform is intuitive and powerful.",
    rating: 5,
    userType: "Recruiter",
    avatarSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?fit=crop&w=120&q=80",
  },
  {
    id: 5,
    name: "Marcus T.",
    role: "Community Lead",
    company: "VibeCity",
    testimonial: "The networking capabilities here are unmatched. I've met my most valuable collaborators through these events.",
    rating: 5,
    userType: "Member",
    avatarSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&q=80",
  },
];

/* -------------------- UI -------------------- */

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      className={cn(
        "transition-colors duration-300",
        i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
      )}
    />
  ));
}

function UserTypeBadge({ userType }: { userType: string }) {
  const Icon = userType === "Recruiter" ? Briefcase : userType === "Host" ? Sparkles : User;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
      <Icon size={12} />
      {userType}
    </span>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="group relative flex h-full flex-col rounded-[2.5rem] border border-white/5 bg-slate-950 p-8 shadow-2xl transition-all hover:border-indigo-500/30">
      <Quote className="absolute right-8 top-8 text-white/[0.03] group-hover:text-indigo-500/10 transition-colors duration-500" size={64} />

      <div className="mb-6 flex items-center gap-1">{renderStars(t.rating)}</div>

      <p className="mb-10 flex-1 text-lg font-medium leading-relaxed text-slate-300 group-hover:text-white transition-colors">
        &ldquo;{t.testimonial}&rdquo;
      </p>

      <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 p-[1px]">
            <img
              src={t.avatarSrc}
              alt={t.name}
              className="h-full w-full rounded-[inherit] object-cover ring-2 ring-slate-950"
            />
          </div>
          <div className="leading-tight">
            <p className="font-black text-white tracking-tight">{t.name}</p>
            <p className="text-xs font-bold text-slate-500 truncate max-w-[120px]">
              {t.role} {t.company && ` @ ${t.company}`}
            </p>
          </div>
        </div>

        <UserTypeBadge userType={t.userType} />
      </div>
    </div>
  );
}

/* -------------------- MAIN -------------------- */

export default function Testimonials() {
  const slides = useMemo(() => {
    const min = 8;
    const out = [...testimonials];
    while (out.length < min) out.push(...testimonials);
    return out.slice(0, min);
  }, []);

  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false
    },
    [autoplay.current]
  );

  return (
    <section className="relative overflow-hidden bg-slate-950 py-32">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-radial from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-20 space-y-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500"
          >
            Social Proof
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            Loved by thousands
          </motion.h2>

          <div className="pt-12 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Loved by members
            </p>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Stories from the community
            </h3>
            <p className="mx-auto max-w-2xl text-slate-400 font-medium whitespace-pre-wrap">
              Real notes from people who met their crew through the platform.
            </p>
          </div>
        </div>

        {/* TESTIMONIAL SLIDER */}
        <div className="relative group/slider">
          <div
            ref={emblaRef}
            className="overflow-hidden touch-pan-y"
          >
            <div className="flex -ml-6">
              {slides.map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="pl-6 flex-[0_0_100%] sm:flex-[0_0_80%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Subtle Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 hidden lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 hidden lg:block" />
        </div>

        {/* Decorative Indicator */}
        <div className="mt-16 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === 0 ? "w-8 bg-indigo-500" : "w-1.5 bg-white/10")} />
          ))}
        </div>
      </div>
    </section>
  );
}
