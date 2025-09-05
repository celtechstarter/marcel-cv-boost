-- TYPE for sanitized public reviews (optional but nice for clarity)
do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
    where t.typname = 'review_public' and n.nspname = 'public'
  ) then
    create type public.review_public as (
      id uuid,
      rating int,
      title text,
      body text,
      date_published timestamptz,
      display_name text
    );
  end if;
end$$;

-- 1) SAFER public reviews RPC (no emails, only published)
create or replace function public_get_published_reviews(
  p_limit int default 20,
  p_offset int default 0,
  p_stars int default null
) returns setof review_public
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id,
    r.rating,
    coalesce(nullif(r.title, ''), 'Bewertung') as title,
    r.body,
    r.published_at as date_published,
    -- Display name: first name + initial (fallback to just first token)
    case
      when r.name is null or length(btrim(r.name)) = 0
        then 'Anonym'
      else
        trim(split_part(r.name, ' ', 1)) ||
        case when split_part(r.name, ' ', 2) <> ''
             then ' ' || left(split_part(r.name, ' ', 2), 1) || '.'
             else '' end
    end as display_name
  from reviews r
  where r.status = 'veroeffentlicht'
    and (p_stars is null or r.rating = p_stars)
  order by r.published_at desc nulls last, r.id
  limit greatest(p_limit, 0)
  offset greatest(p_offset, 0);
$$;

-- 2) REVIEW STATS (avg + count for published)
create or replace function public_get_review_stats()
returns table(avg_rating numeric, review_count int)
language sql
stable
security definer
set search_path = public
as $$
  select
    round(avg(r.rating)::numeric, 1) as avg_rating,
    count(*)::int as review_count
  from reviews r
  where r.status = 'veroeffentlicht';
$$;

-- 3) BOOKINGS: next 7 days rows (for admin dashboard)
create or replace function public_bookings_next7()
returns table(
  id uuid,
  name text,
  email text,
  discord_name text,
  note text,
  starts_at timestamptz,
  duration_minutes int,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    b.id, b.name, b.email, b.discord_name, b.note,
    b.starts_at, b.duration_minutes, b.status
  from bookings b
  where b.starts_at >= now()
    and b.starts_at < (now() + interval '7 days')
  order by b.starts_at asc;
$$;

-- 4) BOOKINGS CSV EXPORT (generic range)
-- Returns a CSV string with a header row. Minimal escaping for quotes.
create or replace function public_export_bookings_csv(
  p_from timestamptz default now(),
  p_to   timestamptz default (now() + interval '7 days')
) returns text
language plpgsql
stable
security definer
set search_path = public
as $fn$
declare
  v_header text := 'id,name,email,discord_name,note,starts_at,duration_minutes,status';
  v_rows   text;
begin
  with rows as (
    select
      -- escape any double quotes in fields and wrap in quotes
      '"' || replace(coalesce(b.id::text, ''), '"', '""') || '",' ||
      '"' || replace(coalesce(b.name, ''), '"', '""') || '",' ||
      '"' || replace(coalesce(b.email, ''), '"', '""') || '",' ||
      '"' || replace(coalesce(b.discord_name, ''), '"', '""') || '",' ||
      '"' || replace(coalesce(b.note, ''), '"', '""') || '",' ||
      '"' || replace(coalesce(to_char(b.starts_at, 'YYYY-MM-DD"T"HH24:MI:SSOF'), ''), '"', '""') || '",' ||
      '"' || replace(coalesce(b.duration_minutes::text, ''), '"', '""') || '",' ||
      '"' || replace(coalesce(b.status, ''), '"', '""') || '"'
      as csv_line
    from bookings b
    where b.starts_at >= p_from
      and b.starts_at <  p_to
    order by b.starts_at asc
  )
  select string_agg(csv_line, E'\n') into v_rows from rows;

  return v_header || case when v_rows is null then '' else E'\n' || v_rows end;
end
$fn$;

-- 5) GRANTS: allow anon & authenticated to call the SAFE public functions
grant execute on function public_get_published_reviews(int,int,int) to anon, authenticated;
grant execute on function public_get_review_stats()               to anon, authenticated;
grant execute on function public_bookings_next7()                 to authenticated;  -- keep bookings to authenticated/admin
grant execute on function public_export_bookings_csv(timestamptz,timestamptz) to authenticated; -- CSV only for admin

-- NOTE:
-- We intentionally DO NOT grant select on raw tables (reviews, bookings) to anon.
-- Public reads should go through the SAFE functions above.