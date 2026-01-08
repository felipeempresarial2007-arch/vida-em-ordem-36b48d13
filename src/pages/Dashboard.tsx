import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getRandomQuote, STAGE_INFO } from '@/lib/missions';
import { Loader2, Trophy, ArrowRight, Calendar, CheckCircle2, Flame, Sparkles, TrendingUp, Zap, Star, Crown, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const { 
    loading, 
    progress, 
    todayMission, 
    missionTemplate,
    updateChecklist,
    updateReflection,
    completeMission 
  } = useChallengeProgress();

  const [quote] = useState(getRandomQuote());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-soft">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Carregando seu progresso...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Erro ao carregar dados</p>
      </div>
    );
  }

  const isCompleted = progress.completedAt !== null;
  const currentStage = progress.currentStage as keyof typeof STAGE_INFO;
  const progressPercent = Math.round((progress.currentDay / 30) * 100);
  const stageInfo = STAGE_INFO[currentStage];

  const allChecked = todayMission?.checklist?.every(Boolean) ?? false;
  const reflection = todayMission?.reflection || '';
  const canComplete = allChecked && reflection.trim().length > 0;

  return (
    <motion.div 
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Welcome Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Bem-vindo de volta</p>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Seu Progresso
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Continue sua jornada de transformação pessoal
        </p>
      </motion.div>

      {/* Challenge Completed */}
      {isCompleted && (
        <MotionCard
          variants={fadeInUp}
          className="border-0 overflow-hidden shadow-2xl"
        >
          <div className="gradient-primary p-8 md:p-10 text-center text-primary-foreground relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <motion.div 
                className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-5"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-10 h-10" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Parabéns! 🎉</h2>
              <p className="text-white/90 max-w-md mx-auto text-base leading-relaxed">
                Você completou o desafio FOCUS 30! Sua dedicação trouxe resultados incríveis.
              </p>
              <Link to="/continuacao">
                <Button variant="secondary" size="lg" className="mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Continuar Jornada
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </MotionCard>
      )}

      {/* Stats Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { 
            icon: Calendar, 
            value: progress.currentDay, 
            label: 'de 30 dias',
            color: 'primary',
            gradient: 'from-primary/10 to-primary/5'
          },
          { 
            icon: TrendingUp, 
            value: `${progressPercent}%`, 
            label: 'completo',
            color: 'secondary',
            gradient: 'from-secondary/10 to-secondary/5'
          },
          { 
            icon: Star, 
            value: stageInfo.name.split(' ')[0], 
            label: 'etapa atual',
            color: 'violet',
            gradient: 'from-violet-500/10 to-purple-500/5'
          },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className={cn('p-4 md:p-5 text-center relative bg-gradient-to-br', stat.gradient)}>
              <div className={cn(
                'w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110',
                stat.color === 'primary' ? 'bg-primary/15 border border-primary/20' : 
                stat.color === 'secondary' ? 'bg-secondary/15 border border-secondary/20' :
                'bg-violet-500/15 border border-violet-500/20'
              )}>
                <stat.icon className={cn(
                  'w-5 h-5',
                  stat.color === 'primary' ? 'text-primary' : 
                  stat.color === 'secondary' ? 'text-secondary' :
                  'text-violet-500'
                )} />
              </div>
              <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Progress Bar Card */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="border-border/50 overflow-hidden"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Progresso do Desafio</p>
              <p className="text-xs text-muted-foreground mt-0.5">Dia {progress.currentDay} de 30</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold text-primary">{progressPercent}%</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Stage Pills */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage) => {
              const info = STAGE_INFO[stage];
              const isActive = stage === currentStage;
              const isStageCompleted = info.days[info.days.length - 1] < progress.currentDay;
              
              return (
                <div
                  key={stage}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    isActive && 'bg-primary text-primary-foreground shadow-md',
                    isStageCompleted && 'bg-secondary/15 text-secondary',
                    !isActive && !isStageCompleted && 'bg-muted text-muted-foreground'
                  )}
                >
                  {info.name.split(' ')[0]}
                </div>
              );
            })}
          </div>
        </CardContent>
      </MotionCard>

      {/* Quote Card - Premium Design */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-0 overflow-hidden relative group"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
        
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
        
        {/* Large Quote Mark - Decorative */}
        <div className="absolute top-4 left-4 text-primary/10 pointer-events-none">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
          </svg>
        </div>
        
        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon Badge */}
            <motion.div 
              className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            
            {/* Label */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                Pensamento do Dia
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
            
            {/* Quote Text */}
            <motion.p 
              className="text-lg md:text-xl font-medium text-foreground leading-relaxed max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="text-primary/60">"</span>
              {quote}
              <span className="text-primary/60">"</span>
            </motion.p>
            
            {/* Decorative Bottom Element */}
            <div className="flex items-center gap-1.5 mt-6">
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary/40"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full bg-primary/60"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary/40"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </CardContent>
      </MotionCard>

      {/* Today's Mission */}
      {!isCompleted && missionTemplate && todayMission && (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="border-0 overflow-hidden shadow-xl"
        >
          {/* Mission Header */}
          <div className="p-6 gradient-primary relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                  {stageInfo.name}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                  Dia {missionTemplate.day}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {missionTemplate.title}
              </h2>
              <p className="text-white/90 text-sm mt-2 leading-relaxed max-w-lg">
                {missionTemplate.description}
              </p>
            </div>
          </div>

          {/* Checklist */}
          {!todayMission.completed && (
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3">
                {missionTemplate.checklist.map((item, index) => (
                  <label
                    key={index}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200',
                      todayMission.checklist[index] 
                        ? 'bg-secondary/10 border border-secondary/20' 
                        : 'bg-muted/50 border border-transparent hover:bg-muted'
                    )}
                  >
                    <Checkbox
                      checked={todayMission.checklist[index]}
                      onCheckedChange={(checked) => updateChecklist(index, checked as boolean)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className={cn(
                        'text-sm font-medium',
                        todayMission.checklist[index] && 'line-through text-muted-foreground'
                      )}>
                        {item}
                      </span>
                    </div>
                    {todayMission.checklist[index] && (
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    )}
                  </label>
                ))}
              </div>

              {/* Reflection */}
              {allChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <div className="p-5 bg-muted/50 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">
                        Reflexão do Dia
                      </h4>
                    </div>
                    <Textarea
                      placeholder="Como foi realizar esta missão? O que você aprendeu?"
                      value={reflection}
                      onChange={(e) => updateReflection(e.target.value)}
                      className="min-h-24 resize-none bg-background border-border/50"
                    />
                  </div>
                </motion.div>
              )}

              {/* Complete Button */}
              <Button
                className="w-full h-12 rounded-xl text-base font-semibold"
                size="lg"
                disabled={!canComplete}
                onClick={completeMission}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Concluir Missão
              </Button>
              {!allChecked && (
                <p className="text-center text-xs text-muted-foreground">
                  Complete todos os itens para prosseguir
                </p>
              )}
            </CardContent>
          )}

          {/* Completed State */}
          {todayMission.completed && (
            <CardContent className="p-6">
              <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Missão Completa!</h3>
                  <p className="text-muted-foreground text-sm">
                    Excelente trabalho! Volte amanhã para a próxima missão.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </MotionCard>
      )}

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage, index) => {
            const info = STAGE_INFO[stage];
            const isActive = stage === currentStage;
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/${stage}`}
                  className={cn(
                    'block p-5 rounded-2xl border transition-all duration-300 group',
                    isActive 
                      ? 'border-primary/30 bg-primary/5 shadow-md' 
                      : 'border-border/50 bg-card hover:border-primary/20 hover:shadow-lg hover:-translate-y-1'
                  )}
                >
                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110',
                    info.gradient
                  )}>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">{info.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {info.description}
                  </p>
                  {isActive && (
                    <span className="inline-block mt-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                      Etapa Atual
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Community Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <a
          href="#" // TODO: Substituir pelo link do grupo Telegram/WhatsApp
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
            <CardContent className="p-6 relative">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center gap-5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-foreground">Comunidade</h3>
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Junte-se ao nosso grupo exclusivo e conecte-se com outros participantes do desafio
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
                  Em breve
                </span>
              </div>
            </CardContent>
          </Card>
        </a>
      </motion.div>
    </motion.div>
  );
}
