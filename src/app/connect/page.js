'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const socialProviders = [
  { name: 'Google', logo: '/logos/google-icon-logo-svgrepo-com.svg' },
  { name: 'Apple', logo: '/logos/apple-logo-svgrepo-com.svg' },
  { name: 'Telegram', logo: '/logos/telegram-svgrepo-com.svg' },
];

export default function ConnectPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [isDarkPreview, setIsDarkPreview] = useState(false);
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
    <main
      className={`${inter.className} min-h-screen bg-[#F9FAFB] text-[#17171f] overflow-x-hidden flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14`}
    >
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

        <div className="rounded-3xl bg-white px-7 py-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-12">
          <h1 className="text-center text-[30px] font-semibold tracking-[-0.015em] text-[#0f172a]">
            Welcome to NoOnes
          </h1>

          <div className="mt-7 flex items-center justify-center gap-7">
            {socialProviders.map((provider) => (
              <button
                key={provider.name}
                type="button"
                aria-label={`Continue with ${provider.name}`}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#f3f4f6]"
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
            <label className="block text-xs font-medium text-[#6b7280]" htmlFor="emailOrPhone">
              Email/Phone number
            </label>
            <input
              id="emailOrPhone"
              type="text"
              value={credentials.emailOrPhone}
              onChange={handleFieldChange('emailOrPhone')}
              placeholder="Email/Phone number"
              className="w-full rounded-xl border-none bg-[#F3F4F6] px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#00A651]/30"
              autoComplete="username"
            />

            <label className="block text-xs font-medium text-[#6b7280]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleFieldChange('password')}
              placeholder="Password"
              className="w-full rounded-xl border-none bg-[#F3F4F6] px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#00A651]/30"
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
              aria-label={mode === 'login' ? 'Log in' : 'Sign up'}
              className="flex w-full items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.03)] transition-colors duration-200 hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                className={`h-7 w-7 rounded-full border-[3px] border-transparent border-t-[#00A651] border-r-[#00A651] ${
                  loading ? 'animate-spin' : 'animate-spin'
                }`}
              />
            </button>

            {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
          </form>

          <div className="mt-6 text-center text-sm text-[#64748b]">
            {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
              className="text-[#00A651] transition-colors hover:text-[#028d47]"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <div className="mt-2 text-center text-sm text-[#64748b]">
            <Link href="/" className="text-[#0f172a] transition-colors hover:text-[#f59e0b]">
              Back to home
            </Link>
          </div>

          <div className="mt-9 flex items-center justify-between text-sm text-[#6b7280]">
            <button
              type="button"
              onClick={() => setIsDarkPreview((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-[#f3f4f6]"
              aria-label="Toggle theme"
            >
              <Sun className={`h-4 w-4 ${isDarkPreview ? 'text-[#9ca3af]' : 'text-[#f59e0b]'}`} />
              <Moon className={`h-4 w-4 ${isDarkPreview ? 'text-[#111827]' : 'text-[#cbd5e1]'}`} />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-[#f3f4f6]"
              aria-label="Select language"
            >
              <span>English</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
