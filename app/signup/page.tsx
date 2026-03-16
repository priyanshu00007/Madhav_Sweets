'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Protocol: Phone Verification (10 Digits)
    if (!/^\d{10}$/.test(phone)) {
       setError("LOGISTICS ERROR: PHONE MUST BE EXACTLY 10 DIGITS");
       setLoading(false);
       return;
    }

    // Protocol: Email Connection Logic
    // Must be @gmail.com or @yahoo.com - digits optional.
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailPattern.test(email.toLowerCase())) {
       setError("PROTOCOL ERROR: AUTHORIZED DOMAINS ONLY (@GMAIL.COM / @YAHOO.COM)");
       setLoading(false);
       return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login?message=Account created successfully');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fffcf5] relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl z-10"
      >
        <div className="bg-white border-8 border-black p-10 md:p-14 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-black font-black text-4xl mb-6 group">
              <span className="font-playfair tracking-tighter uppercase">AMBROSIA</span>
            </Link>
            <h1 className="text-3xl font-black text-black tracking-tight uppercase">Register</h1>
            <p className="text-black/60 mt-3 font-bold uppercase tracking-widest text-[10px]">Join the pure ghee revolution</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-4 border-red-500 text-red-600 p-4 rounded-none text-xs font-black text-center uppercase">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-4 border-black p-5 pl-14 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Email Connection (@gmail/@yahoo)</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-4 border-black p-5 pl-14 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all font-mono"
                  placeholder="2024user@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Logistics Link (10-Digit Mobile)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 font-black text-sm uppercase italic">P#</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border-4 border-black p-5 pl-14 text-black font-black focus:bg-yellow-400 focus:outline-none transition-all font-mono"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-4 border-black p-5 pl-14 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-6 border-4 border-black transition-all hover:bg-yellow-400 hover:text-black font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-y-2 flex items-center justify-center gap-3 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Start Journey <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs font-black text-black uppercase tracking-widest">
              Already a member?{' '}
              <Link href="/login" className="text-black underline decoration-4 underline-offset-4 hover:bg-yellow-400 px-1">
                 Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
