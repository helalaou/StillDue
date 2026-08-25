create table public.deadlines (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 160), board_id uuid, project_id uuid,
 due_at timestamptz, target_at timestamptz, timezone text not null default 'UTC', date_only boolean not null default false,
 certainty text not null default 'ongoing' check(certainty in ('confirmed','estimated','tba','ongoing')),
 status text not null default 'active' check(status in ('active','inactive','completed','trash')),
 previous_status text check(previous_status in ('active','inactive','completed','trash')), deleted_at timestamptz, completed_at timestamptz,
 priority text not null default 'normal' check(priority in ('low','normal','high')), pinned boolean not null default false, focus boolean not null default false,
 notes text not null default '' check(char_length(notes)<=10000), next_action text not null default '' check(char_length(next_action)<=500),
 tags text[] not null default '{}', checklist jsonb not null default '[]', research jsonb not null default '{}',
 recurrence text not null default 'none' check(recurrence in ('none','weekly','monthly','yearly')), recurrence_root uuid,
 recurrence_advanced_at timestamptz, reminder_minutes integer[] not null default '{}', start_at timestamptz not null default now(), kind text not null default 'Deadline',
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(id,user_id), unique(user_id,recurrence_root,due_at),
 foreign key(board_id,user_id) references public.boards(id,user_id), foreign key(project_id,user_id) references public.projects(id,user_id),
 check(certainty not in ('confirmed','estimated') or due_at is not null),
 check(recurrence='none' or (certainty='confirmed' and due_at is not null)),
 check(target_at is null or due_at is null or target_at<=due_at),
 check((status='trash')=(deleted_at is not null)),
 check(cardinality(reminder_minutes)<=5)
);
alter table public.deadlines enable row level security;
create policy own_deadlines on public.deadlines for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
