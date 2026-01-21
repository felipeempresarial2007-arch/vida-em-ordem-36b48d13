import React, { useMemo, useState } from 'react';
import { STAGE_INFO } from '@/lib/missions';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TrendingUp, Target, Zap, CheckCircle2, Clock, Flame, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StageKey = keyof typeof STAGE_INFO;

interface ProgressCardProps {
  currentDay: number;
  totalDays: number;
  currentStage: StageKey;
  className?: string;
}

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
      message: `Você está construindo os alicerces. Cada dia conta! Faltam ${daysRemaining} dias.`,
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      type: 'motivation'
    });
  } else if (progress < 50) {
    insights.push({
      title: 'Ganhando Momentum',
      message: `Excelente! Você já percorreu ${Math.round(progress)}% do caminho.`,
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      type: 'success'
    });
  } else if (progress < 75) {
    insights.push({
      title: 'Metade do Caminho!',
      message: `${Math.round(progress)}% concluído. A disciplina já faz parte de você.`,
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      type: 'success'
    });
  } else if (progress < 100) {
    insights.push({
      title: 'Reta Final!',
      message: `Apenas ${daysRemaining} dias restantes! Você está quase lá.`,
      icon: <Target className="w-4 h-4 text-purple-500" />,
      type: 'motivation'
    });
  } else {
    insights.push({
      title: 'Desafio Completo!',
      message: 'Parabéns! Você completou os 30 dias.',
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      type: 'success'
    });
  }

  const stageTips: Record<StageKey, string> = {
    rotina: 'Foque em dormir e acordar no mesmo horário.',
    ambiente: 'Um ambiente organizado reduz o ruído mental.',
    financas: 'Clareza financeira traz paz mental.',
    metas: 'Metas claras direcionam sua energia.'
  };

  insights.push({
    title: `Dica: ${stageInfo.name}`,
    message: stageTips[currentStage],
    icon: <Target className="w-4 h-4 text-primary" />,
    type: 'tip'
  });

  if (stageDaysLeft > 0) {
    insights.push({
      title: 'Próximos Passos',
      message: `Faltam ${stageDaysLeft} dias para concluir "${stageInfo.name}".`,
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      type: 'motivation'
    });
  }

  return insights;
}

export default function ProgressCard({ 
  currentDay, 
  totalDays, 
  currentStage,
  className 
}: ProgressCardProps) {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  
  const progress = useMemo(() => {
    if (totalDays <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((currentDay / totalDays) * 100)));
  }, [currentDay, totalDays]);

  const insights = useMemo(() => 
    getProgressInsights(currentDay, totalDays, currentStage),
    [currentDay, totalDays, currentStage]
  );

  const stageInfo = STAGE_INFO[currentStage];
  const daysRemaining = totalDays - currentDay;

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Seu Progresso</p>
              <p className="text-lg font-bold text-foreground">
                Dia {currentDay} <span className="text-muted-foreground font-normal">/ {totalDays}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{progress}%</p>
              <p className="text-xs text-muted-foreground">{daysRemaining} dias</p>
            </div>
          </div>

          {/* Clickable Progress Bar */}
          <button
            onClick={() => setIsInsightsOpen(true)}
            className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg group"
            aria-label="Ver insights do progresso"
          >
            <div className="p-3 -mx-1 rounded-lg transition-colors hover:bg-accent/50 active:bg-accent">
              <Progress value={progress} className="h-2.5 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Etapa: <span className="font-medium text-foreground">{stageInfo.name}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-primary group-hover:underline">
                  Ver insights
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Insights Sheet */}
      <Sheet open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
          <SheetHeader className="text-left pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle>Insights & Dicas</SheetTitle>
                <SheetDescription>
                  Análise do seu progresso no desafio
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="py-4 space-y-4">
            {/* Progress Summary */}
            <div className="p-4 rounded-xl bg-muted/50 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso Total</span>
                <span className="text-xl font-bold text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Dia {currentDay}</span>
                <span>{daysRemaining} restantes</span>
              </div>
            </div>

            {/* Current Stage */}
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stageInfo.gradient)}>
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Etapa Atual</p>
                  <p className="font-semibold">{stageInfo.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {stageInfo.days[stageInfo.days.length - 1] - currentDay + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">dias</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                Dicas Personalizadas
              </h4>
              <AnimatePresence>
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-3 rounded-lg border",
                      insight.type === 'success' && "bg-green-500/5 border-green-500/20",
                      insight.type === 'motivation' && "bg-orange-500/5 border-orange-500/20",
                      insight.type === 'tip' && "bg-primary/5 border-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{insight.icon}</div>
                      <div>
                        <h5 className="font-medium text-sm">{insight.title}</h5>
                        <p className="text-xs text-muted-foreground mt-0.5">{insight.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
