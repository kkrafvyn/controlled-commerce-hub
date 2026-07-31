import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/integrations/supabase/types';

type VariantRow = Database['public']['Tables']['product_variants']['Row'];

const VARIANT_COLUMNS_WITHOUT_SHIPPING =
  'id, product_id, size, color, price_override, stock, sku, variant_image_url, is_active, created_at, updated_at';

export function isMissingShippingPricesColumnError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /shipping_prices/i.test(message) && /(column|schema cache|does not exist)/i.test(message);
}

type FetchProductVariantsOptions = {
  productId?: string;
  productIds?: string[];
  activeOnly?: boolean;
};

export async function fetchProductVariants(
  supabase: SupabaseClient<Database>,
  options: FetchProductVariantsOptions = {},
): Promise<VariantRow[]> {
  const buildQuery = (select: string) => {
    let query = supabase.from('product_variants').select(select);

    if (options.productId) {
      query = query.eq('product_id', options.productId);
    }

    if (options.productIds?.length) {
      query = query.in('product_id', options.productIds);
    }

    if (options.activeOnly) {
      query = query.eq('is_active', true);
    }

    return query;
  };

  const fullResult = await buildQuery('*');
  if (!fullResult.error) {
    return fullResult.data || [];
  }

  if (!isMissingShippingPricesColumnError(fullResult.error)) {
    throw fullResult.error;
  }

  const fallbackResult = await buildQuery(VARIANT_COLUMNS_WITHOUT_SHIPPING);
  if (fallbackResult.error) {
    throw fallbackResult.error;
  }

  return (fallbackResult.data || []).map((variant) => ({
    ...variant,
    shipping_prices: {},
  })) as VariantRow[];
}
