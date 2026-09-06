-- Allow admins and managers to read customer delivery addresses for fulfillment workflows.

DROP POLICY IF EXISTS "Admins and managers can view customer addresses" ON public.addresses;
CREATE POLICY "Admins and managers can view customer addresses"
ON public.addresses
FOR SELECT
TO authenticated
USING (public.is_admin_or_manager(auth.uid()));

DROP POLICY IF EXISTS "Users and admins can view group buy participation" ON public.group_buy_participants;
CREATE POLICY "Users and admins can view group buy participation"
ON public.group_buy_participants
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.is_admin_or_manager(auth.uid())
);
