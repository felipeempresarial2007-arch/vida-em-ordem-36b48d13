import { STAGE_INFO } from '@/lib/missions';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  currentDay: number;
  totalDays: number;
  currentStage: keyof typeof STAGE_INFO;
}

export default function ProgressCard({ currentDay, totalDays, currentStage }: ProgressCardProps) {
  const progress = Math.round((currentDay / totalDays) * 100);
  const stageInfo = STAGE_INFO[currentStage];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Progresso do Desafio</h3>
          <p className="text-3xl font-bold text-foreground mt-1">
            Dia {currentDay} <span className="text-lg font-normal text-muted-foreground">de {totalDays}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold gradient-progress bg-clip-text text-transparent">
            {progress}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="h-full gradient-progress rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage Pills */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(STAGE_INFO) as Array<keyof typeof STAGE_INFO>).map((stage) => {
          const info = STAGE_INFO[stage];
          const isActive = stage === currentStage;
          const isCompleted = info.days[info.days.length - 1] < currentDay;
          
          return (
            <div
              key={stage}
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
        })}
      </div>
    </div>
  );
}
