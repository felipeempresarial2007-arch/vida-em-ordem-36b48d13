
-- Drop the view first
DROP VIEW IF EXISTS public.ambassadors_safe;

-- Drop triggers
DROP TRIGGER IF EXISTS trg_assign_ambassador_role ON public.ambassadors;

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS public.ambassador_commissions;
DROP TABLE IF EXISTS public.referral_clicks;
DROP TABLE IF EXISTS public.referral_customers;
DROP TABLE IF EXISTS public.ambassador_invites;
DROP TABLE IF EXISTS public.ambassadors;
DROP TABLE IF EXISTS public.user_roles;

-- Drop functions
DROP FUNCTION IF EXISTS public.assign_ambassador_role();
DROP FUNCTION IF EXISTS public.generate_referral_code();
DROP FUNCTION IF EXISTS public.generate_invite_code();
DROP FUNCTION IF EXISTS public.get_ambassador_active_customers(uuid);
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Drop enums
DROP TYPE IF EXISTS public.ambassador_status;
DROP TYPE IF EXISTS public.app_role;
