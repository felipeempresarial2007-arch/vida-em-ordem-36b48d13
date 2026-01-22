import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Stripe Price IDs
export const STRIPE_PRICES = {
  monthly: {
    priceId: 'price_1SnAd4P8WA5VcKKzrUA51WV6',
    productId: 'prod_Tkfz41apw3jLZ4',
    name: 'Mensal',
    price: 27.90,
    originalPrice: 58.80,
    interval: 'month' as const,
  },
  annual: {
    priceId: 'price_1SnAh3P8WA5VcKKz4PtlqlWi',
    productId: 'prod_Tkg3wEZhNIPRqe',
    name: 'Anual',
    price: 210.90,
    pricePerMonth: 17.57,
    interval: 'year' as const,
  },
};

interface SubscriptionState {
  isSubscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  planName: string | null;
  isLoading: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    productId: null,
    subscriptionEnd: null,
    planName: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setState({
        isSubscribed: false,
        productId: null,
        subscriptionEnd: null,
        planName: null,
        isLoading: false,
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const planName = data?.product_id === STRIPE_PRICES.annual.productId 
        ? 'Anual' 
        : data?.product_id === STRIPE_PRICES.monthly.productId 
          ? 'Mensal' 
          : null;

      setState({
        isSubscribed: data?.subscribed || false,
        productId: data?.product_id || null,
        subscriptionEnd: data?.subscription_end || null,
        planName,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  const openCheckout = useCallback(async (priceId: string = STRIPE_PRICES.monthly.priceId) => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      toast.loading('Redirecionando para o checkout...', { id: 'checkout' });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast.dismiss('checkout');
        toast.error('Erro ao criar sessão de checkout');
        console.error('Checkout error:', error);
        return;
      }

      if (data?.url) {
        toast.dismiss('checkout');
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast.dismiss('checkout');
      toast.error('Erro ao processar checkout');
      console.error('Checkout error:', error);
    }
  }, [user]);

  const openPortal = useCallback(async () => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      toast.loading('Abrindo portal...', { id: 'portal' });

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast.dismiss('portal');
        toast.error('Erro ao abrir portal');
        console.error('Portal error:', error);
        return;
      }

      if (data?.url) {
        toast.dismiss('portal');
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast.dismiss('portal');
      toast.error('Erro ao abrir portal');
      console.error('Portal error:', error);
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh subscription status every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...state,
    checkSubscription,
    openCheckout,
    openPortal,
    STRIPE_PRICES,
  };
}
