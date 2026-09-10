-- Dedicated flash-sale price (mirrors group_buy_price pattern).
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS flash_deal_price numeric(12, 2);

COMMENT ON COLUMN public.products.flash_deal_price IS
  'Sale price charged while a flash deal is live; falls back to base_price when null.';

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_flash_deal_price_non_negative;

ALTER TABLE public.products
  ADD CONSTRAINT products_flash_deal_price_non_negative
  CHECK (flash_deal_price IS NULL OR flash_deal_price >= 0);
