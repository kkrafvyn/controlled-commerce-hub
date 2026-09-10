import { formatDealCountdownLabel, getDealCountdown } from '@/lib/dealSchedule';

interface GroupBuyCountdown {
  totalMs: number;
  totalMinutes: number;
  totalHours: number;
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
}

interface ExtendabilityInput {
  currentParticipants: number | null;
  expiresAt: string;
  extensionUsed: boolean | null | undefined;
  minParticipants: number;
  status: string | null;
}

interface LeaveWindowInput {
  currentParticipants: number | null;
  joinedAt: string;
  minParticipants: number;
  status: string | null;
}

interface GroupBuyDisplayStatusInput {
  currentParticipants: number | null;
  expiresAt: string;
  minParticipants: number;
  status: string | null;
}

export type GroupBuyDisplayStatus = 'open' | 'filled' | 'expired' | 'cancelled' | 'closed';

export function getGroupBuyCountdown(
  expiresAt: string,
  nowInput: number = Date.now(),
): GroupBuyCountdown {
  const countdown = getDealCountdown(expiresAt, nowInput);
  const totalMinutes = Math.floor(Math.max(0, countdown.totalMs) / (1000 * 60));
  const totalHours = Math.floor(Math.max(0, countdown.totalMs) / (1000 * 60 * 60));

  return {
    totalMs: countdown.totalMs,
    totalMinutes,
    totalHours,
    days: countdown.days,
    hours: countdown.hours,
    minutes: countdown.minutes,
    isExpired: countdown.isExpired,
  };
}

export function formatGroupBuyTimeRemaining(expiresAt: string, nowInput: number = Date.now()): string {
  const label = formatDealCountdownLabel(
    expiresAt,
    { endedLabel: 'Expired', compact: true },
    nowInput,
  );

  return label === 'Expired' ? label : `${label} left`;
}

export function getGroupBuyDisplayStatus({
  currentParticipants,
  expiresAt,
  minParticipants,
  status,
}: GroupBuyDisplayStatusInput): GroupBuyDisplayStatus {
  const normalizedStatus = status?.toLowerCase() || 'open';

  if (normalizedStatus === 'cancelled') {
    return 'cancelled';
  }

  if ((currentParticipants || 0) >= minParticipants) {
    return 'filled';
  }

  if (getGroupBuyCountdown(expiresAt).isExpired) {
    return 'expired';
  }

  if (normalizedStatus === 'closed') {
    return 'closed';
  }

  return 'open';
}

export function getGroupBuyStatusLabel(input: GroupBuyDisplayStatusInput): string {
  const displayStatus = getGroupBuyDisplayStatus(input);

  switch (displayStatus) {
    case 'filled':
      return 'Filled';
    case 'expired':
      return 'Expired';
    case 'cancelled':
      return 'Cancelled';
    case 'closed':
      return 'Closed';
    default:
      return formatGroupBuyTimeRemaining(input.expiresAt);
  }
}

export function canExtendGroupBuy({
  currentParticipants,
  expiresAt,
  extensionUsed,
  minParticipants,
  status,
}: ExtendabilityInput): boolean {
  if (status !== 'open' || extensionUsed) {
    return false;
  }

  if ((currentParticipants || 0) >= minParticipants) {
    return false;
  }

  const countdown = getGroupBuyCountdown(expiresAt);
  return !countdown.isExpired && countdown.totalMinutes <= 60;
}

export function getLeaveWindowInfo({
  currentParticipants,
  joinedAt,
  minParticipants,
  status,
}: LeaveWindowInput) {
  const leaveDeadline = new Date(joinedAt).getTime() + (60 * 60 * 1000);
  const remainingMs = leaveDeadline - Date.now();
  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)));
  const isGoalAlreadyMet = (currentParticipants || 0) >= minParticipants;
  const canLeave = status === 'open' && !isGoalAlreadyMet && remainingMs > 0;

  return {
    canLeave,
    remainingMinutes,
    leaveDeadline,
  };
}
