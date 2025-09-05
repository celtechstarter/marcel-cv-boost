-- 1) Ensure bookings.status supports the required states
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='bookings' and column_name='status'
  ) then
    begin
      alter table bookings drop constraint if exists bookings_status_check;
    exception when undefined_object then
      null;
    end;
    alter table bookings
      add constraint bookings_status_check
      check (status in ('neu','bestaetigt','abgelehnt','abgesagt'));
  end if;
end$$;

-- 2) Public helper: compute monthly slot state from confirmed bookings only
create or replace function public_get_slot_state(p_year int, p_month int)
returns table(
  year int,
  month int,
  max_slots int,
  used_slots int,
  remaining int
)
language sql
stable
security definer
set search_path = public
as $$
  with cfg as (
    select coalesce(
      (select m.max_slots from monthly_free_slots m
        where m.year = p_year and m.month = p_month),
      5
    ) as max_slots
  ),
  used as (
    select count(*)::int as used_slots
    from bookings b
    where b.status = 'bestaetigt'
      and date_part('year',  b.starts_at) = p_year
      and date_part('month', b.starts_at) = p_month
  )
  select
    p_year::int  as year,
    p_month::int as month,
    cfg.max_slots,
    coalesce(used.used_slots,0) as used_slots,
    greatest(cfg.max_slots - coalesce(used.used_slots,0), 0) as remaining
  from cfg cross join used;
$$;

grant execute on function public_get_slot_state(int,int) to anon, authenticated;

-- 3) Admin RPCs: approve/reject controls slot usage
create or replace function admin_approve_booking(p_booking_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_starts timestamptz;
  v_y int;
  v_m int;
  v_state record;
begin
  select starts_at into v_starts from bookings where id = p_booking_id for update;
  if v_starts is null then
    raise exception 'Booking not found';
  end if;

  v_y := extract(year from v_starts)::int;
  v_m := extract(month from v_starts)::int;

  select * into v_state from public_get_slot_state(v_y, v_m);
  if v_state.remaining <= 0 then
    raise exception 'Keine freien Slots mehr in diesem Monat.';
  end if;

  update bookings
     set status = 'bestaetigt'
   where id = p_booking_id;

  return true;
end $$;

create or replace function admin_reject_booking(p_booking_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  update bookings
     set status = 'abgelehnt'
   where id = p_booking_id;
  select true;
$$;

grant execute on function admin_approve_booking(uuid) to authenticated;
grant execute on function admin_reject_booking(uuid)  to authenticated;