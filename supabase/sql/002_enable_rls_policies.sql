alter table public.profiles enable row level security;
alter table public.platform_connections enable row level security;

-- Profiles: users can read and manage only their own profile row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Platform connections: users can insert/read only their own rows.
drop policy if exists "connections_insert_own" on public.platform_connections;
create policy "connections_insert_own"
on public.platform_connections
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "connections_select_own" on public.platform_connections;
create policy "connections_select_own"
on public.platform_connections
for select
to authenticated
using (auth.uid() = user_id);

-- Admin read-all policy for /admin, controlled by profiles.is_admin.
drop policy if exists "connections_admin_read_all" on public.platform_connections;
create policy "connections_admin_read_all"
on public.platform_connections
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);
