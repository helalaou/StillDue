create table public.boards (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 100), color text not null default 'mint', description text not null default '',
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(id,user_id)
);
alter table public.boards enable row level security;
create policy own_boards on public.boards for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
