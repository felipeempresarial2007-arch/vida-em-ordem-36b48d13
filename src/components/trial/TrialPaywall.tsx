import { motion } from 'framer-motion';
import { useSubscription, STRIPE_PRICES } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Zap, Check, Shield, Star } from 'lucide-react';

export function TrialPaywall() {
  const { openCheckout } = useSubscription();

  const plans = [
    {
      id: 'monthly',
      name: 'Mensal',
      price: 'R$ 27,90',
      period: '/mês',
      priceId: STRIPE_PRICES.monthly.priceId,
      features: [
        'Todas as missões diárias',
        'Protocolos de foco avançados',
        'Coach AI ilimitado',
        'Controle financeiro',
        'Rastreamento de hábitos',
      ],
      highlight: false,
    },
    {
      id: 'annual',
      name: 'Anual',
      price: 'R$ 17,57',
      period: '/mês',
      subtitle: 'Cobrado R$ 210,90/ano',
      badge: 'Economize 37%',
      priceId: STRIPE_PRICES.annual.priceId,
      features: [
        'Tudo do plano mensal',
        'Economia de 37%',
        'Acesso prioritário a novidades',
        'Suporte premium',
        'Garantia de 7 dias',
      ],
      highlight: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-3xl my-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
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
            Seus 7 dias gratuitos chegaram ao fim. Continue sua transformação 
            com acesso completo ao Focus 30.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                  plan.highlight
                    ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                    {plan.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{plan.subtitle}</p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => openCheckout(plan.priceId)}
                    className={`w-full ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground'
                        : ''
                    }`}
                    variant={plan.highlight ? 'default' : 'outline'}
                    size="lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Assinar {plan.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground"
        >
          <Shield className="w-4 h-4" />
          Pagamento seguro via Stripe • Cancele quando quiser
        </motion.div>
      </motion.div>
    </div>
  );
}
