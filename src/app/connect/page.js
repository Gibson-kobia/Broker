'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <main className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden flex items-center justify-center px-6 py-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-[#111214]/95 p-6 sm:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-white text-center">Login</h1>
        <p className="mt-2 text-center text-sm text-slate-400">Use this form to connect any account.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm text-slate-300" htmlFor="emailOrPhone">
            Email or phone number
          </label>
          <input
            id="emailOrPhone"
            type="text"
            value={credentials.emailOrPhone}
            onChange={handleFieldChange('emailOrPhone')}
            placeholder="Email or phone number"
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

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-cyan-300"
          >
            Log in
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Back to home
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
