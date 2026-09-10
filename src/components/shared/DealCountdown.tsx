import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDealCountdownLabel, getDealCountdown } from '@/lib/dealSchedule';
import { cn } from '@/lib/utils';

interface DealCountdownProps {
  targetAt?: string | null;
  prefix?: string;
  endedLabel?: string;
  compact?: boolean;
  variant?: 'destructive' | 'secondary' | 'outline' | 'default';
  className?: string;
  showIcon?: boolean;
  tickMs?: number;
}

export function DealCountdown({
  targetAt,
  prefix,
  endedLabel = 'Ended',
  compact = false,
  variant = 'destructive',
  className,
  showIcon = true,
  tickMs = 1000,
}: DealCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetAt) {
      return;
    }

    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, tickMs);
    return () => window.clearInterval(interval);
  }, [targetAt, tickMs]);

  if (!targetAt) {
    return null;
  }

  const countdown = getDealCountdown(targetAt, now);
  const label = formatDealCountdownLabel(
    targetAt,
    { endedLabel, prefix, compact },
    now,
  );

  return (
    <Badge
      variant={variant}
      className={cn(
        'max-w-full gap-1 truncate pointer-events-none',
        countdown.isExpired && 'opacity-80',
        className,
      )}
    >
      {showIcon ? <Clock className="h-3 w-3 shrink-0" /> : null}
      <span className="truncate">{label}</span>
    </Badge>
  );
}

export function useDealCountdownLabel(
  targetAt?: string | null,
  options?: {
    endedLabel?: string;
    prefix?: string;
    compact?: boolean;
    tickMs?: number;
  },
) {
  const [now, setNow] = useState(() => Date.now());
  const tickMs = options?.tickMs ?? 1000;

  useEffect(() => {
    if (!targetAt) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), tickMs);
    return () => window.clearInterval(interval);
  }, [targetAt, tickMs]);

  if (!targetAt) {
    return '';
  }

  return formatDealCountdownLabel(
    targetAt,
    {
      endedLabel: options?.endedLabel,
      prefix: options?.prefix,
      compact: options?.compact,
    },
    now,
  );
}
