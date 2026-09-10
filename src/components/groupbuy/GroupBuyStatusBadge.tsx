import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DealCountdown } from '@/components/shared/DealCountdown';
import { getGroupBuyDisplayStatus, type GroupBuyDisplayStatus } from '@/lib/groupBuyTiming';

interface GroupBuyStatusBadgeProps {
  currentParticipants: number | null;
  expiresAt: string;
  minParticipants: number;
  status: string | null;
}

export function GroupBuyStatusBadge({
  currentParticipants,
  expiresAt,
  minParticipants,
  status,
}: GroupBuyStatusBadgeProps) {
  const displayStatus: GroupBuyDisplayStatus = getGroupBuyDisplayStatus({
    currentParticipants,
    expiresAt,
    minParticipants,
    status,
  });

  if (displayStatus === 'open') {
    return (
      <Badge className="gap-1 bg-accent/10 text-accent-foreground hover:bg-accent/10">
        <Clock className="h-3.5 w-3.5" />
        <DealCountdown
          targetAt={expiresAt}
          compact
          endedLabel="Expired"
          showIcon={false}
          className="bg-transparent px-0 text-inherit hover:bg-transparent"
        />
      </Badge>
    );
  }

  const statusIcon =
    displayStatus === 'filled' ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <XCircle className="h-4 w-4" />
    );
  const statusColor =
    displayStatus === 'filled'
      ? 'bg-primary/10 text-primary'
      : 'bg-destructive/10 text-destructive';
  const statusLabel =
    displayStatus === 'filled'
      ? 'Filled'
      : displayStatus === 'cancelled'
        ? 'Cancelled'
        : displayStatus === 'closed'
          ? 'Closed'
          : 'Expired';

  return (
    <Badge className={`${statusColor} gap-1 flex-shrink-0`}>
      {statusIcon} {statusLabel}
    </Badge>
  );
}
