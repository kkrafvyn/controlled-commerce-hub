-- Scheduled start dates for flash deals and group buys.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS flash_deal_starts_at timestamptz;

ALTER TABLE public.group_buys
  ADD COLUMN IF NOT EXISTS starts_at timestamptz;

CREATE OR REPLACE FUNCTION public.join_group_buy_after_payment(
  p_group_buy_id uuid,
  p_quantity integer,
  p_variant_id uuid DEFAULT NULL,
  p_payment_reference text DEFAULT NULL,
  p_shipping_address jsonb DEFAULT NULL,
  p_invite_code text DEFAULT NULL,
  p_referred_by_user_id uuid DEFAULT NULL,
  p_unit_price_at_join numeric DEFAULT NULL,
  p_tier_label_at_join text DEFAULT NULL
)
RETURNS public.group_buy_participants
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_group_buy public.group_buys%ROWTYPE;
  v_existing public.group_buy_participants%ROWTYPE;
  v_participant public.group_buy_participants%ROWTYPE;
  v_cap integer;
  v_settings jsonb := '{}'::jsonb;
  v_participation_open boolean := true;
  v_allow_duplicate_participation boolean := false;
  v_participant_limit integer := 1;
  v_payment_status text := 'reserved';
  v_existing_quantity integer := 0;
  v_payment_reference text := NULLIF(btrim(p_payment_reference), '');
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Please sign in to join this group buy';
  END IF;

  IF p_group_buy_id IS NULL THEN
    RAISE EXCEPTION 'Missing group buy';
  END IF;

  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RAISE EXCEPTION 'Choose at least one item';
  END IF;

  IF v_payment_reference IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.verified_paystack_payments vpp
      WHERE vpp.reference = v_payment_reference
        AND vpp.user_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Payment has not been verified for this account.';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM public.group_buy_participants gbp
      WHERE gbp.payment_reference = v_payment_reference
        AND gbp.user_id <> v_user_id
    ) OR EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.payment_reference = v_payment_reference
        AND o.user_id <> v_user_id
    ) THEN
      RAISE EXCEPTION 'This payment reference has already been used.';
    END IF;

    v_payment_status := 'paid';
  ELSE
    v_payment_status := 'reserved';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_group_buy_id::text, 0));

  SELECT *
  INTO v_group_buy
  FROM public.group_buys
  WHERE id = p_group_buy_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Group buy not found';
  END IF;

  v_settings := COALESCE(v_group_buy.settings, '{}'::jsonb);
  v_participation_open := COALESCE((v_settings->>'participationOpen')::boolean, true);
  v_allow_duplicate_participation := COALESCE((v_settings->>'allowDuplicateParticipation')::boolean, false);
  v_participant_limit := GREATEST(COALESCE((v_settings->>'participantLimitPerUser')::integer, 1), 1);

  IF COALESCE((v_settings->>'requireFullPaymentBeforeJoining')::boolean, true)
     AND v_payment_status <> 'paid' THEN
    RAISE EXCEPTION 'Full payment is required before joining this group buy';
  END IF;

  SELECT *
  INTO v_existing
  FROM public.group_buy_participants
  WHERE group_buy_id = p_group_buy_id
    AND user_id = v_user_id;

  IF v_group_buy.status IS DISTINCT FROM 'open' THEN
    RAISE EXCEPTION 'This group buy is no longer open';
  END IF;

  IF NOT v_participation_open THEN
    RAISE EXCEPTION 'Participation for this group buy is currently closed';
  END IF;

  IF v_group_buy.starts_at IS NOT NULL AND v_group_buy.starts_at > now() THEN
    RAISE EXCEPTION 'This group buy has not started yet';
  END IF;

  IF v_group_buy.expires_at <= now() THEN
    RAISE EXCEPTION 'This group buy has expired';
  END IF;

  v_cap := COALESCE(v_group_buy.max_participants, v_group_buy.min_participants);

  IF NOT FOUND AND COALESCE(v_group_buy.current_participants, 0) >= v_cap THEN
    RAISE EXCEPTION 'This group buy is full';
  END IF;

  IF FOUND THEN
    v_existing_quantity := GREATEST(COALESCE(v_existing.quantity, 0), 0);

    IF v_existing.payment_status = 'paid' AND NOT v_allow_duplicate_participation THEN
      RETURN v_existing;
    END IF;

    IF v_existing.payment_status = 'paid' AND v_allow_duplicate_participation THEN
      IF v_existing_quantity + p_quantity > v_participant_limit THEN
        RAISE EXCEPTION 'Participant limit per user reached for this group buy';
      END IF;

      UPDATE public.group_buy_participants
      SET quantity = v_existing_quantity + p_quantity,
          variant_id = p_variant_id,
          payment_reference = COALESCE(v_payment_reference, payment_reference),
          payment_status = CASE
            WHEN v_payment_status = 'paid' THEN 'paid'
            ELSE COALESCE(payment_status, 'reserved')
          END,
          shipping_address = COALESCE(p_shipping_address, shipping_address),
          invite_code = COALESCE(p_invite_code, invite_code),
          referred_by_user_id = COALESCE(p_referred_by_user_id, referred_by_user_id),
          unit_price_at_join = COALESCE(p_unit_price_at_join, unit_price_at_join),
          tier_label_at_join = COALESCE(p_tier_label_at_join, tier_label_at_join)
      WHERE id = v_existing.id
      RETURNING * INTO v_participant;
    ELSE
      IF p_quantity > v_participant_limit THEN
        RAISE EXCEPTION 'Participant limit per user reached for this group buy';
      END IF;

      UPDATE public.group_buy_participants
      SET quantity = p_quantity,
          variant_id = p_variant_id,
          payment_reference = v_payment_reference,
          payment_status = v_payment_status,
          shipping_address = p_shipping_address,
          invite_code = p_invite_code,
          referred_by_user_id = p_referred_by_user_id,
          unit_price_at_join = p_unit_price_at_join,
          tier_label_at_join = p_tier_label_at_join
      WHERE id = v_existing.id
      RETURNING * INTO v_participant;
    END IF;
  ELSE
    IF p_quantity > v_participant_limit THEN
      RAISE EXCEPTION 'Participant limit per user reached for this group buy';
    END IF;

    INSERT INTO public.group_buy_participants (
      group_buy_id,
      user_id,
      quantity,
      variant_id,
      payment_reference,
      payment_status,
      shipping_address,
      invite_code,
      referred_by_user_id,
      unit_price_at_join,
      tier_label_at_join
    )
    VALUES (
      p_group_buy_id,
      v_user_id,
      p_quantity,
      p_variant_id,
      v_payment_reference,
      v_payment_status,
      p_shipping_address,
      p_invite_code,
      p_referred_by_user_id,
      p_unit_price_at_join,
      p_tier_label_at_join
    )
    RETURNING * INTO v_participant;
  END IF;

  RETURN v_participant;
END;
$function$;
