-- Mi Super · Structured units for items
-- Apply: Supabase Dashboard → SQL Editor → paste and run.
-- Dashboard: https://supabase.com/dashboard/project/ffkruigqwgzvqhdxvgjv/sql
-- Idempotent.

-- New columns let users record quantity as "<count> × <size> <unit>"
-- (e.g. 3 frascos de 250 g) instead of free-text. The legacy `qty` text
-- column stays so older rows still display correctly.

alter table public.items
  add column if not exists unit_count integer,
  add column if not exists unit_size  numeric,
  add column if not exists unit_type  text;

-- Suggested values for unit_type (no enum so we stay flexible):
--   weight   : mg, g, kg, oz, lb
--   volume   : ml, l, oz_fl, gal
--   discrete : pz, pkg, bolsa, lata, caja, botella
