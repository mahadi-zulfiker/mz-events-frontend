"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote, Briefcase } from "lucide-react";

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
    userType: "recruiter",
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
    userType: "recruiter",
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Jessica P.",
    role: "CEO",
    company: "Pinnacle Health Group",
    testimonial:
      "Fast, efficient, and the candidates are always a perfect cultural fit.",
    rating: 5,
    userType: "recruiter",
    avatarSrc:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Alex F.",
    role: "Operations Director",
    company: "Swift Hospitality",
    testimonial: "Consistently high-quality candidates and excellent service.",
    rating: 5,
    userType: "recruiter",
    avatarSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?fit=crop&w=120&q=80",
  },
];

/* -------------------- UI -------------------- */

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
    />
  ));
}

function UserTypeBadge({ userType }: { userType: string }) {
  // Keep it simple: only showing recruiter since that's what your data uses.
  if (userType !== "recruiter") return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-indigo-200">
      <Briefcase size={12} />
      Recruiter
    </span>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 shadow-xl shadow-indigo-900/30">
      <Quote className="absolute right-4 top-4 text-indigo-400/30" size={32} />

      <div className="mb-3 flex items-center gap-1">{renderStars(t.rating)}</div>

      <p className="mb-6 text-sm leading-relaxed text-slate-200">
        &ldquo;{t.testimonial}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <img
          src={t.avatarSrc}
          alt={t.name}
          className="h-10 w-10 rounded-full border border-white/20 object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-white">{t.name}</p>
          <p className="text-xs text-slate-400">
            {t.role}
            {t.company && ` • ${t.company}`}
          </p>
        </div>

        <UserTypeBadge userType={t.userType} />
      </div>
    </div>
  );
}

/* -------------------- EMBLA HOOK -------------------- */

function useAutoplayEmbla(
  options: Parameters<typeof useEmblaCarousel>[0],
  delay = 3200
) {
  const autoplay = useRef(
    Autoplay({
      delay,
      stopOnInteraction: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current]);

  const pause = useCallback(() => autoplay.current.stop(), []);
  const play = useCallback(() => autoplay.current.play(), []);

  useEffect(() => {
    if (!emblaApi) return;

    const resume = () => autoplay.current.play();
    emblaApi.on("pointerUp", resume);

    return () => {
      emblaApi.off("pointerUp", resume);
    };
  }, [emblaApi]);

  return { emblaRef, pause, play };
}

/* -------------------- MAIN -------------------- */

export default function Testimonials() {
  const slides = useMemo(() => {
    const min = 8;
    const out = [...testimonials];
    while (out.length < min) out.push(...testimonials);
    return out.slice(0, min);
  }, []);

  const { emblaRef, pause, play } = useAutoplayEmbla(
    { loop: true, align: "start" },
    3200
  );

  return (
    <section className="relative overflow-hidden bg-slate-900 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl space-y-14 px-2">
        {/* HEADER */}
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-widest text-indigo-300">
            Loved by members
          </p>
          <h2 className="text-3xl font-bold text-white">
            Stories from the community
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            Real notes from people who met their crew through the platform.
          </p>
        </div>

        {/* TESTIMONIAL SLIDER */}
        <div className="relative">
          <div
            ref={emblaRef}
            onMouseEnter={pause}
            onMouseLeave={play}
            className="overflow-hidden"
          >
            <div className="flex -ml-4">
              {slides.map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="pl-4 flex-[0_0_90%] sm:flex-[0_0_65%] md:flex-[0_0_45%] lg:flex-[0_0_34%]"
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900 to-transparent" />
        </div>
      </div>
    </section>
  );
}
