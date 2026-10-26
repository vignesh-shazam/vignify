-- Local baseline for the existing Vignify wallpapers table.
-- Reconstructed from the verified schema export.

begin;

create table public.wallpapers (
    id uuid primary key default gen_random_uuid(),
    creator_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text not null default '',
    image_path text not null unique,
    status text not null default 'pending',
    created_at timestamptz not null default now(),

    constraint wallpapers_description_check
        check (char_length(description) <= 1000),

    constraint wallpapers_status_check
        check (status = any (array['pending'::text, 'published'::text, 'rejected'::text])),

    constraint wallpapers_title_check
        check (char_length(title) between 1 and 100)
);

alter table public.wallpapers enable row level security;

create policy "Anyone can view published wallpapers"
on public.wallpapers
for select to authenticated, anon
using (status = 'published');

create policy "Creators can insert their own wallpapers"
on public.wallpapers
for insert to authenticated
with check (
    creator_id = auth.uid()
    and status = 'pending'
);

create policy "Creators can view their own submissions"
on public.wallpapers
for select to authenticated
using (creator_id = auth.uid());

commit;