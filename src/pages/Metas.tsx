import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Plus, X, CheckCircle2, Lock, ChevronRight, Star, Edit2, Loader2, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const MotionCard = motion.create(Card);

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
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

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

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    try {
      if (editingGoal.isPrimary) {
        await supabase
          .from('goals')
          .update({ is_primary: false })
          .eq('user_id', user!.id)
          .eq('is_primary', true)
          .neq('id', editingGoal.id);
      }

      await supabase
        .from('goals')
        .update({ 
          title: editingGoal.title,
          description: editingGoal.description,
          is_primary: editingGoal.isPrimary
        })
        .eq('id', editingGoal.id);

      setGoals(goals.map(g => {
        if (g.id === editingGoal.id) return editingGoal;
        if (editingGoal.isPrimary && g.isPrimary) return { ...g, isPrimary: false };
        return g;
      }));
      
      toast.success('Meta atualizada!');
      setEditingGoal(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const primaryGoal = goals.find(g => g.isPrimary);
  const secondaryGoals = goals.filter(g => !g.isPrimary);
  const completedGoals = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
  const completedCount = completedMissions.length;
  const stageProgressPercent = Math.round((completedCount / stageMissions.length) * 100);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg', stageInfo.gradient)}>
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{stageInfo.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{stageInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Goals Progress */}
      <MotionCard 
        className="border-border/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Metas Concluídas</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{completedGoals}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{goals.length}</span>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={cn('h-full rounded-full', stageInfo.gradient)}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {progressPercent}% concluído
          </p>
        </CardContent>
      </MotionCard>

      {/* Primary Goal */}
      {primaryGoal && (
        <Card className="border-primary/30 bg-primary/5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Meta Principal
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-3">
              <label className="flex items-start gap-3 cursor-pointer flex-1">
                <Checkbox
                  checked={primaryGoal.completed}
                  onCheckedChange={() => toggleGoal(primaryGoal.id)}
                  className="mt-1"
                />
                <div>
                  <h3 className={cn(
                    'text-base font-bold',
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
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingGoal(primaryGoal)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteGoal(primaryGoal.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Goal Button */}
      <Button 
        onClick={() => setShowForm(true)}
        className="w-full h-11"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Meta
      </Button>

      {/* Add Goal Form */}
      {showForm && (
        <Card className="animate-scale-in border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Nova Meta</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Título da meta</Label>
                <Input
                  placeholder="Ex: Ler 12 livros este ano"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Descrição (opcional)</Label>
                <Textarea
                  placeholder="Detalhes sobre como alcançar..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-16 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={isPrimary}
                  onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                />
                <span className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-primary" />
                  Definir como meta principal
                </span>
              </label>
              <Button type="submit" className="w-full h-10">
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Secondary Goals */}
      {secondaryGoals.length > 0 && (
        <Card className="border-border/50 animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outras Metas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {secondaryGoals.map((goal) => (
              <div 
                key={goal.id}
                className={cn(
                  'flex items-start justify-between p-3 rounded-lg transition-all',
                  goal.completed ? 'bg-secondary/10' : 'bg-muted/50'
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
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingGoal(goal)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {goals.length === 0 && !showForm && (
        <Card className="border-border/50 animate-slide-up">
          <CardContent className="py-10 text-center">
            <Target className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Defina sua primeira meta e comece a transformar sua vida
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stage Progress */}
      <Card className="border-border/50 animate-slide-up">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Progresso da Etapa</p>
            <p className="text-sm font-bold text-primary">{completedCount}/{stageMissions.length}</p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', stageInfo.gradient)}
              style={{ width: `${stageProgressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Missions */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Missões da Etapa</h2>
        <div className="grid gap-3">
          {stageMissions.map((mission, index) => {
            const isCompleted = completedMissions.includes(mission.day);
            const isCurrent = mission.day === currentDay;
            const isLocked = mission.day > currentDay;

            return (
              <Card 
                key={mission.day}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md border-border/50',
                  isCompleted && 'bg-secondary/5',
                  isCurrent && 'ring-1 ring-primary',
                  isLocked && 'opacity-60'
                )}
                onClick={() => setSelectedMission({ mission, isCompleted, isCurrent, isLocked })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                      isCompleted ? 'bg-secondary/20' : isLocked ? 'bg-muted' : stageInfo.gradient
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <span className="text-sm font-bold text-primary-foreground">{mission.day}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Dia {mission.day}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                            HOJE
                          </span>
                        )}
                      </div>
                      <h3 className={cn(
                        'font-medium text-foreground truncate',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {mission.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
            <DialogDescription className="sr-only">
              Formulário para editar título, descrição e prioridade da meta
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGoal} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Título da meta</Label>
              <Input
                value={editingGoal?.title || ''}
                onChange={(e) => setEditingGoal(prev => prev ? { ...prev, title: e.target.value } : null)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Descrição (opcional)</Label>
              <Textarea
                value={editingGoal?.description || ''}
                onChange={(e) => setEditingGoal(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="min-h-16 resize-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={editingGoal?.isPrimary || false}
                onCheckedChange={(checked) => setEditingGoal(prev => prev ? { ...prev, isPrimary: checked as boolean } : null)}
              />
              <span className="text-sm font-medium flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-primary" />
                Definir como meta principal
              </span>
            </label>
            <Button type="submit" className="w-full h-10">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
                    {selectedMission.mission.checklist.map((item: string, idx: number) => (
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