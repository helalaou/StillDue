create function public.touch_record() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); new.version=old.version+1; return new; end; $$;
create trigger profiles_version before update on public.profiles for each row execute function public.touch_record();
create trigger boards_version before update on public.boards for each row execute function public.touch_record();
create trigger projects_version before update on public.projects for each row execute function public.touch_record();
create trigger deadlines_version before update on public.deadlines for each row execute function public.touch_record();
create trigger templates_version before update on public.templates for each row execute function public.touch_record();
