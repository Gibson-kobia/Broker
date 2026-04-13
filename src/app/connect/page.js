'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const socialProviders = [
  { name: 'Google', logo: '/logos/google.png' },
  { name: 'Apple', logo: '/logos/apple.png' },
  { name: 'Telegram', logo: '/logos/telegram.png' },
];

export default function ConnectPage() {
  const [credentials, setCredentials] = useState({
    emailOrPhone: '',
    password: '',
  });

  const handleFieldChange = (field) => (event) => {
    setCredentials((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden flex items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-[#111214]/95 p-6 sm:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-white text-center">Welcome to Nexara</h1>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {socialProviders.map((provider) => (
            <button
              key={provider.name}
              type="button"
              aria-label={`Continue with ${provider.name}`}
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-white/20 hover:bg-white/[0.07]"
            >
              {provider.logo ? (
                <div className="relative h-6 w-6 sm:h-7 sm:w-7">
                  <Image
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    fill
                    sizes="28px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <provider.Icon className="h-6 w-6 text-slate-200" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm text-slate-300" htmlFor="emailOrPhone">
            Email/Phone number
          </label>
          <input
            id="emailOrPhone"
            type="text"
            value={credentials.emailOrPhone}
            onChange={handleFieldChange('emailOrPhone')}
            placeholder="Email/Phone number"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60"
            autoComplete="username"
          />

          <label className="block text-sm text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={credentials.password}
            onChange={handleFieldChange('password')}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60"
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <button type="button" className="text-sm text-slate-400 transition-colors hover:text-white">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-cyan-300"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          No account yet?{' '}
          <Link href="/" className="text-white transition-colors hover:text-cyan-300">
            Sign up
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
