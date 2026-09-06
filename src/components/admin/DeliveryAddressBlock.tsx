import { MapPin } from 'lucide-react';
import {
  formatDeliveryAddressLines,
  formatShippingMethodLabel,
  parseDeliveryDetails,
  type DeliveryAddress,
} from '@/lib/shippingAddressDisplay';
import type { Json } from '@/integrations/supabase/types';

interface DeliveryAddressBlockProps {
  value: Json | null | undefined;
  formatPrice?: (amount: number) => string;
  compact?: boolean;
  emptyLabel?: string;
  className?: string;
}

export function DeliveryAddressBlock({
  value,
  formatPrice,
  compact = false,
  emptyLabel = 'No delivery address provided',
  className = '',
}: DeliveryAddressBlockProps) {
  const details = parseDeliveryDetails(value);
  const shippingLabel = formatShippingMethodLabel(details.shippingMethod, formatPrice);

  if (!details.address) {
    return <p className={`text-sm text-muted-foreground ${className}`}>{emptyLabel}</p>;
  }

  const lines = formatDeliveryAddressLines(details.address);

  if (compact) {
    return (
      <div className={`space-y-1 text-sm ${className}`}>
        <p className="font-medium text-foreground">{lines[0]}</p>
        {lines.slice(1).map((line) => (
          <p key={line} className="text-muted-foreground">
            {line}
          </p>
        ))}
        {shippingLabel ? <p className="text-xs text-primary">{shippingLabel}</p> : null}
        {details.shippingPaymentDeferred ? (
          <p className="text-xs text-amber-600">
            Shipping deferred
            {details.estimatedShippingPrice != null && formatPrice
              ? ` (est. ${formatPrice(details.estimatedShippingPrice)})`
              : ''}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-muted/40 p-3 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Delivery Address</p>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        {lines.map((line) => (
          <p key={line} className={line.startsWith('Phone:') ? '' : 'text-foreground'}>
            {line}
          </p>
        ))}
      </div>
      {shippingLabel ? (
        <p className="mt-2 text-xs font-medium text-primary">Shipping: {shippingLabel}</p>
      ) : null}
      {details.shippingPaymentDeferred ? (
        <p className="mt-1 text-xs text-amber-600">
          Shipping payment deferred
          {details.estimatedShippingPrice != null && formatPrice
            ? ` (estimated ${formatPrice(details.estimatedShippingPrice)})`
            : ''}
        </p>
      ) : null}
    </div>
  );
}

export function hasDeliveryAddress(value: Json | null | undefined): value is Json {
  return parseDeliveryDetails(value).address !== null;
}

export function getDeliveryAddress(value: Json | null | undefined): DeliveryAddress | null {
  return parseDeliveryDetails(value).address;
}
