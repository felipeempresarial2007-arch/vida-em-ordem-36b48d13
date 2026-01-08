import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Stripe Price IDs
export const STRIPE_PRICES = {
  monthly: {
    priceId: 'price_1SnAd4P8WA5VcKKzrUA51WV6',
    productId: 'prod_Tkfz41apw3jLZ4',
    name: 'Mensal',
    price: 27.90,
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
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isSubscribed: false,
    productId: null,
    subscriptionEnd: null,
    planName: null,
    isLoading: true,
  });

  const getPlanName = (productId: string | null): string | null => {
    if (!productId) return null;
    if (productId === STRIPE_PRICES.monthly.productId) return 'Mensal';
    if (productId === STRIPE_PRICES.annual.productId) return 'Anual';
    return 'Premium';
  };

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription({
        isSubscribed: false,
        productId: null,
        subscriptionEnd: null,
        planName: null,
        isLoading: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const productId = data?.product_id || null;
      setSubscription({
        isSubscribed: data?.subscribed || false,
        productId,
        subscriptionEnd: data?.subscription_end || null,
        planName: getPlanName(productId),
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
    }
  }, [session?.access_token]);

  const openCheckout = async (priceId: string) => {
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  };

  const openPortal = async () => {
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription({
        isSubscribed: false,
        productId: null,
        subscriptionEnd: null,
        planName: null,
        isLoading: false,
      });
    }
  }, [user, checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...subscription,
    checkSubscription,
    openCheckout,
    openPortal,
    STRIPE_PRICES,
  };
}
