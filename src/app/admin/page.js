import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connect');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  const { data: rows } = await supabase
    .from('platform_connections')
    .select('id, platform, email, created_at, user_id')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0a0a0c] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-5">
        <h1 className="mb-2 text-2xl font-semibold">Admin submissions</h1>
        <p className="mb-5 text-sm text-slate-300">
          Platform connection emails submitted by users.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">Platform</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Created at</th>
                <th className="px-3 py-2">User ID</th>
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-3 py-2">{row.platform}</td>
                  <td className="px-3 py-2">{row.email}</td>
                  <td className="px-3 py-2 text-slate-400">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-slate-400">{row.user_id || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
