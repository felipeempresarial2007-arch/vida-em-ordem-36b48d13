-- Create ambassador_invites table for invite codes
CREATE TABLE public.ambassador_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC NOT NULL DEFAULT 20.00,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by_user_id UUID,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.ambassador_invites ENABLE ROW LEVEL SECURITY;

-- Admins can manage all invites
CREATE POLICY "Admins can manage all invites"
ON public.ambassador_invites
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view and claim unused invites by code
CREATE POLICY "Users can claim unused invites"
ON public.ambassador_invites
FOR UPDATE
USING (used_at IS NULL AND (expires_at IS NULL OR expires_at > now()))
WITH CHECK (used_by_user_id = auth.uid());

-- Function to generate invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'INV-';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$;