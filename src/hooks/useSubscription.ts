import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Emails with free VIP access (bypass trial & payment)
const VIP_EMAILS = ['felipeempresarial2007@gmail.com', 'contatomaduwendler@gmail.com'];

// Single lifetime one-time payment
export const STRIPE_PRICES = {
  lifetime: {
    priceId: 'price_1TwZJBDYwN6d3g31Rfqy4JAX',
    productId: 'prod_UwSDwBDJ5QMucN',
    name: 'Acesso Vitalício',
    price: 1.0,
    interval: 'lifetime' as const,
  },
  // Backwards-compat aliases (keep old imports working)
  monthly: {
    priceId: 'price_1TwZJBDYwN6d3g31Rfqy4JAX',
    productId: 'prod_UwSDwBDJ5QMucN',
    name: 'Acesso Vitalício',
    price: 1.0,
    interval: 'lifetime' as const,
  },
  annual: {
    priceId: 'price_1TwZJBDYwN6d3g31Rfqy4JAX',
    productId: 'prod_UwSDwBDJ5QMucN',
    name: 'Acesso Vitalício',
    price: 1.0,
    interval: 'lifetime' as const,
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

      // VIP bypass
      if (user.email && VIP_EMAILS.includes(user.email.toLowerCase())) {
        setState({
          isSubscribed: true,
          productId: null,
          subscriptionEnd: null,
          planName: 'VIP',
          isLoading: false,
        });
        return;
      }

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
        console.error('Error checking payment:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setState({
        isSubscribed: data?.subscribed || false,
        productId: data?.product_id || null,
        subscriptionEnd: null,
        planName: data?.subscribed ? 'Vitalício' : null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking payment:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  const openCheckout = useCallback(async (priceId: string = STRIPE_PRICES.lifetime.priceId) => {
    if (!user) {
      toast.error('Você precisa estar logado para continuar');
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
        window.location.href = data.url;
      }
    } catch (error) {
      toast.dismiss('checkout');
      toast.error('Erro ao processar checkout');
      console.error('Checkout error:', error);
    }
  }, [user]);

  // Portal not applicable for one-time payments — kept as no-op for compatibility
  const openPortal = useCallback(async () => {
    toast.info('Você possui acesso vitalício — não há assinatura para gerenciar.');
  }, []);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

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
