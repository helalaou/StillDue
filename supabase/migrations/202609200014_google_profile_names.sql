create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,name)
 values(
  new.id,
  left(coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),100)
 );
 insert into public.boards(user_id,name,color,description)
 values
  (new.id,'Research','mint','Ideas into something real.'),
  (new.id,'Personal','lavender','Room for the rest of life.');
 return new;
end; $$;
