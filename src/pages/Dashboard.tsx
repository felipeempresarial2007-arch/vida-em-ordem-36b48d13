import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getRandomQuote, STAGE_INFO } from '@/lib/missions';
import { Loader2, Trophy, ArrowRight, Calendar, CheckCircle2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground">Bem-vindo de volta</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">
          Seu Progresso
        </h1>
      </div>

      {/* Challenge Completed */}
      {isCompleted && (
        <Card className="border-0 gradient-primary animate-scale-in">
          <CardContent className="py-8 text-center text-primary-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1">Parabéns! 🎉</h2>
            <p className="text-primary-foreground/90 text-sm">
              Você completou o desafio FOCUS 30!
            </p>
            <Link to="/continuacao">
              <Button variant="secondary" className="mt-4">
                Continuar Jornada
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 animate-slide-up">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{progress.currentDay}</p>
            <p className="text-xs text-muted-foreground">de 30 dias</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{progressPercent}%</p>
            <p className="text-xs text-muted-foreground">completo</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stageInfo.name.split(' ')[0]}</p>
            <p className="text-xs text-muted-foreground">etapa atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="animate-slide-up border-border/50" style={{ animationDelay: '0.05s' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Progresso do Desafio</p>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Stage Pills */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage) => {
              const info = STAGE_INFO[stage];
              const isActive = stage === currentStage;
              const isCompleted = info.days[info.days.length - 1] < progress.currentDay;
              
              return (
                <div
                  key={stage}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-secondary/20 text-secondary',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                  )}
                >
                  {info.name.split(' ')[0]}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quote */}
      <Card className="border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "{quote}"
          </p>
        </CardContent>
      </Card>

      {/* Today's Mission */}
      {!isCompleted && missionTemplate && todayMission && (
        <Card className="border-0 overflow-hidden animate-slide-up" style={{ animationDelay: '0.15s' }}>
          {/* Mission Header */}
          <div className="p-5 gradient-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wide">
                  {stageInfo.name} · Dia {missionTemplate.day}
                </p>
                <h2 className="text-lg font-bold text-primary-foreground mt-1">
                  {missionTemplate.title}
                </h2>
              </div>
            </div>
            <p className="text-primary-foreground/90 text-sm mt-2 leading-relaxed">
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
                      'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all',
                      todayMission.checklist[index] 
                        ? 'bg-secondary/10' 
                        : 'bg-muted hover:bg-muted/70'
                    )}
                  >
                    <Checkbox
                      checked={todayMission.checklist[index]}
                      onCheckedChange={(checked) => updateChecklist(index, checked as boolean)}
                      className="mt-0.5"
                    />
                    <span className={cn(
                      'text-sm',
                      todayMission.checklist[index] && 'line-through text-muted-foreground'
                    )}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>

              {/* Reflection */}
              {allChecked && (
                <div className="animate-fade-in pt-2">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Reflexão do Dia
                    </h4>
                    <Textarea
                      placeholder="Como foi realizar esta missão?"
                      value={reflection}
                      onChange={(e) => updateReflection(e.target.value)}
                      className="min-h-20 resize-none bg-background"
                    />
                  </div>
                </div>
              )}

              {/* Complete Button */}
              <Button
                className="w-full"
                disabled={!canComplete}
                onClick={completeMission}
              >
                Concluir Missão
                <ArrowRight className="w-4 h-4 ml-2" />
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
            <CardContent className="p-5">
              <div className="flex items-center gap-3 text-secondary">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Missão Completa!</h3>
                  <p className="text-muted-foreground text-sm">Você concluiu a missão de hoje.</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage) => {
          const info = STAGE_INFO[stage];
          const isActive = stage === currentStage;
          
          return (
            <Link
              key={stage}
              to={`/${stage}`}
              className={cn(
                'p-4 rounded-xl border transition-all hover:shadow-md',
                isActive 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-border/50 bg-card hover:border-primary/20'
              )}
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', info.gradient)}>
                <ArrowRight className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-medium text-foreground text-sm">{info.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {info.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}