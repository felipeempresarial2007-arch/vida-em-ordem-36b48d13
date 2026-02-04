import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AmbassadorInvite {
  id: string;
  code: string;
  commissionRate: number;
  createdAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  usedByUserId: string | null;
  notes: string | null;
}

export function useAmbassadorInvites() {
  const { user, isAdmin } = useAuth();
  const [invites, setInvites] = useState<AmbassadorInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvites = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ambassador_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvites(
        (data || []).map((inv) => ({
          id: inv.id,
          code: inv.code,
          commissionRate: Number(inv.commission_rate),
          createdAt: inv.created_at,
          expiresAt: inv.expires_at,
          usedAt: inv.used_at,
          usedByUserId: inv.used_by_user_id,
          notes: inv.notes,
        }))
      );
    } catch (error) {
      console.error('Error fetching invites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const createInvite = async (commissionRate: number = 20, notes?: string) => {
    if (!user) return null;

    try {
      // Generate code using database function
      const { data: codeData, error: codeError } = await supabase.rpc('generate_invite_code');
      if (codeError) throw codeError;

      const { data, error } = await supabase
        .from('ambassador_invites')
        .insert({
          code: codeData,
          commission_rate: commissionRate,
          created_by: user.id,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Código de convite criado!');
      await fetchInvites();
      return data.code as string;
    } catch (error: any) {
      console.error('Error creating invite:', error);
      toast.error('Erro ao criar convite');
      return null;
    }
  };

  const deleteInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ambassador_invites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Convite removido');
      await fetchInvites();
      return true;
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast.error('Erro ao remover convite');
      return false;
    }
  };

  return {
    invites,
    isLoading,
    createInvite,
    deleteInvite,
    refresh: fetchInvites,
  };
}

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

      // Add ambassador role
      await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'ambassador',
      });

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
