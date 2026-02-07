import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// NOTE: Sensitive financial fields (commissionRate, bonusPaidAt) are intentionally
// excluded from this interface to protect confidential business terms.
// These fields are only accessible to admins via the full ambassadors table.
export interface AmbassadorData {
  id: string;
  referralCode: string;
  status: 'active' | 'suspended' | 'blocked';
  termsAcceptedAt: string | null;
  createdAt: string;
}

export interface AmbassadorStats {
  totalClicks: number;
  activeCustomers: number;
  totalCustomers: number;
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  bonusProgress: number; // de 0 a 10
  bonusEligible: boolean;
}

export function useAmbassador() {
  const { user } = useAuth();
  const [ambassador, setAmbassador] = useState<AmbassadorData | null>(null);
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAmbassador, setIsAmbassador] = useState(false);

  const fetchAmbassadorData = useCallback(async () => {
    if (!user) {
      setAmbassador(null);
      setStats(null);
      setIsAmbassador(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Use the safe view that excludes sensitive financial data
      // (commission_rate, bonus_paid_at, notes are hidden from ambassadors)
      const { data: ambassadorData, error: ambassadorError } = await supabase
        .from('ambassadors_safe')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ambassadorError) {
        console.error('Error fetching ambassador:', ambassadorError);
        setIsLoading(false);
        return;
      }

      if (!ambassadorData) {
        setIsAmbassador(false);
        setIsLoading(false);
        return;
      }

      setIsAmbassador(true);
      setAmbassador({
        id: ambassadorData.id,
        referralCode: ambassadorData.referral_code,
        status: ambassadorData.status as 'active' | 'suspended' | 'blocked',
        termsAcceptedAt: ambassadorData.terms_accepted_at,
        createdAt: ambassadorData.created_at,
      });

      // Buscar estatísticas
      // Total de cliques
      const { count: clickCount } = await supabase
        .from('referral_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', ambassadorData.id);

      // Clientes
      const { data: customers } = await supabase
        .from('referral_customers')
        .select('subscription_status, total_paid')
        .eq('ambassador_id', ambassadorData.id);

      const activeCustomers = customers?.filter(c => c.subscription_status === 'active').length || 0;
      const totalCustomers = customers?.length || 0;
      const totalRevenue = customers?.reduce((sum, c) => sum + Number(c.total_paid), 0) || 0;

      // Comissões
      const { data: commissions } = await supabase
        .from('ambassador_commissions')
        .select('amount, status')
        .eq('ambassador_id', ambassadorData.id);

      const totalCommission = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
      const pendingCommission = commissions
        ?.filter(c => c.status === 'pending' || c.status === 'approved')
        .reduce((sum, c) => sum + Number(c.amount), 0) || 0;

      // Check bonus eligibility using the database function
      // (bonus_paid_at is not exposed to ambassadors for security)
      const bonusEligible = activeCustomers >= 10;

      setStats({
        totalClicks: clickCount || 0,
        activeCustomers,
        totalCustomers,
        totalRevenue,
        totalCommission,
        pendingCommission,
        bonusProgress: Math.min(activeCustomers, 10),
        bonusEligible,
      });

    } catch (error) {
      console.error('Error in fetchAmbassadorData:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const acceptTerms = useCallback(async () => {
    if (!ambassador) return false;

    try {
      const { error } = await supabase
        .from('ambassadors')
        .update({ terms_accepted_at: new Date().toISOString() })
        .eq('id', ambassador.id);

      if (error) throw error;

      setAmbassador(prev => prev ? { ...prev, termsAcceptedAt: new Date().toISOString() } : null);
      return true;
    } catch (error) {
      console.error('Error accepting terms:', error);
      return false;
    }
  }, [ambassador]);

  const getReferralLink = useCallback(() => {
    if (!ambassador) return '';
    return `${window.location.origin}?ref=${ambassador.referralCode}`;
  }, [ambassador]);

  useEffect(() => {
    fetchAmbassadorData();
  }, [fetchAmbassadorData]);

  return {
    ambassador,
    stats,
    isLoading,
    isAmbassador,
    acceptTerms,
    getReferralLink,
    refresh: fetchAmbassadorData,
  };
}
