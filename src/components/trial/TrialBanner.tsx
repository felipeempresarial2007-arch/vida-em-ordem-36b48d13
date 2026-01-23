import { motion, AnimatePresence } from 'framer-motion';
import { useTrial } from '@/hooks/useTrial';
import { useSubscription, STRIPE_PRICES } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Sparkles, Crown, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export function TrialBanner() {
  const { isTrialActive, isTrialExpired, hoursRemaining, minutesRemaining, isLoading } = useTrial();
  const { openCheckout, isSubscribed } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if loading, subscribed, or dismissed
  if (isLoading || isSubscribed || dismissed) {
    return null;
  }

  // Show upgrade message if trial expired
  if (isTrialExpired) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <Card className="border-destructive/50 bg-gradient-to-br from-destructive/10 via-background to-destructive/5 shadow-lg shadow-destructive/10">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base">
                      Seu período de teste terminou
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Faça upgrade para continuar transformando sua vida com o Focus30. 
                      Desbloqueie todas as missões, protocolos de foco e o Coach AI.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => openCheckout(STRIPE_PRICES.monthly.priceId)}
                  className="w-full md:w-auto shrink-0 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Fazer Upgrade
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show trial countdown if trial is active
  if (isTrialActive) {
    const timeText = hoursRemaining > 0 
      ? `${hoursRemaining}h ${minutesRemaining}min restantes`
      : `${minutesRemaining} minutos restantes`;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-medium text-foreground">
                      <span className="text-primary font-semibold">Trial Gratuito</span>
                      {' • '}
                      <span className="text-muted-foreground">{timeText}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCheckout(STRIPE_PRICES.monthly.priceId)}
                    className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                  >
                    Fazer Upgrade
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setDismissed(true)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
