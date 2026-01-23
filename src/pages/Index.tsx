import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import { WelcomeWizard } from '@/components/onboarding/WelcomeWizard';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { useWelcomeSound } from '@/hooks/useWelcomeSound';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isNewUser, profile, completeOnboarding, loading: progressLoading } = useChallengeProgress();
  const [showWizard, setShowWizard] = useState(false);
  
  // Play welcome sound on app open
  useWelcomeSound();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/landing');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!progressLoading && isNewUser) {
      setShowWizard(true);
    }
  }, [progressLoading, isNewUser]);

  const handleWizardComplete = async () => {
    await completeOnboarding();
    setShowWizard(false);
  };

  if (authLoading || progressLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <WelcomeWizard 
        open={showWizard} 
        onComplete={handleWizardComplete}
        userName={profile?.fullName || undefined}
      />
      <Dashboard />
    </AppLayout>
  );
};

export default Index;
