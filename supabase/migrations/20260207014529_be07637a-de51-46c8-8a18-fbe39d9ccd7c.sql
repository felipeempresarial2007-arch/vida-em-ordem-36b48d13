-- Add SELECT policy to restrict viewing ambassador invites to admins only
CREATE POLICY "Only admins can view ambassador invites"
ON public.ambassador_invites
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));