import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Infinity, CheckCircle2, Calendar, Flame, TrendingUp, Plus, X, Edit2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
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

const TASK_CATEGORIES = [
  { name: 'Ambiente', color: 'bg-orange-500' },
  { name: 'Finanças', color: 'bg-amber-500' },
  { name: 'Rotina', color: 'bg-rose-500' },
  { name: 'Metas', color: 'bg-violet-500' },
  { name: 'Pessoal', color: 'bg-sky-500' },
];

const MotionCard = motion.create(Card);

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
    acc[cat.name] = tasks.filter(t => t.category === cat.name);
    return acc;
  }, {} as Record<string, DailyTask[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
            <Infinity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Continuação</h1>
            <p className="text-muted-foreground">Sua jornada além dos 30 dias</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Flame, value: streak, label: 'dias seguidos', color: 'primary' },
          { icon: CheckCircle2, value: `${completedToday}/${totalTasks}`, label: 'hoje', color: 'secondary' },
          { icon: TrendingUp, value: `${progressPercent}%`, label: 'progresso', color: 'primary' },
        ].map((stat, i) => (
          <MotionCard 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            className="border-border/50"
          >
            <CardContent className="p-5 text-center">
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3',
                stat.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
              )}>
                <stat.icon className={cn(
                  'w-5 h-5',
                  stat.color === 'primary' ? 'text-primary' : 'text-secondary'
                )} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </MotionCard>
        ))}
      </div>

      {/* Progress Card */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="border-border/50"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Progresso de Hoje</p>
              <p className="text-xs text-muted-foreground mt-0.5">{completedToday} de {totalTasks} tarefas</p>
            </div>
            <span className="text-lg font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </CardContent>
      </MotionCard>

      {/* Add Task Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full h-12 rounded-xl text-base font-semibold"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Tarefa Diária
        </Button>
      </motion.div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <MotionCard
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="border-border/50 overflow-hidden"
          >
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Nova Tarefa Diária</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddTask} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nome da tarefa</Label>
                  <Input
                    placeholder="Ex: Meditar 10 minutos"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Categoria</Label>
                  <div className="flex flex-wrap gap-2">
                    {TASK_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                          selectedCategory === cat.name
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        )}
                      >
                        <div className={cn('w-2 h-2 rounded-full', cat.color)} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Tarefa
                </Button>
              </form>
            </CardContent>
          </MotionCard>
        )}
      </AnimatePresence>

      {/* Tasks by Category */}
      {TASK_CATEGORIES.map(({ name: category, color }) => {
        const categoryTasks = groupedTasks[category];
        if (!categoryTasks || categoryTasks.length === 0) return null;
        
        return (
          <MotionCard
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-border/50 overflow-hidden"
          >
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', color)} />
                <CardTitle className="text-sm font-semibold text-foreground">{category}</CardTitle>
                <span className="text-xs text-muted-foreground ml-auto">
                  {categoryTasks.filter(t => t.completedDates.includes(today)).length}/{categoryTasks.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {categoryTasks.map((task) => {
                const isCompleted = task.completedDates.includes(today);
                return (
                  <motion.div 
                    key={task.id}
                    layout
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl transition-all',
                      isCompleted 
                        ? 'bg-secondary/10 border border-secondary/20' 
                        : 'bg-muted/50 border border-transparent'
                    )}
                  >
                    <label className="flex items-center gap-4 cursor-pointer flex-1">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="w-5 h-5"
                      />
                      <span className={cn(
                        'text-sm font-medium',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {task.name}
                      </span>
                    </label>
                    <div className="flex items-center gap-1">
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-secondary mr-2" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteTask(task.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </MotionCard>
        );
      })}

      {tasks.length === 0 && !showForm && (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50"
        >
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Infinity className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Comece sua jornada contínua</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Adicione tarefas diárias para manter os hábitos do desafio e continuar evoluindo
            </p>
          </CardContent>
        </MotionCard>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Tarefa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome da tarefa</Label>
              <Input
                value={editingTask?.name || ''}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {TASK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setEditingTask(prev => prev ? { ...prev, category: cat.name } : null)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                      editingTask?.category === cat.name
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    )}
                  >
                    <div className={cn('w-2 h-2 rounded-full', cat.color)} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">
              Salvar Alterações
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
