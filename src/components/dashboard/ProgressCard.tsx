import React, { useMemo } from 'react';
import { STAGE_INFO } from '@/lib/missions';
import { cn } from '@/lib/utils';

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

// --- Main Component ---

export default function ProgressCard({ 
  currentDay, 
  totalDays, 
  currentStage,
  className 
}: ProgressCardProps) {
  
  // Safety & Memoization: Prevent division by zero and clamp values.
  const progress = useMemo(() => {
    if (totalDays <= 0) return 0;
    const rawProgress = (currentDay / totalDays) * 100;
    return Math.min(100, Math.max(0, Math.round(rawProgress)));
  }, [currentDay, totalDays]);

  const stageInfo = STAGE_INFO[currentStage];

  // Accessibility: IDs for labeling
  const labelId = "progress-card-label";
  const detailsId = "progress-card-details";

  return (
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
        
        {/* Progress Percentage */}
        <div className="text-right" aria-hidden="true">
          <span className="text-4xl font-bold gradient-progress bg-clip-text text-transparent">
            {progress}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-3 bg-muted rounded-full overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso do desafio: ${progress}%`}
      >
        <div 
          className="h-full gradient-progress rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage Pills */}
      <div className="flex gap-2 flex-wrap" role="list" aria-label="Etapas do desafio">
        {(Object.keys(STAGE_INFO) as Array<StageKey>).map((stage) => {
          const info = STAGE_INFO[stage];
          
          // Check if stage is completed based on days.
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
  );
}
