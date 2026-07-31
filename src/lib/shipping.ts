export function parseShippingPrices(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, price]) => price != null && price !== '')
      .map(([shippingClassId, price]) => [shippingClassId, Number(price) || 0]),
  );
}

export function serializeShippingPrices(
  prices: Record<string, string> | undefined,
): Record<string, number> {
  if (!prices) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(prices)
      .filter(([, price]) => price.trim() !== '')
      .map(([shippingClassId, price]) => [shippingClassId, parseFloat(price) || 0]),
  );
}

export function formatShippingPricesForForm(
  prices: Record<string, number> | null | undefined,
): Record<string, string> {
  if (!prices) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(prices).map(([shippingClassId, price]) => [shippingClassId, String(price)]),
  );
}

export function hasIndividualVariantShipping(
  variants: Array<{ shipping_prices?: Record<string, string> }>,
): boolean {
  return variants.some((variant) =>
    Object.values(variant.shipping_prices || {}).some((price) => price.trim() !== ''),
  );
}

export function resolveVariantShippingPrice(
  variantShippingPrices: Record<string, number> | undefined,
  shippingClassId: string,
  productShippingPrice: number,
): number {
  const override = variantShippingPrices?.[shippingClassId];
  if (override != null && Number.isFinite(Number(override))) {
    return Number(override);
  }

  return productShippingPrice;
}

export function buildVariantLabel(color?: string | null, size?: string | null) {
  const label = [color, size].filter(Boolean).join(' / ');
  return label || 'Default variant';
}
