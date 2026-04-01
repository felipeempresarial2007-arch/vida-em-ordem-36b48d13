import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getRandomQuote, STAGE_INFO } from '@/lib/missions';
import { Loader2, ArrowRight, CheckCircle2, Lightbulb, Brain, Calendar, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChallengeCompleteCard } from '@/components/dashboard/ChallengeCompleteCard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import { TrialBanner } from '@/components/trial/TrialBanner';

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
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
      className="space-y-4 md:space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trial Banner - Shows upgrade message after 24h */}
      <TrialBanner />

      {/* Header - Compact for mobile */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">
          Seu Progresso
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Dia {progress.currentDay}/30 • {stageInfo.name}
        </p>
      </div>

      {/* Challenge Completed - Full Card */}
      {isCompleted && progress.completedAt && (
        <ChallengeCompleteCard completedAt={progress.completedAt} />
      )}

      {/* Progress Card - Clickable with Insights */}
      <ProgressCard 
        currentDay={progress.currentDay}
        totalDays={30}
        currentStage={currentStage}
      />

      {/* Quote Card - Premium subtle gradient */}
      <Card className="bg-gradient-to-br from-muted/40 to-muted/20 border-border/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Pensamento do dia
              </p>
              <p className="text-sm text-foreground leading-relaxed font-medium">
                "{quote}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Protocol Card - Premium interactive */}
      <Link to="/focus-protocol">
        <Card className="group hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/8 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/12 transition-colors">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Protocolo de Foco</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Técnicas de neuro-performance
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </CardContent>
        </Card>
      </Link>

      {/* Today's Mission - Premium header gradient */}
      {!isCompleted && missionTemplate && todayMission && (
        <Card className="overflow-hidden shadow-lg shadow-primary/5">
          {/* Mission Header - Premium gradient */}
          <div className="p-5 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-foreground/80 mb-1.5">
              <span>{stageInfo.name}</span>
              <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
              <span>Dia {missionTemplate.day}</span>
            </div>
            <h2 className="text-lg font-bold">
              {missionTemplate.title}
            </h2>
            <p className="text-sm text-primary-foreground/85 mt-2 leading-relaxed">
              {missionTemplate.description}
            </p>
          </div>

          {/* Checklist - Premium styling */}
          {!todayMission.completed && (
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                {missionTemplate.checklist.map((item, index) => (
                  <label
                    key={index}
                    className={cn(
                      'flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200',
                      todayMission.checklist[index] 
                        ? 'bg-secondary/12 border border-secondary/20' 
                        : 'bg-muted/40 hover:bg-muted/60 border border-transparent'
                    )}
                  >
                    <Checkbox
                      checked={todayMission.checklist[index]}
                      onCheckedChange={(checked) => updateChecklist(index, checked as boolean)}
                      className="mt-0.5"
                    />
                    <span className={cn(
                      'text-sm flex-1 leading-relaxed',
                      todayMission.checklist[index] && 'line-through text-muted-foreground'
                    )}>
                      {item}
                    </span>
                    {todayMission.checklist[index] && (
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    )}
                  </label>
                ))}
              </div>

              {/* Reflection - Premium styling */}
              {allChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-2.5">
                      Reflexão do Dia
                    </h4>
                    <Textarea
                      placeholder="Como foi realizar esta missão? O que você aprendeu?"
                      value={reflection}
                      onChange={(e) => updateReflection(e.target.value)}
                      className="min-h-24 resize-none text-sm rounded-xl"
                    />
                  </div>
                </motion.div>
              )}

              {/* Complete Button */}
              <Button
                className="w-full"
                size="lg"
                disabled={!canComplete}
                onClick={completeMission}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Concluir Missão
              </Button>
              {!allChecked && (
                <p className="text-center text-xs text-muted-foreground">
                  Complete todos os itens para prosseguir
                </p>
              )}
            </CardContent>
          )}

          {/* Completed State - Premium celebration */}
          {todayMission.completed && (
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary/10">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Missão Concluída!</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                Volte amanhã para a próxima missão.
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Community Card - Premium subtle */}
      <Card className="bg-gradient-to-br from-muted/30 to-transparent border-border/60">
        <CardContent className="p-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-muted/80 flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Comunidade</h3>
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Em breve
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Conecte-se com outros participantes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
