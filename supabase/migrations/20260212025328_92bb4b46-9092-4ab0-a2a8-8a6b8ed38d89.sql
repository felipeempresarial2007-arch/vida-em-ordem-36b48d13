
-- 1. Block any direct client INSERT on user_roles
CREATE POLICY "No direct role insertion"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);

-- 2. Create trigger to auto-assign ambassador role when ambassador record is created
CREATE OR REPLACE FUNCTION public.assign_ambassador_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'ambassador')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_assign_ambassador_role
AFTER INSERT ON public.ambassadors
FOR EACH ROW
EXECUTE FUNCTION public.assign_ambassador_role();

-- 3. Secure ambassadors_safe view - recreate with security_invoker
DROP VIEW IF EXISTS public.ambassadors_safe;
CREATE VIEW public.ambassadors_safe
WITH (security_invoker = on)
AS
SELECT 
  id,
  user_id,
  referral_code,
  status,
  terms_accepted_at,
  created_at,
  updated_at
FROM public.ambassadors;
