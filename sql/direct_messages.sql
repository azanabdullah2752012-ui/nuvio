-- ──────────────────────────────────────────────────────────────────────────
-- Direct Messages Table
-- Run this once in your Supabase SQL editor (Dashboard → SQL Editor)
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists direct_messages (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz default now()
);

-- Index for fast conversation queries
create index if not exists idx_dm_sender    on direct_messages(sender_id);
create index if not exists idx_dm_recipient on direct_messages(recipient_id);
create index if not exists idx_dm_created   on direct_messages(created_at desc);

-- RLS: users can only see messages they're part of
alter table direct_messages enable row level security;

drop policy if exists "dm_select_own" on direct_messages;
create policy "dm_select_own"
  on direct_messages for select
  using (sender_id = auth.uid() or recipient_id = auth.uid());

drop policy if exists "dm_insert_own" on direct_messages;
create policy "dm_insert_own"
  on direct_messages for insert
  with check (sender_id = auth.uid());

-- Realtime: enable for live chat
alter publication supabase_realtime add table direct_messages;
