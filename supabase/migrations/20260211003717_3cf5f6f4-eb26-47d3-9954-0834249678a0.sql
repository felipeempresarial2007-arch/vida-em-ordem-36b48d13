
-- Remove admin-only RLS policies from all tables
-- (keeping ambassador and user-facing policies intact)

-- ambassadors: drop admin policy
DROP POLICY IF EXISTS "Admins can manage all ambassadors" ON public.ambassadors;

-- ambassador_commissions: drop admin policy
DROP POLICY IF EXISTS "Admins can manage all commissions" ON public.ambassador_commissions;

-- ambassador_invites: drop admin-only policies
DROP POLICY IF EXISTS "Admins can manage all invites" ON public.ambassador_invites;
DROP POLICY IF EXISTS "Only admins can view ambassador invites" ON public.ambassador_invites;

-- referral_clicks: drop admin policy
DROP POLICY IF EXISTS "Admins can view all clicks" ON public.referral_clicks;

-- referral_customers: drop admin policy
DROP POLICY IF EXISTS "Admins can manage all customers" ON public.referral_customers;

-- user_roles: drop admin policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Remove admin entries from user_roles table
DELETE FROM public.user_roles WHERE role = 'admin';
