-- Private bucket for CVs
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'cv_uploads') then
    insert into storage.buckets (id, name, public) values ('cv_uploads', 'cv_uploads', false);
  end if;
end$$;

-- Help requests table
create table if not exists help_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  discord_name text default '',
  message text not null,
  cv_path text default null,
  created_at timestamptz not null default now()
);

alter table help_requests enable row level security;
-- No public policies: access only via Edge Function (service role)

-- Admin RPCs
create or replace function admin_list_help_requests(p_limit int default 50, p_offset int default 0)
returns table(id uuid, name text, email text, discord_name text, message text, cv_path text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select id, name, email, discord_name, message, cv_path, created_at
  from help_requests
  order by created_at desc
  limit greatest(p_limit,0) offset greatest(p_offset,0);
$$;

create or replace function admin_cv_signed_url(p_path text, p_expires_sec int default 300)
returns text
language plpgsql stable security definer set search_path = public as $$
declare v_url text;
begin
  if p_path is null or length(btrim(p_path)) = 0 then return null; end if;
  select signed_url into v_url from storage.sign_url('cv_uploads', p_path, p_expires_sec);
  return v_url;
end $$;

create or replace function admin_export_help_requests_csv(
  p_from timestamptz default now() - interval '30 days',
  p_to   timestamptz default now()
) returns text
language plpgsql stable security definer set search_path = public as $fn$
declare v_header text := 'id,name,email,discord_name,message,cv_path,created_at'; v_rows text;
begin
  with rows as (
    select '"'||replace(coalesce(id::text,''),'"','""')||'",'||
           '"'||replace(coalesce(name,''),'"','""')||'",'||
           '"'||replace(coalesce(email,''),'"','""')||'",'||
           '"'||replace(coalesce(discord_name,''),'"','""')||'",'||
           '"'||replace(coalesce(message,''),'"','""')||'",'||
           '"'||replace(coalesce(cv_path,''),'"','""')||'",'||
           '"'||replace(to_char(created_at,'YYYY-MM-DD"T"HH24:MI:SSOF'),'"','""')||'"' as csv_line
    from help_requests
    where created_at >= p_from and created_at < p_to
    order by created_at desc
  ) select string_agg(csv_line, E'\n') into v_rows from rows;
  return v_header || case when v_rows is null then '' else E'\n'||v_rows end;
end
$fn$;

grant execute on function admin_list_help_requests(int,int) to authenticated;
grant execute on function admin_cv_signed_url(text,int) to authenticated;
grant execute on function admin_export_help_requests_csv(timestamptz,timestamptz) to authenticated;