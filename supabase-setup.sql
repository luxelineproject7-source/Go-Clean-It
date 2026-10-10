-- Go Clean It (prototype): shared storage so every phone sees the same reports.
-- Run this once in Supabase > SQL Editor > New query > Run.
--
-- PROTOTYPE ONLY: anyone holding the public (anon) key can read and write this table.
-- Do not store real personal data here. The production design in docs/BLUEPRINT.md
-- uses row-level security per role and SQL functions instead of open access.

create table if not exists public.items (
  kind text not null,                 -- 'report' | 'log' | 'user'
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);

alter table public.items enable row level security;

drop policy if exists demo_read   on public.items;
drop policy if exists demo_insert on public.items;
drop policy if exists demo_update on public.items;
drop policy if exists demo_delete on public.items;
create policy demo_read   on public.items for select to anon using (true);
create policy demo_insert on public.items for insert to anon with check (true);
create policy demo_update on public.items for update to anon using (true) with check (true);
create policy demo_delete on public.items for delete to anon using (true);

grant select, insert, update, delete on public.items to anon;
