-- Mi Super · Item photos
-- Apply: Supabase Dashboard → SQL Editor → paste and run.
-- Dashboard: https://supabase.com/dashboard/project/ffkruigqwgzvqhdxvgjv/sql
-- Idempotent: safe to re-run.

-- 1. Add photo_url column to items
alter table public.items
  add column if not exists photo_url text;

-- 2. Create public storage bucket for item photos (5 MB file limit, common image types)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'item-photos',
  'item-photos',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 3. RLS policies on storage.objects for the bucket
-- Anyone (anon + authenticated) can read (bucket is public anyway, this is belt-and-suspenders).
drop policy if exists "item-photos public read" on storage.objects;
create policy "item-photos public read" on storage.objects
  for select using (bucket_id = 'item-photos');

-- Only authenticated users can upload.
drop policy if exists "item-photos auth upload" on storage.objects;
create policy "item-photos auth upload" on storage.objects
  for insert with check (
    bucket_id = 'item-photos'
    and auth.role() = 'authenticated'
  );

-- Only the uploader can update/delete their own files.
drop policy if exists "item-photos owner update" on storage.objects;
create policy "item-photos owner update" on storage.objects
  for update using (
    bucket_id = 'item-photos'
    and auth.uid() = owner
  );

drop policy if exists "item-photos owner delete" on storage.objects;
create policy "item-photos owner delete" on storage.objects
  for delete using (
    bucket_id = 'item-photos'
    and auth.uid() = owner
  );

-- 4. Realtime: items publication already exists, no extra step needed (column is auto-included).
