-- Add DELETE policy to profiles table for GDPR compliance
-- This allows users to delete their own profile data

CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);