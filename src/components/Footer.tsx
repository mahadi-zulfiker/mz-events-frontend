import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const FooterColumn = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) => (
  <div>
    <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
    <ul className="space-y-2 text-sm text-slate-300">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="hover:text-white transition">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 border border-white/10">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-200">EventHub</span>
            </div>
            <p className="text-sm text-slate-300 max-w-xs">
              A refined space for hosts, admins, and attendees to discover, plan, and thrive together.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiMail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title="Platform"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Browse Events', href: '/events' },
              { label: 'Dashboard', href: '/dashboard' },
            ]}
          />
          <FooterColumn
            title="Resources"
            items={[
              { label: 'Help Center', href: '/faq' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ]}
          />
          <div className="glass-panel rounded-2xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">Stay in the loop</h4>
            <p className="text-sm text-slate-300 mb-4">
              Monthly updates on new features, design drops, and curated events.
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:translate-y-[-1px]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} EventHub. Crafted for modern event builders.</p>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p>Live infrastructure status: All systems normal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
