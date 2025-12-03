'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const requestedRole = searchParams.get('role');
    if (requestedRole === 'HOST') {
      setRole('HOST');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(fullName, email, password, role);
      router.push('/login');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-10 items-stretch">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-900/30">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-indigo-900/70" />
          <div className="relative p-8 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 border border-white/20 text-xs uppercase tracking-[0.2em] text-slate-50">
               Join the community
            </div>
            <h1 className="text-4xl font-extrabold text-white">Create your account</h1>
            <p className="text-lg text-slate-100">
              Host experiences, join curated events, and manage everything from a modern dashboard experience.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Highlight title="Hosts" copy="Publish events, track participants, and collect payments." />
              <Highlight title="Attendees" copy="Save your favorites and keep all RSVPs in sync." />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6 bg-slate-900/70">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Sign up</h2>
            <p className="text-slate-300">It only takes a minute to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-200">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-slate-200">
                I want to
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="USER">Join Events</option>
                <option value="HOST">Host Events</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-200 font-semibold hover:text-white">
              Login here
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const Highlight = ({ title, copy }: { title: string; copy: string }) => (
  <div className="glass-panel rounded-xl border border-white/10 p-4">
    <p className="font-semibold text-white">{title}</p>
    <p className="text-sm text-slate-300">{copy}</p>
  </div>
);
