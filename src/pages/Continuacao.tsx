import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Infinity, CheckCircle2, Calendar, Flame, TrendingUp, Plus, X, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DailyTask {
  id: string;
  name: string;
  category: string;
  completedDates: string[];
}

const TASK_CATEGORIES = ['Ambiente', 'Finanças', 'Rotina', 'Metas', 'Pessoal'];

export default function Continuacao() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pessoal');
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [streak, setStreak] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTasks();
  }, [user]);

  async function fetchTasks() {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('daily_habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (data) {
        const mappedTasks = data.map(h => ({
          id: h.id,
          name: h.name,
          category: h.category,
          completedDates: (h.completed_dates as string[]) || [],
        }));
        setTasks(mappedTasks);
        calculateStreak(mappedTasks);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStreak(taskList: DailyTask[]) {
    if (taskList.length === 0) {
      setStreak(0);
      return;
    }

    let currentStreak = 0;
    const checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const allCompleted = taskList.every(t => t.completedDates.includes(dateStr));
      
      if (allCompleted && taskList.length > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.trim()) return;

    try {
      const { data, error } = await supabase
        .from('daily_habits')
        .insert({
          user_id: user.id,
          name: newTask.trim(),
          category: selectedCategory,
          completed_dates: [],
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTasks([...tasks, {
          id: data.id,
          name: data.name,
          category: data.category,
          completedDates: [],
        }]);
        toast.success('Tarefa adicionada!');
        setNewTask('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao adicionar tarefa');
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await supabase
        .from('daily_habits')
        .update({ 
          name: editingTask.name,
          category: editingTask.category 
        })
        .eq('id', editingTask.id);

      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, name: editingTask.name, category: editingTask.category }
          : t
      ));
      toast.success('Tarefa atualizada!');
      setEditingTask(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar');
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCompleted = task.completedDates.includes(today);
    const newDates = isCompleted
      ? task.completedDates.filter(d => d !== today)
      : [...task.completedDates, today];

    try {
      await supabase
        .from('daily_habits')
        .update({ completed_dates: newDates })
        .eq('id', taskId);

      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, completedDates: newDates } : t
      );
      setTasks(updatedTasks);
      calculateStreak(updatedTasks);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await supabase.from('daily_habits').delete().eq('id', taskId);
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      calculateStreak(updatedTasks);
      toast.success('Tarefa removida');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const completedToday = tasks.filter(t => t.completedDates.includes(today)).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;

  const groupedTasks = TASK_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = tasks.filter(t => t.category === cat);
    return acc;
  }, {} as Record<string, DailyTask[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Infinity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Continuação</h1>
            <p className="text-sm text-muted-foreground">Sua jornada além dos 30 dias</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-slide-up">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">dias seguidos</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-xl font-bold text-foreground">{completedToday}/{totalTasks}</p>
            <p className="text-xs text-muted-foreground">hoje</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">{progressPercent}%</p>
            <p className="text-xs text-muted-foreground">completo</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="border-border/50 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Progresso de Hoje</p>
            <p className="text-sm font-bold text-primary">{progressPercent}%</p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Task Button */}
      <Button 
        onClick={() => setShowForm(true)}
        className="w-full h-11"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Tarefa Diária
      </Button>

      {/* Add Task Form */}
      {showForm && (
        <Card className="animate-scale-in border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Nova Tarefa</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Nome da tarefa</Label>
                <Input
                  placeholder="Ex: Meditar 10 minutos"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Categoria</Label>
                <div className="flex flex-wrap gap-2">
                  {TASK_CATEGORIES.map((cat) => (
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

      {/* Tasks by Category */}
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => {
        if (categoryTasks.length === 0) return null;
        
        return (
          <Card key={category} className="border-border/50 animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryTasks.map((task) => {
                const isCompleted = task.completedDates.includes(today);
                return (
                  <div 
                    key={task.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-all',
                      isCompleted ? 'bg-secondary/10' : 'bg-muted/50'
                    )}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                      <span className={cn(
                        'text-sm',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {task.name}
                      </span>
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
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

      {tasks.length === 0 && !showForm && (
        <Card className="border-border/50 animate-slide-up">
          <CardContent className="py-12 text-center">
            <Infinity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">Comece sua jornada contínua</h3>
            <p className="text-sm text-muted-foreground">
              Adicione tarefas diárias para manter os hábitos do desafio
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Nome da tarefa</Label>
              <Input
                value={editingTask?.name || ''}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {TASK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEditingTask(prev => prev ? { ...prev, category: cat } : null)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      editingTask?.category === cat
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
    </div>
  );
}