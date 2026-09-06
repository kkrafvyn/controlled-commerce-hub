import type { Json } from '@/integrations/supabase/types';

export interface DeliveryAddress {
  full_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string | null;
  city?: string;
  state?: string | null;
  postal_code?: string | null;
  country?: string;
  label?: string | null;
}

export interface DeliveryShippingMethod {
  name?: string;
  price?: number;
  estimated_days_min?: number;
  estimated_days_max?: number;
}

export interface ParsedDeliveryDetails {
  address: DeliveryAddress | null;
  shippingMethod: DeliveryShippingMethod | null;
  shippingPaymentDeferred: boolean;
  estimatedShippingPrice: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseDeliveryDetails(value: Json | null | undefined): ParsedDeliveryDetails {
  if (!isRecord(value)) {
    return {
      address: null,
      shippingMethod: null,
      shippingPaymentDeferred: false,
      estimatedShippingPrice: null,
    };
  }

  const shippingMethodRecord = isRecord(value.shipping_method) ? value.shipping_method : null;
  const shippingMethod = shippingMethodRecord
    ? {
        name: readString(shippingMethodRecord.name),
        price: readNumber(shippingMethodRecord.price) ?? undefined,
        estimated_days_min: readNumber(shippingMethodRecord.estimated_days_min) ?? undefined,
        estimated_days_max: readNumber(shippingMethodRecord.estimated_days_max) ?? undefined,
      }
    : null;

  const address: DeliveryAddress = {
    full_name: readString(value.full_name),
    phone: readString(value.phone),
    address_line1: readString(value.address_line1),
    address_line2: readString(value.address_line2) ?? null,
    city: readString(value.city),
    state: readString(value.state) ?? null,
    postal_code: readString(value.postal_code) ?? null,
    country: readString(value.country),
    label: readString(value.label) ?? null,
  };

  const hasAddress = Boolean(
    address.full_name ||
      address.phone ||
      address.address_line1 ||
      address.city ||
      address.country,
  );

  return {
    address: hasAddress ? address : null,
    shippingMethod,
    shippingPaymentDeferred: value.shipping_payment_deferred === true,
    estimatedShippingPrice: readNumber(value.estimated_shipping_price),
  };
}

export function formatDeliveryAddressLines(address: DeliveryAddress): string[] {
  const locality = [address.city, address.state, address.postal_code].filter(Boolean).join(', ');
  const lines = [
    address.full_name,
    address.phone ? `Phone: ${address.phone}` : null,
    address.address_line1,
    address.address_line2,
    locality || null,
    address.country,
  ].filter((line): line is string => Boolean(line));

  return lines;
}

export function formatDeliveryAddressInline(address: DeliveryAddress): string {
  return [
    address.full_name,
    address.address_line1,
    address.city,
    address.country,
    address.phone ? `(${address.phone})` : null,
  ]
    .filter(Boolean)
    .join(', ');
}

export function formatShippingMethodLabel(
  shippingMethod: DeliveryShippingMethod | null,
  formatPrice?: (amount: number) => string,
): string | null {
  if (!shippingMethod?.name) {
    return null;
  }

  const days =
    shippingMethod.estimated_days_min != null && shippingMethod.estimated_days_max != null
      ? ` (${shippingMethod.estimated_days_min}-${shippingMethod.estimated_days_max} days)`
      : '';

  const price =
    shippingMethod.price != null && shippingMethod.price > 0 && formatPrice
      ? ` - ${formatPrice(shippingMethod.price)}`
      : '';

  return `${shippingMethod.name}${days}${price}`;
}
