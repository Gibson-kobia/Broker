'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const socialProviders = [
  { name: 'Google', logo: '/logos/google-icon-logo-svgrepo-com.svg' },
  { name: 'Apple', logo: '/logos/apple-logo-svgrepo-com.svg' },
  { name: 'Telegram', logo: '/logos/telegram-svgrepo-com.svg' },
];

export default function ConnectPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [credentials, setCredentials] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFieldChange = (field) => (event) => {
    setCredentials((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = credentials.emailOrPhone.trim();
    const password = credentials.password;

    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        router.push('/dashboard');
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data?.user) {
        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email,
          },
          { onConflict: 'id' }
        );
      }

      if (data?.session) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      setSuccessMessage('Signup successful. Check your email to confirm your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17171f] overflow-x-hidden flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="mb-10 flex justify-center">
          <Image
            src="/logos/noones.jpg"
            alt="Noones"
            width={168}
            height={56}
            priority
            className="h-auto w-[168px] object-contain"
          />
        </div>

        <div className="rounded-[26px] border border-[#e9ebf0] bg-white p-6 shadow-[0_28px_60px_rgba(19,27,54,0.08)] sm:p-8">
          <h1 className="text-center text-[30px] font-semibold tracking-[-0.015em] text-[#0f172a]">
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </h1>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {socialProviders.map((provider) => (
              <button
                key={provider.name}
                type="button"
                aria-label={`Continue with ${provider.name}`}
                className="flex h-12 items-center justify-center rounded-xl border border-[#e8ebf2] bg-white transition-colors hover:border-[#d8dde8] hover:bg-[#f8fafc]"
              >
                <div className="relative h-6 w-6">
                  <Image
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#eceff5]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#94a3b8]">or</span>
            <div className="h-px flex-1 bg-[#eceff5]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-sm text-[#475569]" htmlFor="emailOrPhone">
              Email/Phone number
            </label>
            <input
              id="emailOrPhone"
              type="text"
              value={credentials.emailOrPhone}
              onChange={handleFieldChange('emailOrPhone')}
              placeholder="Email/Phone number"
              className="w-full rounded-xl border border-[#d7deea] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#f9be00]"
              autoComplete="username"
            />

            <label className="block text-sm text-[#475569]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleFieldChange('password')}
              placeholder="Password"
              className="w-full rounded-xl border border-[#d7deea] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#f9be00]"
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <button type="button" className="text-sm text-[#64748b] transition-colors hover:text-[#0f172a]">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f9be00] px-5 py-3 text-sm font-semibold text-[#1e293b] transition-colors duration-200 hover:bg-[#ebb300] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
            </button>

            {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
          </form>

          <div className="mt-6 text-center text-sm text-[#64748b]">
            {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
              className="text-[#0f172a] transition-colors hover:text-[#f59e0b]"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <div className="mt-2 text-center text-sm text-[#64748b]">
            <Link href="/" className="text-[#0f172a] transition-colors hover:text-[#f59e0b]">
              Back to home
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
