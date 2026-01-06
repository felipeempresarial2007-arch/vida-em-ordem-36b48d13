import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Plus, X, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;

  const groupedHabits = HABIT_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = habits.filter(h => h.category === cat);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stageInfo.gradient)}>
            <Heart className="w-6 h-6 text-primary-foreground" />
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

      {/* Daily Progress */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Hábitos de Hoje
            </span>
            <span className="text-sm font-bold text-foreground">
              {completedToday} / {totalHabits}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', stageInfo.gradient)}
              style={{ width: totalHabits > 0 ? `${(completedToday / totalHabits) * 100}%` : '0%' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Habit Button */}
      <Button 
        variant="secondary" 
        className="w-full"
        onClick={() => setShowForm(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Hábito
      </Button>

      {/* Add Habit Form */}
      {showForm && (
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Novo Hábito</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <Input
                placeholder="Ex: Beber 2L de água"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                required
              />
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
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <Button type="submit" className="w-full" variant="secondary">
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
          <Card key={category} className="animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryHabits.map((habit) => {
                const isCompleted = habit.completedDates.includes(today);
                return (
                  <div 
                    key={habit.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-all',
                      isCompleted ? 'bg-secondary/10 border border-secondary/30' : 'bg-muted'
                    )}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleHabit(habit.id)}
                      />
                      <span className={cn(
                        'text-sm font-medium',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {habit.name}
                      </span>
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {habits.length === 0 && !showForm && (
        <Card className="animate-slide-up">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Você ainda não tem hábitos cadastrados. Adicione seu primeiro hábito!
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
