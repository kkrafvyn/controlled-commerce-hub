-- Turn on pay-shipping-later for group buy and flash sale checkouts by default.

INSERT INTO public.store_settings (key, value)
VALUES
  ('deferShippingPaymentGroupBuyEnabled', 'true'::jsonb),
  ('deferShippingPaymentFlashSaleEnabled', 'true'::jsonb)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();
