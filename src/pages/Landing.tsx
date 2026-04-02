import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, STRIPE_PRICES } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  TrendingUp
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
  const { openCheckout, isSubscribed } = useSubscription();

  const handleGetStarted = async () => {
    if (user) {
      if (isSubscribed) {
        navigate('/dashboard');
      } else {
        openCheckout(STRIPE_PRICES.monthly.priceId);
      }
    } else {
      // For non-logged users, redirect to Stripe checkout directly (guest checkout)
      try {
        toast.loading('Redirecionando para o checkout...', { id: 'checkout' });
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { 
            priceId: STRIPE_PRICES.monthly.priceId, 
            guestCheckout: true,
          },
        });
        
        if (error || !data?.url) {
          toast.dismiss('checkout');
          toast.error('Erro ao criar sessão de checkout');
          return;
        }
        
        toast.dismiss('checkout');
        window.open(data.url, '_blank');
      } catch (error) {
        toast.dismiss('checkout');
        toast.error('Erro ao processar checkout');
      }
    }
  };

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40">
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
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20" onClick={handleGetStarted}>
                Quero começar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Button size="sm" className="rounded-full shadow-md shadow-primary/20" onClick={handleGetStarted}>
                Começar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
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
            {/* Trust Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-full text-sm font-semibold mb-8 border border-primary/20"
            >
              <TrendingUp className="w-4 h-4" />
              Vagas abertas para o ciclo atual
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight"
            >
              Organize sua vida
              <span className="block bg-gradient-to-r from-primary via-primary to-orange-500 bg-clip-text text-transparent">
                com clareza e foco
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

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Button 
                size="xl" 
                className="rounded-full w-full sm:w-auto px-10 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 text-base"
                onClick={handleGetStarted}
              >
                Começar minha transformação
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
              className="rounded-full px-10 shadow-lg shadow-primary/25"
              onClick={handleGetStarted}
            >
              Começar agora
              <ChevronRight className="w-5 h-5 ml-1" />
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

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <div className="relative p-8 md:p-12 rounded-[2rem] bg-card border-2 border-primary/20 shadow-2xl shadow-primary/10">
              {/* Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-xl shadow-primary/30">
                  <Zap className="w-4 h-4" />
                  Vagas Limitadas
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Acesso Completo ao FOCUS 30</h3>
                <p className="text-muted-foreground">Tudo o que você precisa para transformar sua vida</p>
              </div>

              {/* Price Comparison */}
              <div className="text-center mb-10 p-6 rounded-2xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-3">
                  Valor normal: R$ 39,90 (sistema) + R$ 19,90 (Coach IA)
                </p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-xl line-through">R$ 58,80</span>
                  </div>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-muted-foreground">Por apenas</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-2xl font-bold text-primary">R$</span>
                  <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    27,90
                  </span>
                  <span className="text-xl text-muted-foreground">/mês</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-secondary/15 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                  <Rocket className="w-4 h-4" />
                  Economia de R$ 30,90
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-10">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${feature.highlight ? 'bg-primary/20' : 'bg-secondary/15'}`}>
                      <Check className={`w-4 h-4 ${feature.highlight ? 'text-primary' : 'text-secondary'}`} />
                    </div>
                    <span className={`${feature.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Anchor - Less than a snack */}
              <div className="text-center mb-8 py-4 border-y border-border/50">
                <p className="text-muted-foreground text-sm">
                  <span className="font-medium text-foreground">Menos que um lanche por semana</span> para organizar toda sua vida
                </p>
              </div>

              {/* CTA Button */}
              <Button 
                size="xl" 
                className="w-full rounded-2xl text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 py-7"
                onClick={handleGetStarted}
              >
                Quero garantir minha vaga
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Trust Elements */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span>Acesso imediato</span>
                </div>
              </div>
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
              className="rounded-full px-12 shadow-2xl transition-all duration-300 bg-white text-primary hover:bg-white/95 hover:scale-105 font-semibold"
              onClick={handleGetStarted}
            >
              Garantir minha vaga por R$ 27,90/mês
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
              © 2024 FOCUS 30. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
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
    </div>
  );
}
