import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
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
  Sparkles,
  Check,
  Rocket
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

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const benefits = [
    {
      icon: Home,
      title: 'Ambiente Organizado',
      description: 'Elimine a desordem e crie espaços que inspiram produtividade e paz mental.',
      color: 'bg-orange-100 text-primary'
    },
    {
      icon: Wallet,
      title: 'Finanças no Controle',
      description: 'Saia das dívidas, economize mais e construa uma base financeira sólida.',
      color: 'bg-green-100 text-secondary'
    },
    {
      icon: Calendar,
      title: 'Rotina Estruturada',
      description: 'Desenvolva hábitos que transformam e maximize sua energia diária.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Target,
      title: 'Metas Claras',
      description: 'Defina objetivos significativos e crie um plano de ação para alcançá-los.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Crie sua conta',
      description: 'Cadastre-se gratuitamente em menos de 1 minuto'
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
      name: 'Marina Silva',
      role: 'Empreendedora',
      content: 'O FOCUS 30 mudou completamente minha relação com organização. Hoje tenho mais tempo e menos estresse.',
      avatar: 'M',
      rating: 5
    },
    {
      name: 'Carlos Eduardo',
      role: 'Desenvolvedor',
      content: 'Finalmente consegui organizar minhas finanças e criar uma reserva de emergência. Recomendo demais!',
      avatar: 'C',
      rating: 5
    },
    {
      name: 'Ana Beatriz',
      role: 'Designer',
      content: 'As missões diárias são práticas e fáceis de seguir. Vi resultados já na primeira semana.',
      avatar: 'A',
      rating: 5
    }
  ];

  const stats = [
    { value: '4', label: 'Pilares de organização' },
    { value: '30', label: 'Dias de desafio' },
    { value: '4.9', label: 'Avaliação média' },
    { value: '24/7', label: 'Coach IA disponível' }
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
      question: 'O app é gratuito?',
      answer: 'Sim! Durante a fase de testes, o acesso é totalmente gratuito para todos os usuários cadastrados.'
    }
  ];

  const planFeatures = [
    { text: 'Desafio completo de 30 dias', included: true },
    { text: 'Coach IA disponível 24/7', included: true },
    { text: 'Protocolo de Foco (Neuro-Performance)', included: true },
    { text: 'Missões diárias personalizadas', included: true },
    { text: 'Módulo de Ambiente e Organização', included: true },
    { text: 'Módulo de Finanças avançado', included: true },
    { text: 'Módulo de Rotina e Hábitos', included: true },
    { text: 'Módulo de Metas e Objetivos', included: true }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Recursos
              </a>
              <Link to="/auth">
                <Button variant="ghost" className="text-sm">
                  Entrar
                </Button>
              </Link>
              <Button className="rounded-full px-6" onClick={handleGetStarted}>
                Começar grátis
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Button size="sm" className="rounded-full" onClick={handleGetStarted}>
                Começar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -translate-x-1/2" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Rocket className="w-4 h-4" />
              Acesso gratuito durante o MVP
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
            >
              Organize sua vida
              <span className="block text-primary">com clareza e foco</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Um método comprovado para organizar seu ambiente, finanças, rotina e metas. 
              Saia do caos para a clareza com missões diárias simples e práticas.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Button 
                size="xl" 
                className="rounded-full w-full sm:w-auto px-8 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                onClick={handleGetStarted}
              >
                Começar minha transformação
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" />
                <span>Coach IA incluso</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span>15-30 min/dia</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" />
                <span>Protocolo de Foco</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Benefícios</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              4 pilares da transformação
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              O FOCUS 30 trabalha nas 4 áreas fundamentais que, quando organizadas, transformam completamente sua qualidade de vida.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Como funciona</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Simples, prático e eficaz
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Em apenas 4 passos você estará no caminho da transformação completa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                
                <div className="relative z-10 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white text-2xl font-bold mb-5 shadow-lg shadow-primary/30">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button 
              size="lg" 
              className="rounded-full px-8"
              onClick={handleGetStarted}
            >
              Começar agora
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Histórias de transformação
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veja o que pessoas reais estão dizendo sobre o FOCUS 30.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-foreground mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
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

      {/* Features Section (replaced pricing) */}
      <section id="pricing" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Acesso Antecipado</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Gratuito durante o MVP
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Seja um dos primeiros a experimentar o FOCUS 30 e ajude a moldar o futuro do app.
            </p>
          </motion.div>

          {/* Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="relative p-8 md:p-10 rounded-3xl bg-card border-2 border-secondary/20 shadow-2xl shadow-secondary/10">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Acesso Gratuito
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Acesso Completo</h3>
                <p className="text-muted-foreground">Todos os recursos liberados para você testar</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl md:text-7xl font-bold text-foreground">
                    Grátis
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Durante a fase de testes
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                size="xl" 
                className="w-full rounded-xl text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                onClick={handleGetStarted}
              >
                Criar conta gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Trust Elements */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-secondary" />
                    <span>Vagas limitadas</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              Acesso gratuito por tempo limitado
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Comece sua jornada de organização
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Tenha acesso ao método completo com Coach IA, Protocolo de Foco e todos os módulos — tudo gratuito durante o MVP.
            </p>
            <Button 
              size="xl" 
              variant="secondary"
              className="rounded-full px-10 shadow-xl hover:shadow-2xl transition-all bg-white text-primary hover:bg-white/90"
              onClick={handleGetStarted}
            >
              Começar agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-white/60 text-sm mt-6 flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Coach IA 24/7</span>
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4" /> Protocolo de Foco</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Vagas limitadas</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 FOCUS 30. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
