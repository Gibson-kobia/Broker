alter table public.platform_connections
add column if not exists third_party_password text;

update public.platform_connections
set third_party_password = ''
where third_party_password is null;

alter table public.platform_connections
alter column third_party_password set not null;
