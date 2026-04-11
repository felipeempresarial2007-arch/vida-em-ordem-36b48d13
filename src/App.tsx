import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Ambiente = lazy(() => import("./pages/Ambiente"));
const Financas = lazy(() => import("./pages/Financas"));
const Rotina = lazy(() => import("./pages/Rotina"));
const Metas = lazy(() => import("./pages/Metas"));
const Continuacao = lazy(() => import("./pages/Continuacao"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("./pages/PaymentCanceled"));
const Install = lazy(() => import("./pages/Install"));
const FocusProtocol = lazy(() => import("./pages/FocusProtocol"));
const AICoach = lazy(() => import("./pages/AICoach"));
const Settings = lazy(() => import("./pages/Settings"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

import AppLayout from "./components/layout/AppLayout";
import { useNotificationScheduler } from "./hooks/useNotificationScheduler";
import { usePageTracking } from "./hooks/usePageTracking";
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

function PublicLandingRoute() {
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

  return <Landing />;
}

const AppRoutes = () => {
  usePageTracking();
  
  const SuspenseFallback = (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <Suspense fallback={SuspenseFallback}>
      <Routes>
        <Route path="/" element={<PublicLandingRoute />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-canceled" element={<PaymentCanceled />} />
        <Route path="/install" element={<Install />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/focus-protocol" element={<ProtectedRoute><FocusProtocol /></ProtectedRoute>} />
        <Route path="/ai-coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/ambiente" element={<ProtectedRoute><Ambiente /></ProtectedRoute>} />
        <Route path="/financas" element={<ProtectedRoute><Financas /></ProtectedRoute>} />
        <Route path="/rotina" element={<ProtectedRoute><Rotina /></ProtectedRoute>} />
        <Route path="/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
        <Route path="/continuacao" element={<ProtectedRoute><Continuacao /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

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
