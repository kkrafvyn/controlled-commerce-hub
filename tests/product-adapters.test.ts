import { describe, expect, it } from 'vitest';

import { getProductDisplayPrice, toConsumerProduct } from '@/lib/product-adapters';
import type { ProductWithDetails } from '@/hooks/useProducts';

const baseProduct: ProductWithDetails = {
  id: 'product-1',
  name: 'Sample',
  description: 'Desc',
  item_code: 'CODE',
  product_number: null,
  base_price: 100,
  group_buy_price: null,
  is_group_buy_eligible: false,
  is_flash_deal: false,
  is_free_shipping: false,
  is_active: true,
  expected_restock_date: null,
  is_fragile: false,
  reinforced_packaging_cost: null,
  allow_standard_packaging: true,
  allow_reinforced_packaging: true,
  rating: null,
  review_count: null,
  recommendation_score: 0,
  recommendation_order_count: 0,
  recommendation_cart_count: 0,
  recommendation_revenue_score: 0,
  category_id: null,
  category_name: 'Shoes',
  images: ['/image.jpg'],
  variants: [
    {
      id: 'variant-1',
      size: 'M',
      color: 'Black',
      price: 120,
      stock: 5,
      sku: null,
      image_url: null,
      shipping_prices: { 'class-1': 15 },
    },
  ],
  shipping_rules: [],
};

describe('product adapters', () => {
  it('maps variant shipping prices into consumer products', () => {
    const product = toConsumerProduct(baseProduct);

    expect(product.variants[0].shipping_prices).toEqual({ 'class-1': 15 });
    expect(product.variants[0].price).toBe(120);
  });

  it('returns a price range when variants differ', () => {
    const product = toConsumerProduct({
      ...baseProduct,
      variants: [
        { ...baseProduct.variants[0], price: 90 },
        { ...baseProduct.variants[0], id: 'variant-2', price: 130 },
      ],
    });

    expect(getProductDisplayPrice(product)).toEqual({
      kind: 'range',
      minPrice: 90,
      maxPrice: 130,
    });
  });
});
