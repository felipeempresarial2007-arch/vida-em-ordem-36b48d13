import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Hook for users to claim an invite
export function useClaimInvite() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const claimInvite = async (code: string): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return false;
    }

    setIsLoading(true);

    try {
      // Check if user is already an ambassador
      const { data: existingAmbassador } = await supabase
        .from('ambassadors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingAmbassador) {
        toast.error('Você já é um embaixador!');
        setIsLoading(false);
        return false;
      }

      // Find the invite
      const { data: invite, error: findError } = await supabase
        .from('ambassador_invites')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .is('used_at', null)
        .single();

      if (findError || !invite) {
        toast.error('Código inválido ou já utilizado');
        setIsLoading(false);
        return false;
      }

      // Check expiration
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        toast.error('Este código expirou');
        setIsLoading(false);
        return false;
      }

      // Generate referral code for the new ambassador
      const { data: referralCode, error: refError } = await supabase.rpc('generate_referral_code');
      if (refError) throw refError;

      // Create ambassador record
      const { error: createError } = await supabase
        .from('ambassadors')
        .insert({
          user_id: user.id,
          referral_code: referralCode,
          commission_rate: invite.commission_rate,
          status: 'active',
        });

      if (createError) throw createError;

      // Mark invite as used
      const { error: updateError } = await supabase
        .from('ambassador_invites')
        .update({
          used_at: new Date().toISOString(),
          used_by_user_id: user.id,
        })
        .eq('id', invite.id);

      if (updateError) {
        console.error('Error marking invite as used:', updateError);
      }

      // Ambassador role is automatically assigned via database trigger
      toast.success('Parabéns! Você agora é um Embaixador Focus 30!');
      return true;
    } catch (error: any) {
      console.error('Error claiming invite:', error);
      toast.error('Erro ao ativar convite');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { claimInvite, isLoading };
}
