create table public.templates (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 100),description text not null default '',kind text not null default 'Deadline',
 steps jsonb not null default '[]',version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
alter table public.templates enable row level security;
create policy own_templates on public.templates for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
