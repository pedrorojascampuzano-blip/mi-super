-- Mi Super · Expiry strictness
-- Apply: Supabase Dashboard → SQL Editor → paste and run.
-- Idempotent.
--
-- Distinguishes hard expiry (food-safety risk if eaten past date — meat,
-- dairy, fresh bread, opened mayo) from "best before" hints (spices,
-- flours, vinegars, oils, honey, salt, sugar, sealed sauces) so we don't
-- toss food that's still perfectly fine.
--
-- Values:
--   'strict'      — actually unsafe past expiry
--   'best_before' — date is a quality suggestion, not safety
--   NULL          — not classified yet

alter table public.items
  add column if not exists expiry_type text;

alter table public.items
  drop constraint if exists items_expiry_type_check;

alter table public.items
  add constraint items_expiry_type_check
  check (expiry_type is null or expiry_type in ('strict', 'best_before'));
