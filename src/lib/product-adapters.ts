import type { ProductWithDetails } from '@/hooks/useProducts';
import type { CartItem, Product, ProductVariant } from '@/types';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/image-upload';

function getShippingType(name?: string | null): Product['shippingOptions'][number]['type'] {
  const normalized = (name || '').toLowerCase();
  if (normalized.includes('sea')) return 'sea';
  if (normalized.includes('express')) return 'air_express';
  return 'air_normal';
}

export function toConsumerVariant(
  variant: Pick<ProductVariant, 'id' | 'price' | 'stock'> & {
    size?: string | null;
    color?: string | null;
    image_url?: string | null;
    shipping_prices?: Record<string, number>;
  },
): ProductVariant {
  return {
    id: variant.id,
    size: variant.size || undefined,
    color: variant.color || undefined,
    price: variant.price,
    stock: variant.stock || 0,
    image_url: variant.image_url || null,
    shipping_prices: variant.shipping_prices || {},
  };
}

export function toConsumerProduct(product: ProductWithDetails): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    category: product.category_name || 'Uncategorized',
    basePrice: product.base_price,
    images: product.images.length > 0 ? product.images : [PRODUCT_IMAGE_PLACEHOLDER],
    variants: product.variants.map(toConsumerVariant),
    shippingOptions: product.shipping_rules
      .filter((rule) => rule.is_allowed && rule.shipping_class)
      .map((rule) => ({
        id: rule.id,
        type: getShippingType(rule.shipping_class?.shipping_type?.name),
        name: rule.shipping_class?.name || '',
        details:
          rule.shipping_class?.description || rule.shipping_class?.shipping_type?.description || undefined,
        price: rule.price,
        estimatedDays: rule.shipping_class
          ? `${rule.shipping_class.estimated_days_min}-${rule.shipping_class.estimated_days_max} days`
          : '',
        available: true,
      })),
    isGroupBuyEligible: product.is_group_buy_eligible || false,
    isFlashDeal: product.is_flash_deal || false,
    isFreeShippingEligible: product.is_free_shipping || false,
    rating: product.rating || 0,
    reviewCount: product.review_count || 0,
  };
}

export function getProductDisplayPrice(product: Pick<Product, 'basePrice' | 'variants'>) {
  const variantPrices = product.variants
    .map((variant) => variant.price)
    .filter((price) => Number.isFinite(price));

  if (variantPrices.length === 0) {
    return { kind: 'single' as const, price: product.basePrice };
  }

  const minPrice = Math.min(...variantPrices);
  const maxPrice = Math.max(...variantPrices);

  if (minPrice === maxPrice) {
    return { kind: 'single' as const, price: minPrice };
  }

  return { kind: 'range' as const, minPrice, maxPrice };
}

export function refreshCartItemFromCatalog(
  item: CartItem,
  catalogProduct: ProductWithDetails,
): CartItem {
  const product = toConsumerProduct(catalogProduct);
  const catalogVariant = product.variants.find((variant) => variant.id === item.variant.id);

  if (!catalogVariant) {
    return {
      ...item,
      product,
      variant: {
        ...item.variant,
        shipping_prices: item.variant.shipping_prices || {},
      },
    };
  }

  return {
    ...item,
    product,
    variant: {
      ...item.variant,
      ...catalogVariant,
      shipping_prices: catalogVariant.shipping_prices || {},
    },
  };
}
