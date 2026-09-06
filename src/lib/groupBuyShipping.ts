import type { GroupBuyVariantSelection } from '@/lib/groupBuySelections';
import { parseShippingPrices, resolveVariantShippingPrice } from '@/lib/shipping';

export interface GroupBuyShippingRule {
  shipping_class_id: string;
  price: number | null;
  shipping_classes: {
    name: string;
    base_price: number | null;
    estimated_days_min: number;
    estimated_days_max: number;
  } | null;
}

export interface GroupBuyVariantWithShipping {
  id: string;
  shipping_prices?: Record<string, number> | null;
}

export interface GroupBuyAddressPayload {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  country: string;
  shipping_method: {
    id: string;
    name: string;
    price: number;
    estimated_days_min: number;
    estimated_days_max: number;
  } | null;
  shipping_payment_deferred: boolean;
  estimated_shipping_price: number | null;
  shipping_price_paid: number | null;
}

interface GroupBuyAddressInput {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  country: string;
}

export function resolveGroupBuyShippingCost({
  shippingRule,
  variantSelections,
  variants,
  totalQuantity,
  shippingFeeOverride,
  isFreeShipping = false,
}: {
  shippingRule: GroupBuyShippingRule | null;
  variantSelections: GroupBuyVariantSelection[];
  variants: GroupBuyVariantWithShipping[];
  totalQuantity: number;
  shippingFeeOverride: number | null;
  isFreeShipping?: boolean;
}): number {
  if (isFreeShipping || !shippingRule) {
    return 0;
  }

  if (shippingFeeOverride != null) {
    return shippingFeeOverride;
  }

  const shippingClassId = shippingRule.shipping_class_id;
  const productShippingPrice = Number(
    shippingRule.price ?? shippingRule.shipping_classes?.base_price ?? 0,
  );

  if (variantSelections.length > 0) {
    return variantSelections.reduce((sum, selection) => {
      const variant = variants.find((item) => item.id === selection.variantId);
      const unitShipping = resolveVariantShippingPrice(
        parseShippingPrices(variant?.shipping_prices),
        shippingClassId,
        productShippingPrice,
      );

      return sum + unitShipping * selection.quantity;
    }, 0);
  }

  return productShippingPrice * Math.max(1, totalQuantity);
}

export function buildGroupBuyAddressPayload(
  address: GroupBuyAddressInput | null,
  shippingRule: GroupBuyShippingRule | null,
  {
    effectiveShippingCost,
    deferShippingPayment,
  }: {
    effectiveShippingCost: number;
    deferShippingPayment: boolean;
  },
): GroupBuyAddressPayload | null {
  if (!address) {
    return null;
  }

  return {
    full_name: address.full_name,
    phone: address.phone,
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    city: address.city,
    state: address.state,
    country: address.country,
    shipping_method: shippingRule?.shipping_classes
      ? {
          id: shippingRule.shipping_class_id,
          name: shippingRule.shipping_classes.name,
          price: effectiveShippingCost,
          estimated_days_min: shippingRule.shipping_classes.estimated_days_min,
          estimated_days_max: shippingRule.shipping_classes.estimated_days_max,
        }
      : null,
    shipping_payment_deferred: deferShippingPayment,
    estimated_shipping_price: deferShippingPayment ? effectiveShippingCost : null,
    shipping_price_paid: deferShippingPayment ? null : effectiveShippingCost,
  };
}

export function readGroupBuyShippingPaymentInfo(shippingAddress: unknown): {
  shippingPaymentDeferred: boolean;
  estimatedShippingPrice: number;
  shippingPricePaid: number;
} {
  if (!shippingAddress || typeof shippingAddress !== 'object' || Array.isArray(shippingAddress)) {
    return {
      shippingPaymentDeferred: false,
      estimatedShippingPrice: 0,
      shippingPricePaid: 0,
    };
  }

  const address = shippingAddress as Record<string, unknown>;
  const method = address.shipping_method as { price?: number } | null | undefined;
  const methodPrice = Number(method?.price ?? 0);
  const deferred = address.shipping_payment_deferred === true;
  const estimated = Number(address.estimated_shipping_price ?? methodPrice);
  const paid = deferred ? 0 : Number(address.shipping_price_paid ?? methodPrice);

  return {
    shippingPaymentDeferred: deferred,
    estimatedShippingPrice: Number.isFinite(estimated) ? estimated : 0,
    shippingPricePaid: Number.isFinite(paid) ? paid : 0,
  };
}

export function buildGroupBuyShippingTotalRow({
  effectiveShippingCost,
  deferShippingPayment,
  deferShippingEnabled,
  isFreeShipping,
  formatPrice,
}: {
  effectiveShippingCost: number;
  deferShippingPayment: boolean;
  deferShippingEnabled: boolean;
  isFreeShipping: boolean;
  formatPrice: (amount: number) => string;
}): { label: string; value: string } {
  const isDeferred =
    deferShippingPayment && deferShippingEnabled && effectiveShippingCost > 0;

  return {
    label: isDeferred ? 'Shipping (pay later)' : 'Shipping',
    value: isFreeShipping
      ? 'FREE'
      : isDeferred
        ? `Due later (est. ${formatPrice(effectiveShippingCost)})`
        : formatPrice(effectiveShippingCost),
  };
}
