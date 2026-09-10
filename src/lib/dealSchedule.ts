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

/** Convert an ISO timestamp into a value suitable for `<input type="datetime-local">`. */
export function toDateTimeLocalValue(value: string | Date | null | undefined): string {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export interface DealCountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUpcoming: boolean;
}

export function getDealCountdown(
  targetAt: string | null | undefined,
  nowInput: number = Date.now(),
): DealCountdownParts {
  if (!targetAt) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isUpcoming: false,
    };
  }

  const totalMs = new Date(targetAt).getTime() - nowInput;
  const clampedMs = Math.max(0, totalMs);
  const days = Math.floor(clampedMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clampedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((clampedMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((clampedMs % (1000 * 60)) / 1000);

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isExpired: totalMs <= 0,
    isUpcoming: totalMs > 0,
  };
}

export function formatDealCountdownLabel(
  targetAt: string | null | undefined,
  {
    endedLabel = 'Ended',
    prefix,
    compact = false,
  }: {
    endedLabel?: string;
    prefix?: string;
    compact?: boolean;
  } = {},
  nowInput: number = Date.now(),
): string {
  const countdown = getDealCountdown(targetAt, nowInput);
  if (!targetAt || countdown.isExpired) {
    return endedLabel;
  }

  let body: string;
  if (countdown.days > 0) {
    body = compact
      ? `${countdown.days}d ${countdown.hours}h`
      : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
  } else if (countdown.hours > 0) {
    body = compact
      ? `${countdown.hours}h ${countdown.minutes}m`
      : `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
  } else {
    body = `${countdown.minutes}m ${countdown.seconds}s`;
  }

  return prefix ? `${prefix} ${body}` : body;
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
