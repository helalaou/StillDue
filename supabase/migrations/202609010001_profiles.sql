create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 name text not null default '' check(char_length(name)<=100),
 preferences jsonb not null default '{}'::jsonb,
 version integer not null default 1,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 last_digest_at timestamptz
);
alter table public.profiles enable row level security;
create policy own_profile on public.profiles for all to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
