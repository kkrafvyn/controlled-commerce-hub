ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS shipping_prices jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.product_variants.shipping_prices IS
  'Per-variant shipping prices keyed by shipping_class_id. Empty object uses product-level shipping rules.';
