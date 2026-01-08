import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Plus, X, CheckCircle2, Lock, ChevronRight, Edit2, Calendar, Loader2, Sparkles, Flame } from 'lucide-react';
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

interface Habit {
  id: string;
  name: string;
  category: string;
  completedDates: string[];
}

const HABIT_CATEGORIES = ['Manhã', 'Tarde', 'Noite', 'Saúde', 'Movimento', 'Mente'];

export default function Rotina() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Manhã');
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stageMissions = MISSIONS.filter(m => m.stage === 'rotina');
  const stageInfo = STAGE_INFO.rotina;
  const today = new Date().toISOString().split('T')[0];

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
          .eq('stage', 'rotina')
          .eq('completed', true);

        if (missions) {
          setCompletedMissions(missions.map(m => m.day_number));
        }

        const { data: habitsData } = await supabase
          .from('daily_habits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (habitsData) {
          setHabits(habitsData.map(h => ({
            id: h.id,
            name: h.name,
            category: h.category,
            completedDates: (h.completed_dates as string[]) || [],
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

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newHabit.trim()) return;

    try {
      const { data, error } = await supabase
        .from('daily_habits')
        .insert({
          user_id: user.id,
          name: newHabit.trim(),
          category: selectedCategory,
          completed_dates: [],
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setHabits([...habits, {
          id: data.id,
          name: data.name,
          category: data.category,
          completedDates: [],
        }]);
        toast.success('Hábito adicionado!');
        setNewHabit('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao adicionar hábito');
    }
  };

  const handleEditHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabit) return;

    try {
      await supabase
        .from('daily_habits')
        .update({ name: editingHabit.name, category: editingHabit.category })
        .eq('id', editingHabit.id);

      setHabits(habits.map(h => 
        h.id === editingHabit.id 
          ? { ...h, name: editingHabit.name, category: editingHabit.category }
          : h
      ));
      toast.success('Hábito atualizado!');
      setEditingHabit(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar');
    }
  };

  const toggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(today);
    const newDates = isCompleted
      ? habit.completedDates.filter(d => d !== today)
      : [...habit.completedDates, today];

    try {
      await supabase
        .from('daily_habits')
        .update({ completed_dates: newDates })
        .eq('id', habitId);

      setHabits(habits.map(h => 
        h.id === habitId ? { ...h, completedDates: newDates } : h
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await supabase.from('daily_habits').delete().eq('id', habitId);
      setHabits(habits.filter(h => h.id !== habitId));
      toast.success('Hábito removido');
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

  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const groupedHabits = HABIT_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = habits.filter(h => h.category === cat);
    return acc;
  }, {} as Record<string, Habit[]>);

  // Generate week days
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    weekDays.push(date);
  }

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
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{stageInfo.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{stageInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Week Calendar */}
      <MotionCard 
        className="border-border/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Última Semana</p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">{progressPercent}%</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === today;
              const allCompleted = habits.length > 0 && habits.every(h => h.completedDates.includes(dateStr));
              const someCompleted = habits.some(h => h.completedDates.includes(dateStr));
              
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'flex flex-col items-center p-2.5 rounded-xl transition-all cursor-pointer hover:scale-105',
                    isToday && 'ring-2 ring-primary shadow-lg',
                    allCompleted && 'bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30',
                    !allCompleted && someCompleted && 'bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20',
                    !allCompleted && !someCompleted && 'bg-muted/50'
                  )}
                >
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                  </span>
                  <span className={cn(
                    'text-sm font-bold mt-1',
                    isToday ? 'text-primary' : 'text-foreground'
                  )}>
                    {date.getDate()}
                  </span>
                  {allCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary mt-1" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </MotionCard>

      {/* Daily Progress */}
      <Card className="border-border/50 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Hábitos de Hoje</p>
            <p className="text-sm font-bold text-primary">{completedToday}/{totalHabits}</p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', stageInfo.gradient)}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Habit Button */}
      <Button 
        onClick={() => setShowForm(true)}
        className="w-full h-11"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Hábito
      </Button>

      {/* Add Habit Form */}
      {showForm && (
        <Card className="animate-scale-in border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Novo Hábito</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Nome do hábito</Label>
                <Input
                  placeholder="Ex: Beber 2L de água"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Período do dia</Label>
                <div className="flex flex-wrap gap-2">
                  {HABIT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full h-10">
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Habits by Category */}
      {Object.entries(groupedHabits).map(([category, categoryHabits]) => {
        if (categoryHabits.length === 0) return null;
        
        return (
          <Card key={category} className="border-border/50 animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryHabits.map((habit) => {
                const isCompleted = habit.completedDates.includes(today);
                return (
                  <div 
                    key={habit.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-all',
                      isCompleted ? 'bg-secondary/10' : 'bg-muted/50'
                    )}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleHabit(habit.id)}
                      />
                      <span className={cn(
                        'text-sm',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {habit.name}
                      </span>
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingHabit(habit)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {habits.length === 0 && !showForm && (
        <Card className="border-border/50 animate-slide-up">
          <CardContent className="py-10 text-center">
            <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Adicione seu primeiro hábito diário
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

      {/* Edit Habit Dialog */}
      <Dialog open={!!editingHabit} onOpenChange={() => setEditingHabit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Hábito</DialogTitle>
            <DialogDescription className="sr-only">
              Formulário para editar nome e categoria do hábito
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditHabit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Nome do hábito</Label>
              <Input
                value={editingHabit?.name || ''}
                onChange={(e) => setEditingHabit(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Período do dia</Label>
              <div className="flex flex-wrap gap-2">
                {HABIT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEditingHabit(prev => prev ? { ...prev, category: cat } : null)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      editingHabit?.category === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
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