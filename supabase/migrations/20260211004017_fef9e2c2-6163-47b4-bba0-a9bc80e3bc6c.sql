
-- Update ambassadors SELECT policy to remove admin check
DROP POLICY IF EXISTS "Ambassadors can view own data via safe view" ON public.ambassadors;
CREATE POLICY "Ambassadors can view own data" ON public.ambassadors
  FOR SELECT USING (auth.uid() = user_id);
