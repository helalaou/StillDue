create table public.projects (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 board_id uuid not null, name text not null check(char_length(name) between 1 and 160), description text not null default '',
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(id,user_id), foreign key(board_id,user_id) references public.boards(id,user_id)
);
alter table public.projects enable row level security;
create policy own_projects on public.projects for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
