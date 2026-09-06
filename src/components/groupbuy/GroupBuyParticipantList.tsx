import { useQuery } from '@tanstack/react-query';
import { formatStoreDate } from '@/lib/date-utils';
import { supabase } from '@/integrations/supabase/client';
import type { Json, Tables } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import {
  extractGroupBuySelectionsFromShippingAddress,
  getGroupBuySelectionsTotalQuantity,
} from '@/lib/groupBuySelections';
import { DeliveryAddressBlock, hasDeliveryAddress } from '@/components/admin/DeliveryAddressBlock';
import { useCurrency } from '@/hooks/useCurrency';
import type { DeliveryAddress } from '@/lib/shippingAddressDisplay';

interface GroupBuyParticipantListProps {
  groupBuyId: string;
}

type GroupBuyParticipantRow = Tables<'group_buy_participants'>;

interface Participant extends GroupBuyParticipantRow {
  profile: {
    name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  variant: {
    color: string | null;
    size: string | null;
  } | null | undefined;
}

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || 'AJYN member';
  const [first, second] = source.split(/\s+|@/);

  return `${first?.[0] || ''}${second?.[0] || ''}`.toUpperCase() || 'AJ';
}

export function GroupBuyParticipantList({ groupBuyId }: GroupBuyParticipantListProps) {
  const { formatPrice } = useCurrency();

  const { data: participants, isLoading } = useQuery({
    queryKey: ['group-buy-participants', groupBuyId],
    queryFn: async (): Promise<Participant[]> => {
      const { data, error } = await supabase
        .from('group_buy_participants')
        .select('*')
        .eq('group_buy_id', groupBuyId)
        .order('joined_at');

      if (error) throw error;

      const participantRows = data || [];
      const userIds = participantRows.map((participant) => participant.user_id);
      const missingAddressUserIds = participantRows
        .filter((participant) => !hasDeliveryAddress(participant.shipping_address))
        .map((participant) => participant.user_id);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name, email, phone, avatar_url')
        .in('user_id', userIds);

      const { data: fallbackAddresses } = missingAddressUserIds.length > 0
        ? await supabase
            .from('addresses')
            .select('user_id, label, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at')
            .in('user_id', missingAddressUserIds)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: true })
        : { data: [] as Array<DeliveryAddress & { user_id: string }> };

      const fallbackAddressByUserId = new Map<string, DeliveryAddress>();
      (fallbackAddresses || []).forEach((address) => {
        if (!address.user_id || fallbackAddressByUserId.has(address.user_id)) {
          return;
        }

        fallbackAddressByUserId.set(address.user_id, {
          full_name: address.full_name,
          phone: address.phone,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
          label: address.label,
        });
      });

      const variantIds = participantRows.map((participant) => participant.variant_id).filter(Boolean);
      const { data: variants } = variantIds.length > 0
        ? await supabase
            .from('product_variants')
            .select('id, color, size')
            .in('id', variantIds)
        : { data: [] };

      const profileMap = new Map(profiles?.map((profile) => [profile.user_id, profile]));
      const variantMap = new Map<string, { id: string; color: string | null; size: string | null }>();
      variants?.forEach((variant) => variantMap.set(variant.id, variant));

      return participantRows.map((participant): Participant => {
        const resolvedShippingAddress = hasDeliveryAddress(participant.shipping_address)
          ? participant.shipping_address
          : fallbackAddressByUserId.get(participant.user_id) || participant.shipping_address;

        return {
          ...participant,
          shipping_address: resolvedShippingAddress,
          profile: profileMap.get(participant.user_id) || null,
          variant: participant.variant_id ? variantMap.get(participant.variant_id) || null : null,
        };
      });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!participants || participants.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No participants yet.</p>;
  }

  const getPaymentBadge = (status: string | null) => {
    switch (status) {
      case 'paid': return <Badge className="bg-primary/10 text-primary">Paid</Badge>;
      case 'pending': return <Badge className="bg-accent/10 text-accent-foreground">Pending</Badge>;
      case 'refunded': return <Badge className="bg-destructive/10 text-destructive">Refunded</Badge>;
      default: return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead className="min-w-[260px]">Delivery Address</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => {
              const selections = extractGroupBuySelectionsFromShippingAddress(participant.shipping_address);

              return (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-border bg-primary/10">
                        <AvatarImage
                          src={participant.profile?.avatar_url || undefined}
                          alt={`${participant.profile?.name || 'Customer'} avatar`}
                        />
                        <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                          {getInitials(participant.profile?.name, participant.profile?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{participant.profile?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{participant.profile?.email || ''}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {selections.length > 0 ? (
                      <div className="space-y-1">
                        {selections.map((selection) => (
                          <p key={selection.variantId}>
                            {selection.label} x {selection.quantity}
                          </p>
                        ))}
                      </div>
                    ) : participant.variant ? (
                      <span>{[participant.variant.color, participant.variant.size].filter(Boolean).join(' / ') || '-'}</span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{selections.length > 0 ? getGroupBuySelectionsTotalQuantity(selections) : participant.quantity || 1}</TableCell>
                  <TableCell>{getPaymentBadge(participant.payment_status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                    {participant.payment_reference || '-'}
                  </TableCell>
                  <TableCell>
                    <DeliveryAddressBlock
                      value={participant.shipping_address as Json | null}
                      formatPrice={formatPrice}
                      compact
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatStoreDate(participant.joined_at)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {participants.map((participant) => {
          const selections = extractGroupBuySelectionsFromShippingAddress(participant.shipping_address);

          return (
            <div key={participant.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border bg-primary/10">
                    <AvatarImage
                      src={participant.profile?.avatar_url || undefined}
                      alt={`${participant.profile?.name || 'Customer'} avatar`}
                    />
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {getInitials(participant.profile?.name, participant.profile?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{participant.profile?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{participant.profile?.email || ''}</p>
                  </div>
                </div>
                {getPaymentBadge(participant.payment_status)}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-medium text-foreground">
                    {selections.length > 0 ? getGroupBuySelectionsTotalQuantity(selections) : participant.quantity || 1}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-medium text-foreground">{formatStoreDate(participant.joined_at)}</p>
                </div>
              </div>

              <div className="mt-3">
                <DeliveryAddressBlock
                  value={participant.shipping_address as Json | null}
                  formatPrice={formatPrice}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
