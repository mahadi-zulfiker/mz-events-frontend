'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiArrowUpRight, FiGlobe, FiGithub, FiLinkedin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FooterColumn = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; isExternal?: boolean }[];
}) => (
  <div className="space-y-6">
    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">{title}</h4>
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 font-bold"
            target={item.isExternal ? "_blank" : undefined}
          >
            {item.label}
            {item.isExternal && <FiArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 p-[1px] shadow-2xl shadow-indigo-500/20">
                <div className="h-full w-full rounded-[inherit] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo-eventhub.svg"
                    alt="EventHub"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">EventHub</span>
            </Link>

            <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
              We're building the infrastructure for the next generation of IRL connections. Authentic, curated, and unforgettable.
            </p>

            <div className="flex gap-4">
              {[
                { icon: FiInstagram, href: "#" },
                { icon: FiTwitter, href: "#" },
                { icon: FiLinkedin, href: "#" },
                { icon: FiGithub, href: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 hover:-translate-y-1"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            <FooterColumn
              title="Platform"
              items={[
                { label: 'Browse Events', href: '/events' },
                { label: 'Host an Event', href: '/events/create' },
                { label: 'Community Journal', href: '/blog' },
                { label: 'Verified Hosts', href: '#' },
                { label: 'Mobile App', href: '#', isExternal: true },
              ]}
            />
            <FooterColumn
              title="Ecosystem"
              items={[
                { label: 'Insights & Blog', href: '/blog' },
                { label: 'Community Guidelines', href: '#' },
                { label: 'Safety Center', href: '#' },
                { label: 'Developer API', href: '#', isExternal: true },
                { label: 'Partnerships', href: '#' },
              ]}
            />
            <FooterColumn
              title="Support"
              items={[
                { label: 'Help Center', href: '/faq' },
                { label: 'Community Blog', href: '/blog' },
                { label: 'Contact Support', href: '/contact' },
                { label: 'Status Page', href: '#', isExternal: true },
                { label: 'Privacy Policy', href: '#' },
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            <span>(c) 2025 EventHub INC</span>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <Link href="#" className="hover:text-white transition-colors">Legal</Link>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>

          <div className="flex items-center gap-4 py-2 px-4 rounded-full bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Systems Operational</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <FiGlobe size={12} className="text-indigo-400" />
              <span>Global Cluster</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
