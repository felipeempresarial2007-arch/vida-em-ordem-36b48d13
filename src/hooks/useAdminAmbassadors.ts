import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AdminAmbassador {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  referralCode: string;
  status: 'active' | 'suspended' | 'blocked';
  commissionRate: number;
  termsAcceptedAt: string | null;
  bonusPaidAt: string | null;
  createdAt: string;
  stats: {
    totalClicks: number;
    activeCustomers: number;
    totalCustomers: number;
    totalRevenue: number;
    totalCommission: number;
    bonusEligible: boolean;
  };
}

export function useAdminAmbassadors() {
  const { user } = useAuth();
  const [ambassadors, setAmbassadors] = useState<AdminAmbassador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    const adminStatus = !!data;
    setIsAdmin(adminStatus);
    return adminStatus;
  }, [user]);

  const fetchAmbassadors = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const adminStatus = await checkAdminStatus();
      if (!adminStatus) {
        setIsLoading(false);
        return;
      }

      // Buscar todos os embaixadores
      const { data: ambassadorData, error } = await supabase
        .from('ambassadors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ambassadors:', error);
        return;
      }

      if (!ambassadorData) {
        setAmbassadors([]);
        return;
      }

      // Para cada embaixador, buscar estatísticas
      const enrichedAmbassadors = await Promise.all(
        ambassadorData.map(async (amb) => {
          // Buscar email do usuário via profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', amb.user_id)
            .maybeSingle();

          // Cliques
          const { count: clickCount } = await supabase
            .from('referral_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('ambassador_id', amb.id);

          // Clientes
          const { data: customers } = await supabase
            .from('referral_customers')
            .select('subscription_status, total_paid')
            .eq('ambassador_id', amb.id);

          const activeCustomers = customers?.filter(c => c.subscription_status === 'active').length || 0;
          const totalRevenue = customers?.reduce((sum, c) => sum + Number(c.total_paid), 0) || 0;

          // Comissões
          const { data: commissions } = await supabase
            .from('ambassador_commissions')
            .select('amount')
            .eq('ambassador_id', amb.id);

          const totalCommission = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

          return {
            id: amb.id,
            userId: amb.user_id,
            userEmail: '', // Will need to get from auth admin or store separately
            userName: profile?.full_name || null,
            referralCode: amb.referral_code,
            status: amb.status as 'active' | 'suspended' | 'blocked',
            commissionRate: Number(amb.commission_rate),
            termsAcceptedAt: amb.terms_accepted_at,
            bonusPaidAt: amb.bonus_paid_at,
            createdAt: amb.created_at,
            stats: {
              totalClicks: clickCount || 0,
              activeCustomers,
              totalCustomers: customers?.length || 0,
              totalRevenue,
              totalCommission,
              bonusEligible: activeCustomers >= 10 && !amb.bonus_paid_at,
            },
          };
        })
      );

      setAmbassadors(enrichedAmbassadors);
    } catch (error) {
      console.error('Error in fetchAmbassadors:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, checkAdminStatus]);

  const createAmbassador = useCallback(async (userEmail: string, commissionRate: number = 20) => {
    if (!isAdmin) {
      toast.error('Sem permissão');
      return false;
    }

    // API de admin não disponível no cliente
    // Use createAmbassadorByUserId com o user_id correto
    toast.error('Use o painel admin para adicionar embaixadores por user_id');
    return false;
  }, [isAdmin]);

  const createAmbassadorByUserId = useCallback(async (userId: string, commissionRate: number = 20) => {
    if (!isAdmin) {
      toast.error('Sem permissão');
      return false;
    }

    try {
      // Verificar se já é embaixador
      const { data: existing } = await supabase
        .from('ambassadors')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        toast.error('Usuário já é embaixador');
        return false;
      }

      // Gerar código único
      let referralCode = '';
      let isUnique = false;
      
      while (!isUnique) {
        referralCode = generateReferralCode();
        const { data: existingCode } = await supabase
          .from('ambassadors')
          .select('id')
          .eq('referral_code', referralCode)
          .maybeSingle();
        
        isUnique = !existingCode;
      }

      // Criar embaixador
      const { error } = await supabase
        .from('ambassadors')
        .insert({
          user_id: userId,
          referral_code: referralCode,
          commission_rate: commissionRate,
          status: 'active',
        });

      if (error) throw error;

      // Adicionar role de embaixador
      await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'ambassador',
        });

      toast.success('Embaixador criado com sucesso!');
      await fetchAmbassadors();
      return true;
    } catch (error) {
      console.error('Error creating ambassador:', error);
      toast.error('Erro ao criar embaixador');
      return false;
    }
  }, [isAdmin, fetchAmbassadors]);

  const updateAmbassadorStatus = useCallback(async (
    ambassadorId: string, 
    status: 'active' | 'suspended' | 'blocked'
  ) => {
    if (!isAdmin) {
      toast.error('Sem permissão');
      return false;
    }

    try {
      const { error } = await supabase
        .from('ambassadors')
        .update({ status })
        .eq('id', ambassadorId);

      if (error) throw error;

      toast.success(`Status atualizado para ${status}`);
      await fetchAmbassadors();
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
      return false;
    }
  }, [isAdmin, fetchAmbassadors]);

  const markBonusPaid = useCallback(async (ambassadorId: string) => {
    if (!isAdmin) {
      toast.error('Sem permissão');
      return false;
    }

    try {
      const { error } = await supabase
        .from('ambassadors')
        .update({ bonus_paid_at: new Date().toISOString() })
        .eq('id', ambassadorId);

      if (error) throw error;

      toast.success('Bônus marcado como pago');
      await fetchAmbassadors();
      return true;
    } catch (error) {
      console.error('Error marking bonus paid:', error);
      toast.error('Erro ao marcar bônus');
      return false;
    }
  }, [isAdmin, fetchAmbassadors]);

  useEffect(() => {
    fetchAmbassadors();
  }, [fetchAmbassadors]);

  return {
    ambassadors,
    isLoading,
    isAdmin,
    createAmbassadorByUserId,
    updateAmbassadorStatus,
    markBonusPaid,
    refresh: fetchAmbassadors,
  };
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
