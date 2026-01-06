import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getRandomQuote, STAGE_INFO } from '@/lib/missions';
import ProgressCard from '@/components/dashboard/ProgressCard';
import QuoteCard from '@/components/dashboard/QuoteCard';
import MissionCard from '@/components/dashboard/MissionCard';
import { Loader2, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Bom dia! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Continue sua jornada de transformação
        </p>
      </div>

      {/* Challenge Completed */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-8 text-center animate-scale-in">
          <Trophy className="w-16 h-16 text-secondary-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-foreground mb-2">
            Parabéns! 🎉
          </h2>
          <p className="text-secondary-foreground/90 mb-4">
            Você completou o desafio Vida em Ordem de 30 dias!
          </p>
          <p className="text-sm text-secondary-foreground/80">
            Sua vida está mais organizada e clara.
          </p>
        </div>
      )}

      {/* Progress */}
      <ProgressCard 
        currentDay={progress.currentDay}
        totalDays={30}
        currentStage={currentStage}
      />

      {/* Quote */}
      <QuoteCard quote={quote} />

      {/* Today's Mission */}
      {!isCompleted && missionTemplate && todayMission && (
        <MissionCard
          mission={missionTemplate}
          checklist={todayMission.checklist}
          reflection={todayMission.reflection || ''}
          onChecklistChange={updateChecklist}
          onReflectionChange={updateReflection}
          onComplete={completeMission}
          isCompleted={todayMission.completed}
        />
      )}

      {/* Quick Access to Areas */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage) => {
          const info = STAGE_INFO[stage];
          const isActive = stage === currentStage;
          
          return (
            <Link
              key={stage}
              to={`/${stage}`}
              className={`
                p-4 rounded-xl border transition-all hover:shadow-md
                ${isActive 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-border bg-card hover:border-primary/20'
                }
              `}
            >
              <div className={`w-10 h-10 rounded-lg ${info.gradient} flex items-center justify-center mb-3`}>
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{info.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {info.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
