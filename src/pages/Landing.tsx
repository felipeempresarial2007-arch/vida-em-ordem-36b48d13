import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { STRIPE_PRICES } from '@/hooks/useSubscription';

const FloatingWhatsApp = lazy(() => import('@/components/landing/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })));
import {
  ArrowRight, 
  Target, 
  Zap, 
  Calendar,
  Wallet,
  Home,
  Star,
  Quote,
  ChevronRight,
  Clock,
  Users,
  Check,
  Rocket,
  Smartphone,
  Shield,
  X,
  TrendingUp,
  Bot,
  Brain,
  MessageCircle,
  Sparkles,
  Lock,
  Flame,
  AlertCircle
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  

  // Countdown — termina à meia-noite do dia atual (renova diariamente para reforçar urgência real)
  const getEndOfDay = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  };
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({ h: 0, m: 0, s: 0 });
  const [spotsLeft] = useState<number>(() => {
    // Pseudo-aleatório estável por dia: entre 7 e 14 vagas
    const day = new Date().getDate();
    return 7 + (day % 8);
  });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, getEndOfDay() - Date.now());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };


  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const openStripeCheckout = useCallback(async (priceId: string) => {
    try {
      setCheckoutLoading(true);
      
      // If logged in, use authenticated checkout
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const isGuest = !session?.access_token;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, guestCheckout: isGuest },
        headers,
      });

      if (error) {
        toast.error('Erro ao criar sessão de checkout');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error('Erro ao processar checkout');
    } finally {
      setCheckoutLoading(false);
    }
  }, []);

  const handleGetStartedMonthly = useCallback(() => openStripeCheckout(STRIPE_PRICES.monthly.priceId), [openStripeCheckout]);
  const handleGetStartedAnnual = useCallback(() => openStripeCheckout(STRIPE_PRICES.annual.priceId), [openStripeCheckout]);

  const benefits = [
    {
      icon: Home,
      title: 'Ambiente Organizado',
      description: 'Elimine a desordem e crie espaços que inspiram produtividade e paz mental.'
    },
    {
      icon: Wallet,
      title: 'Finanças no Controle',
      description: 'Saia das dívidas, economize mais e construa uma base financeira sólida.'
    },
    {
      icon: Calendar,
      title: 'Rotina Estruturada',
      description: 'Desenvolva hábitos que transformam e maximize sua energia diária.'
    },
    {
      icon: Target,
      title: 'Metas Claras',
      description: 'Defina objetivos significativos e crie um plano de ação para alcançá-los.'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Crie sua conta',
      description: 'Comece em menos de 1 minuto e acesse o sistema'
    },
    {
      step: '02',
      title: 'Siga as missões diárias',
      description: 'Receba tarefas específicas para cada dia do desafio'
    },
    {
      step: '03',
      title: 'Acompanhe seu progresso',
      description: 'Visualize sua evolução e celebre cada conquista'
    },
    {
      step: '04',
      title: 'Transforme sua vida',
      description: 'Em 30 dias, você terá uma nova rotina e mentalidade'
    }
  ];

  const testimonials = [
    {
      name: 'Mariana Costa',
      role: '@mari.costa_',
      content: 'Gente, eu não acreditava muito no começo, mas depois de 2 semanas usando o FOCUS 30, minha casa tá outra coisa. Meu marido até perguntou o que aconteceu comigo kkk. Recomendo DEMAIS!',
      avatar: 'M',
      rating: 5
    },
    {
      name: 'Pedro Henrique',
      role: '@pedroh.dev',
      content: 'Cara, o coach IA é muito bom. Parece que ele entende exatamente o que você precisa ouvir. Já testei vários apps de organização e esse foi o único que realmente funcionou pra mim.',
      avatar: 'P',
      rating: 5
    },
    {
      name: 'Amanda Ribeiro',
      role: '@amandaribeiro',
      content: 'Tô no dia 18 e já consegui organizar minhas finanças pela primeira vez na vida! Antes vivia no vermelho, agora já tenho uma reservinha. O app é simples mas funciona de verdade.',
      avatar: 'A',
      rating: 5
    }
  ];

  const stats = [
    { value: '4', label: 'Pilares de organização' },
    { value: '30', label: 'Dias de desafio' },
    { value: '4.9', label: 'Avaliação dos usuários' },
    { value: '24/7', label: 'Suporte disponível' }
  ];

  const faqs = [
    {
      question: 'Quanto tempo preciso dedicar por dia?',
      answer: 'As missões foram desenhadas para serem práticas. A maioria leva entre 15 a 30 minutos por dia.'
    },
    {
      question: 'O FOCUS 30 funciona para quem tem pouco tempo?',
      answer: 'Sim! O método foi criado especialmente para pessoas com rotinas corridas. Cada missão é curta, objetiva e pode ser feita em qualquer momento do dia. Você não precisa de horas livres — precisa apenas de 15 minutos de foco real.'
    },
    {
      question: 'Posso usar o FOCUS 30 se já uso outros apps de produtividade?',
      answer: 'Com certeza. O FOCUS 30 não é apenas mais um app de tarefas — é um sistema de transformação com missões guiadas, coaching por IA e acompanhamento de progresso. Ele complementa qualquer ferramenta que você já use, trazendo a estrutura e a disciplina que faltam.'
    },
    {
      question: 'O Coach IA é realmente personalizado?',
      answer: 'Sim. O Coach IA analisa o seu contexto, entende suas dificuldades e oferece orientações sob medida para a sua situação. Não são respostas genéricas — é como ter um mentor pessoal disponível 24 horas por dia, 7 dias por semana.'
    },
    {
      question: 'E se eu perder um dia?',
      answer: 'Sem problemas! Você pode continuar de onde parou. O importante é não desistir e manter a consistência.'
    },
    {
      question: 'Como funciona o Coach IA?',
      answer: 'O Coach IA é seu assistente pessoal disponível 24/7. Ele responde dúvidas, dá orientações personalizadas e te ajuda a manter o foco durante todo o desafio.'
    },
    {
      question: 'Por quanto tempo tenho acesso?',
      answer: 'Enquanto sua assinatura estiver ativa, você tem acesso completo a todos os recursos, incluindo o Coach IA e a comunidade exclusiva.'
    }
  ];

  const planFeatures = [
    { text: 'Coach IA diário incluso', highlight: true },
    { text: 'Acesso à comunidade fechada para networking', highlight: true },
    { text: 'Desafios guiados por 30 dias', highlight: false },
    { text: 'Estrutura contínua de foco e disciplina', highlight: false },
    { text: 'Protocolo de Foco (Neuro-Performance)', highlight: false },
    { text: 'Módulos: Ambiente, Finanças, Rotina e Metas', highlight: false }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Urgency Bar — sticky no topo */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-orange-500 to-primary text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <button
            onClick={scrollToPricing}
            className="w-full flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold tracking-tight"
            aria-label="Ver oferta com vagas limitadas"
          >
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4 animate-pulse" />
              Últimas {spotsLeft} vagas do ciclo
            </span>
            <span className="sm:hidden inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              {spotsLeft} vagas
            </span>
            <span className="opacity-70">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Oferta encerra em
              <span className="font-mono tabular-nums bg-black/25 px-1.5 py-0.5 rounded">
                {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
              </span>
            </span>
            <ArrowRight className="hidden sm:inline w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-9 sm:top-10 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Preços
              </a>
              <Link to="/auth">
                <Button variant="ghost" className="text-sm font-medium">
                  Entrar
                </Button>
              </Link>
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20" onClick={scrollToPricing}>
                Garantir minha vaga
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="min-h-[48px] min-w-[48px]">
                  Entrar
                </Button>
              </Link>
              <Button size="sm" className="rounded-full shadow-md shadow-primary/20 min-h-[48px] px-5 text-sm font-semibold" onClick={scrollToPricing}>
                Garantir vaga
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 md:pt-52 md:pb-32 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-[120px] translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-[100px] -translate-x-1/3" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Trust Badges */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2.5 rounded-full text-sm font-semibold border border-destructive/20">
                <AlertCircle className="w-4 h-4" />
                Apenas {spotsLeft} vagas restantes neste ciclo
              </div>
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2.5 rounded-full text-sm font-semibold border border-secondary/20">
                <Users className="w-4 h-4" />
                +120 pessoas já usaram o Focus 30
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight"
            >
              A sensação de ter a vida
              <span className="block bg-gradient-to-r from-primary via-primary to-orange-500 bg-clip-text text-transparent">
                sob controle em 30 dias
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Um método comprovado para organizar seu ambiente, finanças, rotina e metas. 
              Saia do caos para a clareza com missões diárias simples e práticas.
            </motion.p>

            {/* Countdown Card — Escassez */}
            <motion.div
              variants={fadeInUp}
              className="max-w-xl mx-auto mb-10"
            >
              <div className="relative p-5 sm:p-6 rounded-3xl bg-card border-2 border-primary/30 shadow-2xl shadow-primary/10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
                    Oferta deste ciclo encerra em
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {[
                    { v: pad(timeLeft.h), l: 'Horas' },
                    { v: pad(timeLeft.m), l: 'Min' },
                    { v: pad(timeLeft.s), l: 'Seg' },
                  ].map((u, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex flex-col items-center min-w-[64px] sm:min-w-[80px] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-br from-primary to-orange-500 text-white shadow-lg shadow-primary/30">
                        <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums leading-none">{u.v}</span>
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide opacity-90 mt-1">{u.l}</span>
                      </div>
                      {i < 2 && <span className="text-2xl sm:text-3xl font-bold text-primary/40">:</span>}
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
                  Restam apenas <span className="font-bold text-foreground">{spotsLeft} vagas</span> com o preço promocional
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Button 
                size="xl" 
                className="cta-magnetic rounded-full sm:max-w-md border-0"
                onClick={scrollToPricing}
              >
                Garantir minha vaga no ciclo atual
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4 font-medium">Pagamento único de R$ 4,90 — acesso vitalício</p>
            </motion.div>

            {/* Trust Elements */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary" />
                </div>
                <span>Coach IA incluso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary" />
                </div>
                <span>15-30 min/dia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary" />
                </div>
                <span>Comunidade exclusiva</span>
              </div>
              <Link 
                to="/install" 
                className="flex items-center gap-2 hover:text-primary transition-colors font-medium"
              >
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Instale o app</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40 bg-gradient-to-b from-muted/50 to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-orange-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Benefícios</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-5 tracking-tight">
              4 pilares da transformação
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              O FOCUS 30 trabalha nas 4 áreas fundamentais que, quando organizadas, transformam completamente sua qualidade de vida.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/40 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Como funciona</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-5 tracking-tight">
              Simples, prático e eficaz
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Em apenas 4 passos você estará no caminho da transformação completa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
                )}
                
                <div className="relative z-10 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 text-white text-2xl font-bold mb-6 shadow-xl shadow-primary/30">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button 
              size="lg" 
              className="cta-magnetic rounded-full sm:max-w-md mx-auto border-0"
              onClick={scrollToPricing}
            >
              Garantir minha vaga no ciclo atual
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-5 tracking-tight">
              O que estão dizendo
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Pessoas reais compartilhando suas experiências com o FOCUS 30.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-primary/15 mb-4" />
                <p className="text-foreground mb-8 leading-relaxed text-[15px]">{testimonial.content}</p>
                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-primary/20">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Offer */}
      <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-muted/50 via-muted/30 to-transparent relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-[120px]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Oferta Especial</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-5 tracking-tight">
              Garanta sua vaga agora
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Estamos abrindo vagas para o ciclo atual do FOCUS 30.
            </p>
          </motion.div>

          {/* Single Lifetime Plan */}
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative p-8 md:p-10 rounded-[2rem] bg-card border-2 border-primary/30 shadow-2xl shadow-primary/10 h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xl shadow-primary/30">
                    <Zap className="w-3.5 h-3.5" />
                    Pagamento único — Acesso vitalício
                  </div>
                </div>

                <div className="text-center mb-6 pt-3">
                  <h3 className="text-xl font-bold text-foreground mb-1">Acesso Vitalício</h3>
                  <p className="text-muted-foreground text-sm">Pague uma vez, use para sempre</p>
                </div>

                <div className="text-center mb-8 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2 line-through">De R$ 210,90</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-xl font-bold text-primary">R$</span>
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">4,90</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Pagamento único — sem mensalidades</p>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {planFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${feature.highlight ? 'bg-primary/20' : 'bg-secondary/15'}`}>
                        <Check className={`w-3 h-3 ${feature.highlight ? 'text-primary' : 'text-secondary'}`} />
                      </div>
                      <span className={`text-sm ${feature.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full cta-magnetic rounded-2xl border-0"
                  onClick={handleGetStartedAnnual}
                  disabled={checkoutLoading}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Garantir acesso vitalício
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Trust Elements */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-secondary" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span>Acesso imediato</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-secondary" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Coach IA Section — Diferenciação */}
      <section id="coach-ia" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/10 to-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-[100px] translate-x-1/3" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 border border-secondary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Exclusivo Focus 30
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-tight">
              Coach IA: seu mentor pessoal
              <span className="block bg-gradient-to-r from-secondary via-primary to-orange-500 bg-clip-text text-transparent">
                disponível 24 horas por dia
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Não é um chatbot genérico. O Coach IA do Focus 30 foi treinado para entender seu contexto, suas dificuldades e te guiar com orientações sob medida em cada um dos 4 pilares do desafio.
            </p>
          </motion.div>

          {/* Visual demo + features */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Demo card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl bg-card border border-border/60 shadow-2xl shadow-primary/10 p-6 md:p-7 overflow-hidden">
                {/* Header chat */}
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-card" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-sm">Coach de IA</h3>
                      <span className="text-[10px] font-semibold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">Online</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mentor pessoal de produtividade</p>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="pt-5 space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-sm shadow-md">
                      Não consigo manter o foco depois do almoço. O que faço?
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-muted text-foreground text-sm leading-relaxed shadow-sm">
                      Queda de energia pós-refeição é fisiológica. Aplique o protocolo: 10 minutos de caminhada, hidrate-se e inicie o próximo bloco com Pomodoro de 25 minutos. Quer que eu programe agora?
                    </div>
                  </div>
                  <div className="flex gap-2 pl-10">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Iniciar Pomodoro
                    </button>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border">
                      Outra dica
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating accent */}
              <div className="absolute -top-4 -right-4 hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-secondary to-primary text-white text-xs font-bold shadow-xl shadow-primary/30">
                <Sparkles className="w-3.5 h-3.5" />
                Resposta em segundos
              </div>
            </motion.div>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              {[
                {
                  icon: Brain,
                  title: 'Treinado no método Focus 30',
                  desc: 'Conhece os 4 pilares — Ambiente, Finanças, Rotina e Metas — e adapta cada resposta ao seu momento no desafio.'
                },
                {
                  icon: MessageCircle,
                  title: 'Respostas personalizadas, nunca genéricas',
                  desc: 'Analisa seu progresso, identifica padrões e oferece orientações práticas baseadas no que você já realizou.'
                },
                {
                  icon: Clock,
                  title: 'Disponível 24/7, sem agenda',
                  desc: 'Travou em uma missão às 23h? Ele responde. Sem espera, sem custo extra, sem limites diários.'
                },
                {
                  icon: Lock,
                  title: 'Privado e seguro',
                  desc: 'Suas conversas são suas. Dados criptografados e nunca usados para treinar modelos externos.'
                }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary/15 to-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}

              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 shadow-lg shadow-primary/30 mt-2"
                onClick={scrollToPricing}
              >
                <Bot className="w-4 h-4 mr-2" />
                Ativar meu Coach IA agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tutorial Video Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Passo a passo</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 tracking-tight">
              Veja como é simples criar sua conta
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Em poucos segundos você cria seu acesso e começa seus <span className="text-primary font-semibold">7 dias grátis</span> no Focus 30. Sem complicação, sem burocracia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-card">
              <video
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                poster="/apple-touch-icon.png"
                className="w-full h-auto block bg-black"
                x-webkit-airplay="allow"
              >
                <source src="/tutorial-criar-conta.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos HTML5. <a href="/tutorial-criar-conta.mp4" className="underline">Baixe o vídeo aqui</a>.
              </video>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/30 min-h-[52px] text-base font-semibold"
                onClick={scrollToPricing}
              >
                Começar meus 7 dias grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-5 tracking-tight">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-7 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-orange-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Rocket className="w-4 h-4" />
              Últimas vagas disponíveis
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Sua transformação começa aqui
            </h2>
            <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Junte-se a quem já está organizando a vida com clareza, foco e o suporte de um Coach IA disponível 24 horas por dia.
            </p>
            <Button 
              size="xl" 
              className="cta-magnetic rounded-full sm:max-w-md mx-auto border-0"
              onClick={handleGetStartedAnnual}
            >
              Garantir acesso vitalício — R$ 4,90
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-white/60 text-sm mt-8 flex flex-wrap items-center justify-center gap-6">
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Coach IA 24/7</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Comunidade exclusiva</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Pagamento seguro</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2026 FOCUS 30. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">Termos</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
              <a 
                href="https://wa.me/5511920470829" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-green-500 transition-colors flex items-center gap-1.5"
              >
                <span className="text-lg">📱</span> Suporte WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <FloatingWhatsApp />
      </Suspense>
    </div>
  );
}

