create function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,name) values(new.id,left(coalesce(new.raw_user_meta_data->>'name',''),100));
 insert into public.boards(user_id,name,color,description) values(new.id,'Research','mint','Ideas into something real.'),(new.id,'Personal','lavender','Room for the rest of life.');
 return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
