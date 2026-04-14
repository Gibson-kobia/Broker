'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { ChevronDown, Eye, EyeOff, Sun, Moon } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
      className={`${inter.className} min-h-screen bg-[#eeeeef] text-[#17171f] overflow-x-hidden px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-20`}
    >
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-[430px]"
      >
        <div className="mb-10 flex justify-center sm:mb-12">
          <Image
            src="/logos/noones.jpg"
            alt="Noones"
            width={186}
            height={62}
            priority
            className="h-auto w-[186px] object-contain"
          />
        </div>

        <div className="rounded-[18px] bg-white px-6 py-9 shadow-[0_3px_14px_rgba(15,23,42,0.05)] sm:px-7 sm:py-10">
          <h1 className="text-center text-[31px] font-bold tracking-[-0.03em] text-[#020617] sm:text-[33px]">
            Welcome to NoOnes
          </h1>

          <div className="mt-7 flex items-center justify-center gap-6">
            {socialProviders.map((provider) => (
              <button
                key={provider.name}
                type="button"
                aria-label={`Continue with ${provider.name}`}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-[#f3f4f6]"
              >
                <div className="relative h-9 w-9">
                  <Image
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div className="space-y-2.5">
              <label className="block text-[16px] font-semibold tracking-[-0.01em] text-[#4b5563]" htmlFor="emailOrPhone">
                Email/Phone number
              </label>
              <input
                id="emailOrPhone"
                type="text"
                value={credentials.emailOrPhone}
                onChange={handleFieldChange('emailOrPhone')}
                placeholder="Email/Phone number"
                className="w-full rounded-[16px] border-none bg-[#f3f3f4] px-8 py-[17px] text-[17px] font-semibold tracking-[-0.015em] text-[#0f172a] placeholder:text-[#b7c8c4] focus:outline-none focus:ring-2 focus:ring-[#00A651]/20"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-[16px] font-semibold tracking-[-0.01em] text-[#4b5563]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleFieldChange('password')}
                  placeholder="Password"
                  className="w-full rounded-[16px] border-none bg-[#f3f3f4] px-8 py-[17px] pr-16 text-[17px] font-semibold tracking-[-0.015em] text-[#0f172a] placeholder:text-[#b7c8c4] focus:outline-none focus:ring-2 focus:ring-[#00A651]/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-5 text-[#111111]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye className="h-5 w-5" strokeWidth={2.1} /> : <EyeOff className="h-5 w-5" strokeWidth={2.1} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-[15px] font-semibold text-[#05b773] underline underline-offset-[3px] transition-colors hover:text-[#029c61]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="Log in"
              className="mt-2 flex w-full items-center justify-center rounded-[17px] bg-[#10bf7a] px-5 py-[18px] text-white transition-colors duration-200 hover:bg-[#0cae70] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="text-[22px] font-bold tracking-[-0.02em]">{mode === 'login' ? 'Log in' : 'Sign up'}</span>
            </button>

            {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
          </form>

          <div className="mt-11 text-center text-[17px] text-[#4b5563]">
            {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
              className="font-semibold text-[#05b773] underline underline-offset-[3px] transition-colors hover:text-[#029c61]"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>

        <div className="mt-9 flex items-center justify-between gap-4 px-1 text-sm text-[#6b7280]">
          <div className="flex items-center gap-4">
            <Sun className="h-8 w-8 text-[#0cb878]" strokeWidth={1.8} />
            <button
              type="button"
              onClick={() => setIsDarkPreview((current) => !current)}
              className="relative inline-flex h-[40px] w-[92px] items-center rounded-[12px] bg-[#10bf7a] px-[5px] transition-colors"
              aria-label="Toggle theme"
            >
              <span
                className={`h-[30px] w-[30px] rounded-[10px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
                  isDarkPreview ? 'translate-x-[52px]' : 'translate-x-0'
                }`}
              />
            </button>
            <Moon className="h-8 w-8 text-[#0f172a]" strokeWidth={1.8} />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-1 py-1 text-[16px] font-semibold text-[#05b773] underline underline-offset-[4px] transition-colors hover:text-[#029c61]"
            aria-label="Select language"
          >
            <span>English</span>
            <ChevronDown className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>
      </motion.section>
    </main>
  );
}
