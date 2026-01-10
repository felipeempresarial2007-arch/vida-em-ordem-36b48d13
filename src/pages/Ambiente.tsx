import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, CheckCircle2, Circle, Lock, ChevronRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const MotionCard = motion.create(Card);

interface MissionDetail {
  mission: typeof MISSIONS[0];
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

export default function Ambiente() {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<MissionDetail | null>(null);

  const stageMissions = MISSIONS.filter(m => m.stage === 'ambiente');
  const stageInfo = STAGE_INFO.ambiente;

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const { data: progress } = await supabase
          .from('challenge_progress')
          .select('current_day')
          .eq('user_id', user.id)
          .single();

        if (progress) {
          setCurrentDay(progress.current_day);
        }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const completedCount = completedMissions.length;
  const progressPercent = Math.round((completedCount / stageMissions.length) * 100);

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header - Compact for mobile */}
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stageInfo.gradient)}>
          <Home className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{stageInfo.name}</h1>
          <p className="text-xs text-muted-foreground">{stageInfo.description}</p>
        </div>
      </div>

      {/* Progress - Compact */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">Progresso</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-primary">{completedCount}</span>
              <span className="text-muted-foreground text-xs">/</span>
              <span className="text-muted-foreground text-xs">{stageMissions.length}</span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={cn('h-full rounded-full', stageInfo.gradient)}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Missions Grid - Compact */}
      <div className="grid gap-2">
        {stageMissions.map((mission, index) => {
          const isCompleted = completedMissions.includes(mission.day);
          const isCurrent = mission.day === currentDay;
          const isLocked = mission.day > currentDay;

          return (
            <Card 
              key={mission.day}
              className={cn(
                'cursor-pointer transition-all active:scale-[0.98] border-border/50',
                isCompleted && 'bg-secondary/5',
                isCurrent && 'ring-1 ring-primary',
                isLocked && 'opacity-60'
              )}
              onClick={() => setSelectedMission({ mission, isCompleted, isCurrent, isLocked })}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    isCompleted ? 'bg-secondary/20' : isLocked ? 'bg-muted' : stageInfo.gradient
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <span className="text-xs font-bold text-primary-foreground">{mission.day}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Dia {mission.day}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          HOJE
                        </span>
                      )}
                    </div>
                    <h3 className={cn(
                      'text-sm font-medium text-foreground truncate',
                      isCompleted && 'line-through text-muted-foreground'
                    )}>
                      {mission.title}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mission Detail Modal */}
      <Dialog open={!!selectedMission} onOpenChange={() => setSelectedMission(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedMission && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Dia {selectedMission.mission.day}</span>
                  {selectedMission.isCurrent && (
                    <span className="font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px]">
                      HOJE
                    </span>
                  )}
                  {selectedMission.isCompleted && (
                    <span className="font-medium bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-[10px]">
                      CONCLUÍDO
                    </span>
                  )}
                </div>
                <DialogTitle className="text-lg">{selectedMission.mission.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  Detalhes da missão do dia {selectedMission.mission.day}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-5 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Descrição</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedMission.mission.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Como fazer</h4>
                  <div className="space-y-2">
                    {selectedMission.mission.checklist.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedMission.isLocked && (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Complete os dias anteriores para desbloquear esta missão
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}