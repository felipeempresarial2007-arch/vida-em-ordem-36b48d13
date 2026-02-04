import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredReferralCode, clearReferralCode } from './useReferralTracking';

// Hook para processar referência após login/cadastro
export function useProcessReferral() {
  const { user } = useAuth();

  const processReferral = useCallback(async () => {
    if (!user) return;

    const referralCode = getStoredReferralCode();
    if (!referralCode) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const { data, error } = await supabase.functions.invoke('process-referral', {
        body: { referralCode },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error processing referral:', error);
        return;
      }

      if (data?.success || data?.alreadyReferred) {
        // Limpar o cookie após processar com sucesso
        clearReferralCode();
        console.log('Referral processed:', data);
      }
    } catch (error) {
      console.error('Error in processReferral:', error);
    }
  }, [user]);

  useEffect(() => {
    processReferral();
  }, [processReferral]);

  return { processReferral };
}
