import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Home, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Ambiente() {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const stageMissions = MISSIONS.filter(m => m.stage === 'ambiente');
  const stageInfo = STAGE_INFO.ambiente;

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Get current progress
        const { data: progress } = await supabase
          .from('challenge_progress')
          .select('current_day')
          .eq('user_id', user.id)
          .single();

        if (progress) {
          setCurrentDay(progress.current_day);
        }

        // Get completed missions for this stage
        const { data: missions } = await supabase
          .from('daily_missions')
          .select('day_number')
          .eq('user_id', user.id)
          .eq('stage', 'ambiente')
          .eq('completed', true);

        if (missions) {
          setCompletedMissions(missions.map(m => m.day_number));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stageInfo.gradient)}>
            <Home className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {stageInfo.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {stageInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Progresso da Etapa
            </span>
            <span className="text-sm font-bold text-foreground">
              {completedMissions.length} / {stageMissions.length}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', stageInfo.gradient)}
              style={{ width: `${(completedMissions.length / stageMissions.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Missions List */}
      <div className="space-y-4">
        {stageMissions.map((mission) => {
          const isCompleted = completedMissions.includes(mission.day);
          const isCurrent = mission.day === currentDay;
          const isLocked = mission.day > currentDay;

          return (
            <Card 
              key={mission.day}
              className={cn(
                'transition-all animate-slide-up',
                isCompleted && 'opacity-75',
                isCurrent && 'ring-2 ring-primary shadow-lg',
                isLocked && 'opacity-50'
              )}
              style={{ animationDelay: `${mission.day * 0.05}s` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-primary shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Dia {mission.day}
                      </span>
                      <CardTitle className={cn(
                        'text-lg',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {mission.title}
                      </CardTitle>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Hoje
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {mission.description}
                </p>
                <div className="space-y-2">
                  {mission.checklist.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Checkbox 
                        checked={isCompleted} 
                        disabled 
                        className="mt-0.5"
                      />
                      <span className={cn(
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
