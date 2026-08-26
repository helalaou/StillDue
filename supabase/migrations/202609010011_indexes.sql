create index deadlines_owner_status_due on public.deadlines(user_id,status,due_at);
create index deadlines_owner_board on public.deadlines(user_id,board_id);
create index projects_owner_board on public.projects(user_id,board_id);
create index boards_owner on public.boards(user_id);
create index templates_owner on public.templates(user_id);
create index conferences_field_due on public.conferences(field,subfield,due_at);
create index pending_reminders on public.reminders(scheduled_at) where sent_at is null;
