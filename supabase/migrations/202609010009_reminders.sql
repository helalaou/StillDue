create table public.reminders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, deadline_id uuid not null,
 scheduled_at timestamptz not null,claimed_at timestamptz,sent_at timestamptz,attempts integer not null default 0,last_error text,
 unique(deadline_id,scheduled_at),foreign key(deadline_id,user_id) references public.deadlines(id,user_id) on delete cascade
);
alter table public.reminders enable row level security;
create policy own_reminder_reads on public.reminders for select to authenticated using(user_id=(select auth.uid()));
create function public.schedule_deadline_reminders() returns trigger language plpgsql security definer set search_path='' as $$
declare minutes integer;
begin
 delete from public.reminders where deadline_id=new.id and sent_at is null;
 if new.status='active' and new.certainty='confirmed' and new.due_at>now() then
 foreach minutes in array new.reminder_minutes loop
 if minutes>0 and new.due_at-make_interval(mins=>minutes)>now() then
 insert into public.reminders(user_id,deadline_id,scheduled_at) values(new.user_id,new.id,new.due_at-make_interval(mins=>minutes)) on conflict do nothing;
 end if;end loop;end if;return new;
end; $$;
create trigger schedule_reminders after insert or update of due_at,reminder_minutes,status,certainty on public.deadlines for each row execute function public.schedule_deadline_reminders();
