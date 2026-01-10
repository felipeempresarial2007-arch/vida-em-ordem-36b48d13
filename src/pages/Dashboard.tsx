import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getRandomQuote, STAGE_INFO } from '@/lib/missions';
import { Loader2, Trophy, ArrowRight, Calendar, CheckCircle2, Sparkles, TrendingUp, Crown, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChallengeCompleteCard } from '@/components/dashboard/ChallengeCompleteCard';

const MotionCard = motion.create(Card);

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

      {/* Stats Grid - Compact for mobile */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-semibold text-foreground">{progress.currentDay}</p>
            <p className="text-[10px] text-muted-foreground">de 30</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-1.5">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-lg font-semibold text-foreground">{progressPercent}%</p>
            <p className="text-[10px] text-muted-foreground">completo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mx-auto mb-1.5">
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">{stageInfo.name.split(' ')[0]}</p>
            <p className="text-[10px] text-muted-foreground">etapa</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar - Compact */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Progresso</span>
            <span className="text-xs font-semibold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex gap-1 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
            {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage) => {
              const info = STAGE_INFO[stage];
              const isActive = stage === currentStage;
              const isDone = info.days[info.days.length - 1] < progress.currentDay;
              
              return (
                <div
                  key={stage}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap',
                    isActive && 'bg-primary text-primary-foreground',
                    isDone && 'bg-secondary/15 text-secondary',
                    !isActive && !isDone && 'bg-muted text-muted-foreground'
                  )}
                >
                  {info.name.split(' ')[0]}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quote Card - Compact */}
      <Card className="bg-muted/30">
        <CardContent className="p-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                Pensamento do dia
              </p>
              <p className="text-xs text-foreground leading-relaxed">
                "{quote}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Protocol Card - Compact */}
      <Link to="/focus-protocol">
        <Card className="group hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Protocolo de Foco</h3>
              <p className="text-[11px] text-muted-foreground">
                Técnicas de neuro-performance
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
      </Link>

      {/* Today's Mission */}
      {!isCompleted && missionTemplate && todayMission && (
        <Card className="overflow-hidden">
          {/* Mission Header */}
          <div className="p-5 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2 text-xs font-medium text-primary-foreground/80 mb-1">
              <span>{stageInfo.name}</span>
              <span>•</span>
              <span>Dia {missionTemplate.day}</span>
            </div>
            <h2 className="text-lg font-semibold">
              {missionTemplate.title}
            </h2>
            <p className="text-sm text-primary-foreground/80 mt-1.5 leading-relaxed">
              {missionTemplate.description}
            </p>
          </div>

          {/* Checklist */}
          {!todayMission.completed && (
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                {missionTemplate.checklist.map((item, index) => (
                  <label
                    key={index}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                      todayMission.checklist[index] 
                        ? 'bg-secondary/10' 
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <Checkbox
                      checked={todayMission.checklist[index]}
                      onCheckedChange={(checked) => updateChecklist(index, checked as boolean)}
                      className="mt-0.5"
                    />
                    <span className={cn(
                      'text-sm flex-1',
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

              {/* Reflection */}
              {allChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Reflexão do Dia
                    </h4>
                    <Textarea
                      placeholder="Como foi realizar esta missão? O que você aprendeu?"
                      value={reflection}
                      onChange={(e) => updateReflection(e.target.value)}
                      className="min-h-20 resize-none text-sm"
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

          {/* Completed State */}
          {todayMission.completed && (
            <CardContent className="p-5 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">Missão Concluída!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Volte amanhã para a próxima missão.
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Community Card */}
      <Card className="bg-muted/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Comunidade</h3>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
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
