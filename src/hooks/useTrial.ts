import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from './useSubscription';

const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface TrialState {
  isTrialActive: boolean;
  isTrialExpired: boolean;
  trialEndsAt: Date | null;
  timeRemaining: number; // in milliseconds
  hoursRemaining: number;
  minutesRemaining: number;
  isLoading: boolean;
}

export function useTrial() {
  const { user } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserCreatedAt() {
      if (!user) {
        setCreatedAt(null);
        setIsLoading(false);
        return;
      }

      try {
        // First check profile table
        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('user_id', user.id)
          .single();

        if (profile?.created_at) {
          setCreatedAt(new Date(profile.created_at));
        } else {
          // Fallback to user creation time from auth
          setCreatedAt(new Date(user.created_at));
        }
      } catch (error) {
        // Fallback to user creation time
        if (user.created_at) {
          setCreatedAt(new Date(user.created_at));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserCreatedAt();
  }, [user]);

  // Calculate trial state
  const trialState: TrialState = useMemo(() => {
    if (!user || !createdAt) {
      return {
        isTrialActive: false,
        isTrialExpired: false,
        trialEndsAt: null,
        timeRemaining: 0,
        hoursRemaining: 0,
        minutesRemaining: 0,
        isLoading: isLoading || subscriptionLoading,
      };
    }

    // If user is subscribed, trial is not relevant
    if (isSubscribed) {
      return {
        isTrialActive: false,
        isTrialExpired: false,
        trialEndsAt: null,
        timeRemaining: 0,
        hoursRemaining: 0,
        minutesRemaining: 0,
        isLoading: false,
      };
    }

    const trialEndsAt = new Date(createdAt.getTime() + TRIAL_DURATION_MS);
    const now = new Date();
    const timeRemaining = Math.max(0, trialEndsAt.getTime() - now.getTime());
    const isTrialExpired = timeRemaining === 0;
    const isTrialActive = !isTrialExpired;

    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return {
      isTrialActive,
      isTrialExpired,
      trialEndsAt,
      timeRemaining,
      hoursRemaining,
      minutesRemaining,
      isLoading: isLoading || subscriptionLoading,
    };
  }, [user, createdAt, isSubscribed, isLoading, subscriptionLoading]);

  // Auto-update remaining time every minute
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!trialState.isTrialActive) return;
    
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [trialState.isTrialActive]);

  return trialState;
}
