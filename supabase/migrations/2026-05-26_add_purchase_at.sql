-- Mi Super · Where to buy
-- Apply: Supabase Dashboard → SQL Editor → paste and run.
-- Idempotent.

alter table public.items
  add column if not exists purchase_at text;

-- Suggested values: Costco, Sumesa, Walmart, City Market, La Comer,
-- Soriana, Mercado Roma, Carnicería, Tianguis, online, etc.
-- No enum: stay flexible.
