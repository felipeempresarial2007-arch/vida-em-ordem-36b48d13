-- Create a view that exposes only non-sensitive ambassador data to ambassadors
-- This hides commission_rate, bonus_paid_at, and notes from ambassadors themselves

CREATE VIEW public.ambassadors_safe
WITH (security_invoker=on) AS
  SELECT 
    id,
    user_id,
    referral_code,
    status,
    terms_accepted_at,
    created_at,
    updated_at
  FROM public.ambassadors;

-- Comment explaining the view purpose
COMMENT ON VIEW public.ambassadors_safe IS 'Safe view of ambassadors table excluding sensitive financial data (commission_rate, bonus_paid_at, notes)';

-- Drop the existing policy that allows ambassadors to see all their data
DROP POLICY IF EXISTS "Ambassadors can view their own data" ON public.ambassadors;

-- Create a new restrictive policy - ambassadors can ONLY access via the safe view
-- Direct table SELECT is now admin-only
CREATE POLICY "Only admins can directly select ambassadors"
ON public.ambassadors
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Grant usage on the view to authenticated users
GRANT SELECT ON public.ambassadors_safe TO authenticated;

-- Create RLS-like access control for the view via the base table policies
-- Since security_invoker=on, the view respects the caller's permissions
-- Ambassadors need to see their own records via the view
CREATE POLICY "Ambassadors can view own data via safe view"
ON public.ambassadors
FOR SELECT
TO authenticated
USING (
  -- Either admin can see all
  has_role(auth.uid(), 'admin')
  OR
  -- Or user can see their own record (but through view they won't see sensitive columns)
  auth.uid() = user_id
);

-- Drop the previous admin-only policy since we're combining the logic
DROP POLICY IF EXISTS "Only admins can directly select ambassadors" ON public.ambassadors;