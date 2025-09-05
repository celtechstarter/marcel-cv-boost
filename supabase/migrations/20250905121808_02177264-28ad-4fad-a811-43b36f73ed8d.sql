-- Security and Privacy Hardening Migration (Idempotent & Safe)

-- 1) Private bucket for CVs (create if missing)
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'cv_uploads') then
    insert into storage.buckets (id, name, public) values ('cv_uploads', 'cv_uploads', false);
  end if;
end$$;

-- 2) Metadata table for uploads (optional but useful)
create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  path text not null,
  size_bytes bigint,
  sha256 text,
  delete_after timestamptz,
  created_at timestamptz not null default now()
);

alter table uploads enable row level security;
-- No public policies -> access only via Edge Function (service role).

-- 3) Admin helper: short-lived signed URL to view private files
create or replace function admin_cv_signed_url(p_path text, p_expires_sec int default 600)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_url text;
begin
  if coalesce(p_path,'') = '' then return null; end if;
  select signed_url into v_url
  from storage.sign_url('cv_uploads', p_path, p_expires_sec);
  return v_url;
end $$;

grant execute on function admin_cv_signed_url(text,int) to authenticated;