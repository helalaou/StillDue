create table public.conferences (
 id text primary key, title text not null, name text not null, field text not null, subfield text not null,
 year integer not null, round text not null default '', due_at timestamptz, abstract_at timestamptz, timezone text not null,
 place text not null default '',event_date text not null default '',url text not null, source_url text not null,source_name text not null,
 checked_at timestamptz not null default now(),certainty text not null check(certainty in ('confirmed','estimated','tba','ongoing'))
);
alter table public.conferences enable row level security;
create policy read_catalog on public.conferences for select to anon,authenticated using(true);
create table public.catalog_runs(id bigint generated always as identity primary key, started_at timestamptz not null default now(),finished_at timestamptz,records integer not null default 0,error text);
alter table public.catalog_runs enable row level security;
