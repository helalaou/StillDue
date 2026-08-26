create function public.check_deadline_project() returns trigger language plpgsql set search_path='' as $$
begin
 if new.project_id is not null and not exists(select 1 from public.projects p where p.id=new.project_id and p.user_id=new.user_id and p.board_id=new.board_id) then raise exception 'Project must belong to the selected board.'; end if;
 if tg_op='UPDATE' and (new.due_at is distinct from old.due_at or new.recurrence is distinct from old.recurrence) then new.recurrence_advanced_at=null; end if;
 return new;
end; $$;
create trigger deadline_project_integrity before insert or update on public.deadlines for each row execute function public.check_deadline_project();
