import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getRandomQuote, STAGE_INFO } from '@/lib/missions';
import { Loader2, Trophy, ArrowRight, Calendar, CheckCircle2, Flame, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-primary">Bem-vindo de volta</p>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Seu Progresso
        </h1>
        <p className="text-muted-foreground mt-1">
          Continue sua jornada de transformação pessoal
        </p>
      </motion.div>

      {/* Challenge Completed */}
      {isCompleted && (
        <MotionCard
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-0 overflow-hidden"
        >
          <div className="gradient-primary p-8 text-center text-primary-foreground">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Parabéns! 🎉</h2>
            <p className="text-white/90 max-w-md mx-auto">
              Você completou o desafio FOCUS 30! Sua dedicação trouxe resultados incríveis.
            </p>
            <Link to="/continuacao">
              <Button variant="secondary" size="lg" className="mt-6 rounded-xl">
                Continuar Jornada
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </MotionCard>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { 
            icon: Calendar, 
            value: progress.currentDay, 
            label: 'de 30 dias',
            color: 'primary',
            delay: 0.1
          },
          { 
            icon: TrendingUp, 
            value: `${progressPercent}%`, 
            label: 'completo',
            color: 'secondary',
            delay: 0.2
          },
          { 
            icon: Zap, 
            value: stageInfo.name.split(' ')[0], 
            label: 'etapa atual',
            color: 'primary',
            delay: 0.3
          },
        ].map((stat, i) => (
          <MotionCard 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            className="border-border/50 overflow-hidden"
          >
            <CardContent className="p-5 text-center relative">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3',
                stat.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
              )}>
                <stat.icon className={cn(
                  'w-5 h-5',
                  stat.color === 'primary' ? 'text-primary' : 'text-secondary'
                )} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </MotionCard>
        ))}
      </div>

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

      {/* Quote Card */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-border/50 bg-gradient-to-br from-card to-muted/30"
      >
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Pensamento do dia</p>
              <p className="text-muted-foreground italic leading-relaxed">
                "{quote}"
              </p>
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
    </div>
  );
}
