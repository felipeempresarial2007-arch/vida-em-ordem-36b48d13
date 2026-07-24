import { motion } from 'framer-motion';
import { useSubscription, STRIPE_PRICES } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Zap, Check, Shield, Star, Infinity as InfinityIcon } from 'lucide-react';

export function TrialPaywall() {
  const { openCheckout } = useSubscription();

  const features = [
    'Acesso vitalício ao Focus 30',
    'Todas as missões diárias e módulos',
    'Coach IA ilimitado 24/7',
    'Controle financeiro completo',
    'Rastreamento de hábitos e metas',
    'Sem mensalidades — pague uma vez',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md my-8"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center"
          >
            <Crown className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Seu período de teste terminou
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Desbloqueie o Focus 30 para sempre com um único pagamento.
          </p>
        </div>

        <Card className="relative border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Oferta especial
            </span>
          </div>
          <CardContent className="p-6 flex flex-col">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1 text-foreground">
                <InfinityIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Acesso Vitalício</h3>
              </div>
              <div className="flex items-baseline justify-center gap-1 mt-3">
                <span className="text-lg font-bold text-foreground">R$</span>
                <span className="text-5xl font-bold text-foreground">4,90</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pagamento único — sem mensalidades</p>
            </div>

            <ul className="space-y-2.5 mb-6">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => openCheckout(STRIPE_PRICES.lifetime.priceId)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              Garantir acesso vitalício
            </Button>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground"
        >
          <Shield className="w-4 h-4" />
          Pagamento seguro via Stripe
        </motion.div>
      </motion.div>
    </div>
  );
}
