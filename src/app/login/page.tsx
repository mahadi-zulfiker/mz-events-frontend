'use client';

import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, remember);
      router.push('/');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e?: SyntheticEvent) => {
    e?.preventDefault();
    toast.success('Password reset instructions sent (placeholder flow).');
    setShowForgot(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-stretch">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-900/30">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-indigo-900/70" />
          <div className="relative p-8 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 border border-white/20 text-xs uppercase tracking-[0.2em] text-slate-50">
              <FiShield /> Secure access
            </div>
            <h1 className="text-4xl font-extrabold text-white">Welcome back</h1>
            <p className="text-lg text-slate-100">
              Log in to manage events, track RSVPs, and refine your experiences with the new dashboard surfaces.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Highlight title="Protected routes" copy="Role-aware navigation for admins, hosts, and users." />
              <Highlight title="Fast onboarding" copy="Stay signed in with your preferred session length." />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6 bg-slate-900/70">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="text-slate-300">Use your account credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between text-sm text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgot((p) => !p)}
                className="font-semibold text-indigo-300 hover:text-indigo-200"
              >
                Forgot password?
              </button>
            </div>

            {showForgot && (
              <div className="rounded-lg border border-indigo-200/40 bg-indigo-500/10 p-3 space-y-2">
                <p className="text-sm font-semibold text-white">Reset password</p>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                  placeholder="Confirm your email"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="text-xs font-semibold text-indigo-200 hover:text-white"
                  >
                    Send reset link
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-300">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-200 font-semibold hover:text-white">
              Register here
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

const Highlight = ({ title, copy }: { title: string; copy: string }) => (
  <div className="glass-panel rounded-xl border border-white/10 p-4">
    <p className="font-semibold text-white">{title}</p>
    <p className="text-sm text-slate-300">{copy}</p>
  </div>
);
