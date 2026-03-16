'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { ShoppingBag, Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf5]">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Incorrect email or password. Please try again.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Connection timeout. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fffcf5] relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="bg-white border-2 border-black rounded-[2rem] p-10 md:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-black font-black text-4xl mb-6 group">
              <span className="font-playfair tracking-tighter">AMBROSIA</span>
            </Link>
            <h1 className="text-3xl font-black text-black tracking-tight uppercase">Login</h1>
            <p className="text-black/60 mt-3 font-bold uppercase tracking-widest text-[10px]">Access your sweet account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-600 p-4 rounded-xl text-xs font-black text-center uppercase">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-2xl py-5 pl-14 pr-6 text-black font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all placeholder:text-black/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Password</label>
                <Link href="/forgot-password" title="Forgot Password Hub" className="text-[10px] font-black text-black hover:underline uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-2xl py-5 pl-14 pr-16 text-black font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all placeholder:text-black/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 border-2 border-black text-black font-black py-5 rounded-2xl transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 mt-6 uppercase tracking-widest text-sm"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs font-black text-black uppercase tracking-widest">
              No account?{' '}
              <Link href="/signup" className="text-black underline decoration-2 underline-offset-4 hover:bg-yellow-400 px-1">
                 Join Us
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
