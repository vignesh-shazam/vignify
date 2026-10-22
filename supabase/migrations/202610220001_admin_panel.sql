-- Review this migration in staging before production. Existing project policies may differ.
begin;

alter table public.wallpapers add column if not exists deleted_at timestamptz;
alter table public.wallpapers add column if not exists deleted_by uuid references auth.users(id);
alter table public.wallpapers add column if not exists deletion_reason text;
alter table public.wallpapers add column if not exists reviewed_at timestamptz;
alter table public.wallpapers add column if not exists reviewed_by uuid references auth.users(id);
alter table public.wallpapers add column if not exists rejection_reason text;

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.admin_audit_logs enable row level security;

-- Only the trusted server-set app_metadata role can read the full admin queue.
drop policy if exists "Admins can view all wallpapers" on public.wallpapers;
create policy "Admins can view all wallpapers" on public.wallpapers
for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Creators can still see their own uploads, but soft-deleted records are not public.
drop policy if exists "Anyone can view published wallpapers" on public.wallpapers;
create policy "Anyone can view published wallpapers" on public.wallpapers
for select to anon, authenticated
using (status = 'published' and deleted_at is null);

-- Admin audit log reading is owner-only. No client INSERT/UPDATE/DELETE policies are added.
create policy "Admins can read audit logs" on public.admin_audit_logs
for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.admin_moderate_wallpaper(p_wallpaper_id uuid, p_action text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_row public.wallpapers%rowtype;
  v_status text;
  v_deleted_at timestamptz;
begin
  if v_actor is null or (auth.jwt() -> 'app_metadata' ->> 'role') is distinct from 'admin' then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_action not in ('publish','reject','unpublish','soft-delete','recover') then
    raise exception 'Invalid moderation action' using errcode = '22023';
  end if;
  select * into v_row from public.wallpapers where id = p_wallpaper_id for update;
  if not found then raise exception 'Wallpaper not found' using errcode = 'P0002'; end if;

  if p_action = 'publish' then
    update public.wallpapers set status='published', deleted_at=null, deleted_by=null, deletion_reason=null, reviewed_at=now(), reviewed_by=v_actor, rejection_reason=null where id=p_wallpaper_id returning * into v_row;
  elsif p_action = 'reject' then
    update public.wallpapers set status='rejected', reviewed_at=now(), reviewed_by=v_actor, rejection_reason=coalesce(rejection_reason,'Rejected by admin') where id=p_wallpaper_id returning * into v_row;
  elsif p_action = 'unpublish' then
    update public.wallpapers set status='pending', reviewed_at=now(), reviewed_by=v_actor where id=p_wallpaper_id returning * into v_row;
  elsif p_action = 'soft-delete' then
    update public.wallpapers set deleted_at=now(), deleted_by=v_actor, deletion_reason='Soft-deleted by admin' where id=p_wallpaper_id and deleted_at is null returning * into v_row;
    if not found then raise exception 'Wallpaper is already deleted' using errcode = 'P0001'; end if;
  elsif p_action = 'recover' then
    update public.wallpapers set deleted_at=null, deleted_by=null, deletion_reason=null where id=p_wallpaper_id and deleted_at is not null returning * into v_row;
    if not found then raise exception 'Wallpaper is not deleted' using errcode = 'P0001'; end if;
  end if;

  insert into public.admin_audit_logs(actor_id,action,entity_type,entity_id,details)
  values(v_actor,p_action,'wallpaper',p_wallpaper_id,jsonb_build_object('title',v_row.title,'status',v_row.status,'deleted_at',v_row.deleted_at));
  return jsonb_build_object('id',v_row.id,'title',v_row.title,'status',v_row.status,'deleted_at',v_row.deleted_at);
end;
$$;
revoke all on function public.admin_moderate_wallpaper(uuid,text) from public;
grant execute on function public.admin_moderate_wallpaper(uuid,text) to authenticated;

commit;
