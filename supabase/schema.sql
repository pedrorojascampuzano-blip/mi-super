-- Mi Super: schema for shared groups
-- Run once in Supabase SQL Editor (https://app.supabase.com → your project → SQL).

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        text not null unique,
  created_at  timestamptz default now()
);

create table if not exists group_members (
  group_id    uuid references groups(id) on delete cascade,
  member_id   uuid not null,
  nickname    text not null,
  joined_at   timestamptz default now(),
  primary key (group_id, member_id)
);

create table if not exists items (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid references groups(id) on delete cascade not null,
  name          text not null,
  places        text[] default array['General'],
  category      text default 'Otros',
  status        text default 'needed' check (status in ('needed','cart','stocked','inactive')),
  is_essential  boolean default false,
  last_bought   date,
  qty           text default '',
  price         numeric,
  expiry        date,
  updated_by    uuid,
  updated_at    timestamptz default now()
);

create index if not exists items_group_idx on items (group_id);

create table if not exists saved_tags (
  group_id    uuid references groups(id) on delete cascade,
  tag         text not null,
  primary key (group_id, tag)
);

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────

alter table groups        enable row level security;
alter table group_members enable row level security;
alter table items         enable row level security;
alter table saved_tags    enable row level security;

create or replace function is_group_member(g uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from group_members
    where group_id = g and member_id = auth.uid()
  )
$$;

drop policy if exists "members can view their groups" on groups;
create policy "members can view their groups" on groups
  for select using (is_group_member(id));

drop policy if exists "members can view their group members" on group_members;
create policy "members can view their group members" on group_members
  for select using (is_group_member(group_id));

drop policy if exists "users can leave groups" on group_members;
create policy "users can leave groups" on group_members
  for delete using (member_id = auth.uid());

drop policy if exists "members can read items" on items;
create policy "members can read items" on items
  for select using (is_group_member(group_id));

drop policy if exists "members can insert items" on items;
create policy "members can insert items" on items
  for insert with check (is_group_member(group_id));

drop policy if exists "members can update items" on items;
create policy "members can update items" on items
  for update using (is_group_member(group_id));

drop policy if exists "members can delete items" on items;
create policy "members can delete items" on items
  for delete using (is_group_member(group_id));

drop policy if exists "members can read tags" on saved_tags;
create policy "members can read tags" on saved_tags
  for select using (is_group_member(group_id));

drop policy if exists "members can write tags" on saved_tags;
create policy "members can write tags" on saved_tags
  for insert with check (is_group_member(group_id));

drop policy if exists "members can delete tags" on saved_tags;
create policy "members can delete tags" on saved_tags
  for delete using (is_group_member(group_id));

-- ─────────────────────────────────────────────────────────────
-- RPCs (security definer — bypass RLS for join/create flows)
-- ─────────────────────────────────────────────────────────────

create or replace function create_group(p_name text, p_nickname text)
returns table(group_id uuid, code text)
language plpgsql
security definer
as $$
declare
  g_id   uuid;
  g_code text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  -- 8-char alphanumeric code (≈ 2.8 trillion combos)
  g_code := upper(substr(encode(gen_random_bytes(6), 'base64'), 1, 8));
  g_code := regexp_replace(g_code, '[^A-Z0-9]', 'X', 'g');
  insert into groups (name, code) values (p_name, g_code)
    returning id into g_id;
  insert into group_members (group_id, member_id, nickname)
    values (g_id, auth.uid(), p_nickname);
  return query select g_id, g_code;
end $$;

create or replace function join_group(p_code text, p_nickname text)
returns uuid
language plpgsql
security definer
as $$
declare
  g_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  select id into g_id from groups where code = upper(p_code);
  if g_id is null then
    raise exception 'group not found';
  end if;
  insert into group_members (group_id, member_id, nickname)
    values (g_id, auth.uid(), p_nickname)
    on conflict (group_id, member_id)
      do update set nickname = excluded.nickname;
  return g_id;
end $$;

-- ─────────────────────────────────────────────────────────────
-- Trigger: stamp updated_by + updated_at on every write to items
-- ─────────────────────────────────────────────────────────────

create or replace function set_item_meta() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end $$;

drop trigger if exists items_meta on items;
create trigger items_meta
  before insert or update on items
  for each row execute function set_item_meta();

-- ─────────────────────────────────────────────────────────────
-- Realtime publication
-- ─────────────────────────────────────────────────────────────

alter publication supabase_realtime add table items;
alter publication supabase_realtime add table saved_tags;
alter publication supabase_realtime add table group_members;
