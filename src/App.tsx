import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Ambiente from "./pages/Ambiente";
import Financas from "./pages/Financas";
import Rotina from "./pages/Rotina";
import Metas from "./pages/Metas";
import Continuacao from "./pages/Continuacao";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import Install from "./pages/Install";
import FocusProtocol from "./pages/FocusProtocol";
import AICoach from "./pages/AICoach";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Ambassador from "./pages/Ambassador";

import AppLayout from "./components/layout/AppLayout";
import { useNotificationScheduler } from "./hooks/useNotificationScheduler";
import { useReferralTracking } from "./hooks/useReferralTracking";
import { useTrial } from "./hooks/useTrial";
import { useSubscription, STRIPE_PRICES } from "./hooks/useSubscription";
import { Loader2, Lock, Crown, Sparkles } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";

const queryClient = new QueryClient();

function TrialGate() {
  const { openCheckout } = useSubscription();
  
  return (
    <motion.div
      className="flex items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-md w-full border-destructive/30 bg-gradient-to-br from-destructive/5 via-background to-primary/5 shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/15 to-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Seu período de teste terminou
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Seu trial gratuito de 24 horas expirou. Faça o upgrade para o plano Pro 
              e continue transformando sua vida com o Focus30.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => openCheckout(STRIPE_PRICES.monthly.priceId)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Plano Mensal — R$ 27,90/mês
            </Button>
            <Button
              onClick={() => openCheckout(STRIPE_PRICES.annual.priceId)}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Assinar Plano Anual — R$ 17,57/mês
            </Button>
            <p className="text-xs text-muted-foreground">
              Cancele quando quiser. Sem compromisso.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isTrialExpired, isLoading: trialLoading } = useTrial();
  const { isSubscribed, isLoading: subLoading } = useSubscription();
  
  // Initialize notification scheduler for logged in users
  useNotificationScheduler();

  if (loading || trialLoading || subLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // Block ALL pages when trial expired and not subscribed
  if (isTrialExpired && !isSubscribed) {
    return <AppLayout><TrialGate /></AppLayout>;
  }

  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Public landing route - shows landing for guests, redirects logged users to dashboard
function PublicLandingRoute() {
  const { user, loading } = useAuth();
  
  // Track referrals on landing page
  useReferralTracking();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}

const AppRoutes = () => (
  <Routes>
    {/* Public landing page as root - redirects logged users to dashboard */}
    <Route path="/" element={<PublicLandingRoute />} />
    {/* Landing always accessible for sharing links */}
    <Route path="/landing" element={<Landing />} />
    <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    <Route path="/payment-success" element={<PaymentSuccess />} />
    <Route path="/payment-canceled" element={<PaymentCanceled />} />
    <Route path="/install" element={<Install />} />
    {/* Protected app routes */}
    <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/focus-protocol" element={<ProtectedRoute><FocusProtocol /></ProtectedRoute>} />
    <Route path="/ai-coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/ambiente" element={<ProtectedRoute><Ambiente /></ProtectedRoute>} />
    <Route path="/financas" element={<ProtectedRoute><Financas /></ProtectedRoute>} />
    <Route path="/rotina" element={<ProtectedRoute><Rotina /></ProtectedRoute>} />
    <Route path="/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
    <Route path="/continuacao" element={<ProtectedRoute><Continuacao /></ProtectedRoute>} />
    <Route path="/embaixador" element={<ProtectedRoute><Ambassador /></ProtectedRoute>} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;