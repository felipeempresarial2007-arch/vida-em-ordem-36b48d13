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
  // MVP Mode - All logged-in users have full access
  // To reactivate Stripe, restore the original code from git history
  
  return {
    isSubscribed: true,
    productId: 'mvp_access',
    subscriptionEnd: null,
    planName: 'MVP Access',
    isLoading: false,
    checkSubscription: async () => {},
    openCheckout: async () => {},
    openPortal: async () => {},
    STRIPE_PRICES,
  };
}
