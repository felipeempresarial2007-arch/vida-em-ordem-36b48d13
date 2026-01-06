import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Plus, X, CheckCircle2, Circle, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  description: string | null;
  isPrimary: boolean;
  completed: boolean;
  targetDate: string | null;
}

export default function Metas() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const stageMissions = MISSIONS.filter(m => m.stage === 'metas');
  const stageInfo = STAGE_INFO.metas;

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
          .eq('stage', 'metas')
          .eq('completed', true);

        if (missions) {
          setCompletedMissions(missions.map(m => m.day_number));
        }

        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false })
          .order('created_at', { ascending: true });

        if (goalsData) {
          setGoals(goalsData.map(g => ({
            id: g.id,
            title: g.title,
            description: g.description,
            isPrimary: g.is_primary,
            completed: g.completed,
            targetDate: g.target_date,
          })));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    try {
      // If marking as primary, unmark existing primary
      if (isPrimary) {
        await supabase
          .from('goals')
          .update({ is_primary: false })
          .eq('user_id', user.id)
          .eq('is_primary', true);
      }

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: newTitle.trim(),
          description: newDescription.trim() || null,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newGoal = {
          id: data.id,
          title: data.title,
          description: data.description,
          isPrimary: data.is_primary,
          completed: data.completed,
          targetDate: data.target_date,
        };

        if (isPrimary) {
          setGoals([newGoal, ...goals.map(g => ({ ...g, isPrimary: false }))]);
        } else {
          setGoals([...goals, newGoal]);
        }
        
        toast.success('Meta adicionada!');
        setNewTitle('');
        setNewDescription('');
        setIsPrimary(false);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao adicionar meta');
    }
  };

  const toggleGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      await supabase
        .from('goals')
        .update({ completed: !goal.completed })
        .eq('id', goalId);

      setGoals(goals.map(g => 
        g.id === goalId ? { ...g, completed: !g.completed } : g
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await supabase.from('goals').delete().eq('id', goalId);
      setGoals(goals.filter(g => g.id !== goalId));
      toast.success('Meta removida');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const primaryGoal = goals.find(g => g.isPrimary);
  const secondaryGoals = goals.filter(g => !g.isPrimary);
  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stageInfo.gradient)}>
            <Target className="w-6 h-6 text-primary-foreground" />
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
              Metas Concluídas
            </span>
            <span className="text-sm font-bold text-foreground">
              {completedGoals} / {goals.length}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', stageInfo.gradient)}
              style={{ width: goals.length > 0 ? `${(completedGoals / goals.length) * 100}%` : '0%' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Primary Goal */}
      {primaryGoal && (
        <Card className="animate-slide-up border-2 border-accent/50 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Meta Principal
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <label className="flex items-start gap-3 cursor-pointer flex-1">
                <Checkbox
                  checked={primaryGoal.completed}
                  onCheckedChange={() => toggleGoal(primaryGoal.id)}
                  className="mt-1"
                />
                <div>
                  <h3 className={cn(
                    'text-xl font-bold',
                    primaryGoal.completed && 'line-through text-muted-foreground'
                  )}>
                    {primaryGoal.title}
                  </h3>
                  {primaryGoal.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {primaryGoal.description}
                    </p>
                  )}
                </div>
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteGoal(primaryGoal.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Goal Button */}
      <Button 
        variant="secondary" 
        className="w-full"
        onClick={() => setShowForm(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Meta
      </Button>

      {/* Add Goal Form */}
      {showForm && (
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Nova Meta</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <Input
                placeholder="Título da meta"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="min-h-20"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={isPrimary}
                  onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                />
                <span className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  Definir como meta principal
                </span>
              </label>
              <Button type="submit" className="w-full" variant="accent">
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Secondary Goals */}
      {secondaryGoals.length > 0 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Metas Secundárias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {secondaryGoals.map((goal) => (
              <div 
                key={goal.id}
                className={cn(
                  'flex items-start justify-between p-3 rounded-lg transition-all',
                  goal.completed ? 'bg-secondary/10 border border-secondary/30' : 'bg-muted'
                )}
              >
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <Checkbox
                    checked={goal.completed}
                    onCheckedChange={() => toggleGoal(goal.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className={cn(
                      'text-sm font-medium',
                      goal.completed && 'line-through text-muted-foreground'
                    )}>
                      {goal.title}
                    </span>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {goals.length === 0 && !showForm && (
        <Card className="animate-slide-up">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Você ainda não tem metas definidas. Comece definindo sua meta principal!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stage Missions */}
      <div className="space-y-4 mt-8">
        <h2 className="text-lg font-bold text-foreground">Missões da Etapa</h2>
        {stageMissions.map((mission) => {
          const isCompleted = completedMissions.includes(mission.day);
          const isCurrent = mission.day === currentDay;
          const isLocked = mission.day > currentDay;

          return (
            <Card 
              key={mission.day}
              className={cn(
                'transition-all',
                isCompleted && 'opacity-75',
                isCurrent && 'ring-2 ring-primary shadow-lg',
                isLocked && 'opacity-50'
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-primary shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Dia {mission.day}</span>
                      <CardTitle className={cn('text-base', isCompleted && 'line-through text-muted-foreground')}>
                        {mission.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
