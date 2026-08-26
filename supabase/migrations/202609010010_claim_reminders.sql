create function public.claim_reminders(batch_size integer default 50) returns setof public.reminders language sql security definer set search_path='' as $$
 update public.reminders set claimed_at=now(),attempts=attempts+1 where id in (
 select id from public.reminders where sent_at is null and scheduled_at<=now() and attempts<5 and (claimed_at is null or claimed_at<now()-interval '15 minutes') order by scheduled_at limit least(batch_size,100) for update skip locked
 ) returning *;
$$;
revoke all on function public.claim_reminders(integer) from public,anon,authenticated;
grant execute on function public.claim_reminders(integer) to service_role;
