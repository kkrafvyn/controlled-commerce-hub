export function toIsoFromDateTimeLocal(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export function hasScheduleStarted(startsAt: string | null | undefined, now = new Date()): boolean {
  if (!startsAt) {
    return true;
  }

  return new Date(startsAt).getTime() <= now.getTime();
}

export function hasScheduleEnded(endsAt: string | null | undefined, now = new Date()): boolean {
  if (!endsAt) {
    return false;
  }

  return new Date(endsAt).getTime() <= now.getTime();
}

export function validateScheduleRange(
  startsAt: string | null | undefined,
  endsAt: string | null | undefined,
): string | null {
  if (!startsAt || !endsAt) {
    return null;
  }

  if (new Date(startsAt).getTime() >= new Date(endsAt).getTime()) {
    return 'Start date must be before the end date.';
  }

  return null;
}

export function isFlashDealLive(
  product: {
    is_flash_deal?: boolean | null;
    flash_deal_starts_at?: string | null;
    flash_deal_ends_at?: string | null;
  },
  now = new Date(),
): boolean {
  if (!product.is_flash_deal) {
    return false;
  }

  return (
    hasScheduleStarted(product.flash_deal_starts_at, now) &&
    !hasScheduleEnded(product.flash_deal_ends_at, now)
  );
}

export function isGroupBuyLive(
  groupBuy: {
    starts_at?: string | null;
    expires_at: string;
    status?: string | null;
  },
  now = new Date(),
): boolean {
  if (groupBuy.status && groupBuy.status !== 'open') {
    return false;
  }

  return hasScheduleStarted(groupBuy.starts_at, now) && !hasScheduleEnded(groupBuy.expires_at, now);
}
