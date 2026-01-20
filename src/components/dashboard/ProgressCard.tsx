import React, { useMemo, useState } from 'react';
import { STAGE_INFO } from '@/lib/missions';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TrendingUp, Target, Zap, CheckCircle2, Clock, Flame, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

interface StageData {
  name: string;
  days: number[];
  gradient: string;
}

type StageKey = keyof typeof STAGE_INFO;

interface ProgressCardProps {
  currentDay: number;
  totalDays: number;
  currentStage: StageKey;
  className?: string;
}

// --- Sub-Components ---

interface StagePillProps {
  stageKey: StageKey;
  info: StageData;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

const StagePill = React.memo(({ info, isActive, isCompleted, index }: StagePillProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
      className={cn(
        'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 relative overflow-hidden',
        isActive && 'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
        isCompleted && 'bg-secondary/15 text-secondary',
        !isActive && !isCompleted && 'bg-muted/80 text-muted-foreground'
      )}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <span className="relative z-10">{info.name}</span>
    </motion.div>
  );
});

StagePill.displayName = 'StagePill';

// --- Progress Insights Logic ---

interface ProgressInsight {
  title: string;
  message: string;
  icon: React.ReactNode;
  type: 'success' | 'motivation' | 'tip';
}

function getProgressInsights(currentDay: number, totalDays: number, currentStage: StageKey): ProgressInsight[] {
  const progress = (currentDay / totalDays) * 100;
  const daysRemaining = totalDays - currentDay;
  const stageInfo = STAGE_INFO[currentStage];
  const stageDaysLeft = stageInfo.days[stageInfo.days.length - 1] - currentDay + 1;
  
  const insights: ProgressInsight[] = [];

  if (progress < 25) {
    insights.push({
      title: 'Início da Jornada',
      message: `Você está construindo os alicerces do seu novo eu. Cada dia conta! Faltam ${daysRemaining} dias para completar o desafio.`,
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      type: 'motivation'
    });
  } else if (progress < 50) {
    insights.push({
      title: 'Ganhando Momentum',
      message: `Excelente! Você já percorreu ${Math.round(progress)}% do caminho. A consistência está se tornando seu superpoder.`,
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      type: 'success'
    });
  } else if (progress < 75) {
    insights.push({
      title: 'Metade do Caminho!',
      message: `Você ultrapassou a metade! ${Math.round(progress)}% concluído. A disciplina já faz parte de quem você é.`,
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      type: 'success'
    });
  } else if (progress < 100) {
    insights.push({
      title: 'Reta Final!',
      message: `Apenas ${daysRemaining} dias restantes! Você está a ${100 - Math.round(progress)}% de transformar sua vida.`,
      icon: <Target className="w-5 h-5 text-purple-500" />,
      type: 'motivation'
    });
  } else {
    insights.push({
      title: 'Desafio Completo!',
      message: 'Parabéns! Você completou os 30 dias. Agora é hora de manter e evoluir seus novos hábitos.',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      type: 'success'
    });
  }

  const stageTips: Record<StageKey, string> = {
    rotina: 'Foque em dormir e acordar no mesmo horário. A consistência do sono é a base de toda produtividade.',
    ambiente: 'Um ambiente organizado reduz o ruído mental. Comece pelo espaço onde você passa mais tempo.',
    financas: 'Clareza financeira traz paz mental. Registre cada gasto, por menor que seja.',
    metas: 'Metas claras direcionam sua energia. Divida objetivos grandes em ações diárias pequenas.'
  };

  insights.push({
    title: `Dica para ${stageInfo.name}`,
    message: stageTips[currentStage],
    icon: <Target className="w-5 h-5 text-primary" />,
    type: 'tip'
  });

  if (stageDaysLeft > 0) {
    insights.push({
      title: 'Ação de Hoje',
      message: `Você está no dia ${currentDay}. Faltam ${stageDaysLeft} dias para concluir a etapa "${stageInfo.name}". Complete a missão de hoje para manter o ritmo!`,
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      type: 'motivation'
    });
  }

  return insights;
}

// --- Main Component ---

export default function ProgressCard({ 
  currentDay, 
  totalDays, 
  currentStage,
  className 
}: ProgressCardProps) {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  
  const progress = useMemo(() => {
    if (totalDays <= 0) return 0;
    const rawProgress = (currentDay / totalDays) * 100;
    return Math.min(100, Math.max(0, Math.round(rawProgress)));
  }, [currentDay, totalDays]);

  const insights = useMemo(() => 
    getProgressInsights(currentDay, totalDays, currentStage),
    [currentDay, totalDays, currentStage]
  );

  const stageInfo = STAGE_INFO[currentStage];
  const daysRemaining = totalDays - currentDay;

  return (
    <>
      {/* Main Progress Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/50 shadow-xl",
          "bg-gradient-to-br from-card via-card to-muted/30",
          className
        )}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Desafio Ativo
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Dia {currentDay}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  / {totalDays}
                </span>
              </h2>
            </div>
            
            {/* Progress Circle */}
            <div className="relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(24 75% 55%)" />
                    <stop offset="100%" stopColor="hsl(16 90% 48%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Clickable Progress Bar */}
          <motion.button
            onClick={() => setIsInsightsOpen(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
            aria-label="Ver insights detalhados do progresso"
          >
            <div className="bg-muted/50 rounded-xl p-4 border border-border/50 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-muted/70 group-hover:shadow-lg">
              {/* Progress Bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden shadow-inner mb-3">
                <motion.div 
                  className="absolute inset-y-0 left-0 gradient-progress rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                </motion.div>
                
                {/* Progress indicator dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-primary"
                  initial={{ left: '0%' }}
                  animate={{ left: `calc(${Math.min(progress, 95)}% - 8px)` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {daysRemaining} dias restantes
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Ver insights</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.button>

          {/* Stage Pills */}
          <div className="flex gap-2 flex-wrap mt-4">
            {(Object.keys(STAGE_INFO) as Array<StageKey>).map((stage, index) => {
              const info = STAGE_INFO[stage];
              const lastDayOfStage = info.days?.[info.days.length - 1] ?? 0;
              const isCompleted = lastDayOfStage < currentDay;
              const isActive = stage === currentStage;
              
              return (
                <StagePill
                  key={stage}
                  stageKey={stage}
                  info={info}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Progress Insights Sheet */}
      <Sheet open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-t border-border/50">
          <SheetHeader className="text-left pb-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-progress flex items-center justify-center shadow-lg shadow-primary/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold">Seu Progresso</SheetTitle>
                <SheetDescription className="text-sm">
                  Análise estratégica do desafio
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="py-6 space-y-5">
            {/* Progress Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl p-5 border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-muted-foreground">Progresso Total</span>
                  <span className="text-3xl font-bold text-primary">{progress}%</span>
                </div>
                
                <div className="h-3 bg-background/60 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full gradient-progress rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
                
                <div className="flex justify-between mt-3 text-xs font-medium">
                  <span className="text-foreground">Dia {currentDay}</span>
                  <span className="text-muted-foreground">{daysRemaining} dias restantes</span>
                </div>
              </div>
            </motion.div>

            {/* Current Stage Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-4 border border-border bg-card"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                  stageInfo.gradient
                )}>
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Etapa Atual</p>
                  <h4 className="text-lg font-bold text-foreground">{stageInfo.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {stageInfo.days[stageInfo.days.length - 1] - currentDay + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">dias</p>
                </div>
              </div>
            </motion.div>

            {/* Insights Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                Insights & Dicas
              </h4>
              <AnimatePresence>
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    className={cn(
                      "rounded-xl p-4 border backdrop-blur-sm",
                      insight.type === 'success' && "bg-green-500/5 border-green-500/20",
                      insight.type === 'motivation' && "bg-orange-500/5 border-orange-500/20",
                      insight.type === 'tip' && "bg-primary/5 border-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-background/50">
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-foreground text-sm mb-1">{insight.title}</h5>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Motivational Quote */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-5 bg-muted/30 border border-border/50 text-center"
            >
              <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-sm italic text-foreground font-medium">
                "A jornada de mil milhas começa com um único passo."
              </p>
              <p className="text-xs text-muted-foreground mt-2">— Lao Tzu</p>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
