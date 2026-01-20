import React, { useMemo, useState } from 'react';
import { STAGE_INFO } from '@/lib/missions';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TrendingUp, Target, Zap, CheckCircle2, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

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
}

const StagePill = React.memo(({ info, isActive, isCompleted }: StagePillProps) => {
  return (
    <div
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        isActive && `${info.gradient} text-primary-foreground shadow-md`,
        isCompleted && 'bg-muted text-muted-foreground line-through',
        !isActive && !isCompleted && 'bg-muted text-muted-foreground'
      )}
    >
      {info.name}
    </div>
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

  // Progress-based message
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

  // Stage-specific tip
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

  // Day-specific action
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
  const labelId = "progress-card-label";
  const detailsId = "progress-card-details";

  return (
    <>
      <div 
        className={cn("bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up", className)}
        role="region"
        aria-labelledby={labelId}
        aria-describedby={detailsId}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 id={labelId} className="text-sm font-medium text-muted-foreground">
              Progresso do Desafio
            </h3>
            <p id={detailsId} className="text-3xl font-bold text-foreground mt-1">
              Dia {currentDay} <span className="text-lg font-normal text-muted-foreground">de {totalDays}</span>
            </p>
          </div>
          
          <div className="text-right" aria-hidden="true">
            <span className="text-4xl font-bold gradient-progress bg-clip-text text-transparent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Clickable Progress Bar - Highly Interactive */}
        <motion.button
          onClick={() => setIsInsightsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl p-3 -mx-3 hover:bg-accent/50 transition-colors duration-200"
          aria-label="Clique para ver insights detalhados do seu progresso"
        >
          <div className="relative">
            {/* Progress bar container */}
            <div 
              className="h-5 bg-muted rounded-full overflow-hidden relative shadow-inner transition-all duration-300 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-primary/30"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso do desafio: ${progress}%`}
            >
              <motion.div 
                className="h-full gradient-progress rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-200" />
              </motion.div>
            </div>
            
            {/* Click indicator */}
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="h-1 w-1 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
              <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">
                Toque para ver insights e dicas
              </p>
              <div className="h-1 w-1 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
            </div>
          </div>
        </motion.button>

        {/* Stage Pills */}
        <div className="flex gap-2 flex-wrap mt-3" role="list" aria-label="Etapas do desafio">
          {(Object.keys(STAGE_INFO) as Array<StageKey>).map((stage) => {
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
              />
            );
          })}
        </div>
      </div>

      {/* Progress Insights Sheet */}
      <Sheet open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="w-6 h-6 text-primary" />
              Seu Progresso
            </SheetTitle>
            <SheetDescription>
              Análise estratégica do seu desempenho no desafio
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Progresso Total</span>
                <span className="text-2xl font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full gradient-progress rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Dia {currentDay}</span>
                <span>{totalDays - currentDay} dias restantes</span>
              </div>
            </div>

            {/* Current Stage Info */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stageInfo.gradient)}>
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{stageInfo.name}</h4>
                  <p className="text-xs text-muted-foreground">Etapa atual</p>
                </div>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Insights & Dicas
              </h4>
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className={cn(
                    "rounded-xl p-4 border",
                    insight.type === 'success' && "bg-green-500/5 border-green-500/20",
                    insight.type === 'motivation' && "bg-orange-500/5 border-orange-500/20",
                    insight.type === 'tip' && "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{insight.icon}</div>
                    <div>
                      <h5 className="font-medium text-foreground text-sm">{insight.title}</h5>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Motivational Quote */}
            <div className="bg-muted/50 rounded-2xl p-4 text-center">
              <p className="text-sm italic text-muted-foreground">
                "A jornada de mil milhas começa com um único passo."
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">— Lao Tzu</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
