import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Zap, 
  Sun, 
  Sunrise, 
  Coffee, 
  Moon, 
  TrendingUp,
  Brain,
  Lightbulb,
  Target,
  Sparkles,
  Activity,
  BarChart3,
  Clock,
  CheckCircle2,
  Circle,
  Flame,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  ChevronRight,
  Timer,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EnergyLog {
  id: string;
  time_slot: string;
  energy_level: number;
  activity: string | null;
  date: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  energyRequired: 'high' | 'medium' | 'low';
  duration: string;
  category: string;
  completed: boolean;
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Manhã', time: '6h-9h', icon: Sunrise, gradient: 'from-amber-400 to-orange-500' },
  { id: 'late_morning', label: 'Final Manhã', time: '9h-12h', icon: Sun, gradient: 'from-orange-400 to-red-500' },
  { id: 'afternoon', label: 'Tarde', time: '12h-15h', icon: Coffee, gradient: 'from-yellow-400 to-amber-500' },
  { id: 'late_afternoon', label: 'Final Tarde', time: '15h-18h', icon: Sun, gradient: 'from-orange-500 to-rose-500' },
  { id: 'evening', label: 'Noite', time: '18h-21h', icon: Moon, gradient: 'from-indigo-400 to-purple-500' },
];

const ENERGY_LEVELS = [
  { level: 1, label: 'Crítico', color: 'from-red-500 to-red-600', icon: BatteryLow, pulse: true },
  { level: 2, label: 'Baixo', color: 'from-orange-500 to-orange-600', icon: BatteryLow, pulse: false },
  { level: 3, label: 'Estável', color: 'from-yellow-500 to-amber-500', icon: BatteryMedium, pulse: false },
  { level: 4, label: 'Alto', color: 'from-lime-500 to-green-500', icon: BatteryFull, pulse: false },
  { level: 5, label: 'Máximo', color: 'from-emerald-500 to-teal-500', icon: Flame, pulse: true },
];

const SMART_TASKS: Task[] = [
  { id: '1', title: 'Revisão Estratégica', description: 'Análise e planejamento de alto impacto', energyRequired: 'high', duration: '45min', category: 'Foco Profundo', completed: false },
  { id: '2', title: 'Reunião Importante', description: 'Decisões críticas e negociações', energyRequired: 'high', duration: '30min', category: 'Comunicação', completed: false },
  { id: '3', title: 'Brainstorming Criativo', description: 'Geração de novas ideias e soluções', energyRequired: 'high', duration: '25min', category: 'Criatividade', completed: false },
  { id: '4', title: 'Organizar Inbox', description: 'Processar e-mails e mensagens', energyRequired: 'low', duration: '20min', category: 'Administrativo', completed: false },
  { id: '5', title: 'Revisar Documentos', description: 'Leitura e anotações leves', energyRequired: 'medium', duration: '15min', category: 'Revisão', completed: false },
  { id: '6', title: 'Planejar Semana', description: 'Organizar próximos compromissos', energyRequired: 'medium', duration: '20min', category: 'Planejamento', completed: false },
];

export function EnergyFlow() {
  const { user } = useAuth();
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [activity, setActivity] = useState('');
  const [activeTab, setActiveTab] = useState<'register' | 'analytics' | 'tasks'>('register');
  const [tasks, setTasks] = useState<Task[]>(SMART_TASKS);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchEnergyLogs();
  }, [user]);

  async function fetchEnergyLogs() {
    if (!user) return;

    try {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data } = await supabase
        .from('energy_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: false });

      if (data) {
        setEnergyLogs(data as EnergyLog[]);
      }
    } catch (error) {
      console.error('Error fetching energy logs:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogEnergy = async () => {
    if (!user || !selectedSlot || !selectedLevel) return;

    try {
      const { data, error } = await supabase
        .from('energy_logs')
        .upsert({
          user_id: user.id,
          date: today,
          time_slot: selectedSlot,
          energy_level: selectedLevel,
          activity: activity.trim() || null,
        }, {
          onConflict: 'user_id,date,time_slot',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEnergyLogs(prev => {
          const filtered = prev.filter(
            l => !(l.date === today && l.time_slot === selectedSlot)
          );
          return [data as EnergyLog, ...filtered];
        });
        toast.success('Energia sincronizada!', {
          description: 'Seu nível de energia foi registrado com sucesso.'
        });
        setSelectedSlot(null);
        setSelectedLevel(null);
        setActivity('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao registrar energia');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast.success('Tarefa concluída!', {
        description: `"${task.title}" marcada como completa.`
      });
    }
  };

  // Calculate energy patterns from historical data
  const energyPatterns = useMemo(() => {
    const patterns: Record<string, { total: number; count: number; avg: number }> = {};
    
    TIME_SLOTS.forEach(slot => {
      patterns[slot.id] = { total: 0, count: 0, avg: 0 };
    });

    energyLogs.forEach(log => {
      if (patterns[log.time_slot]) {
        patterns[log.time_slot].total += log.energy_level;
        patterns[log.time_slot].count += 1;
      }
    });

    Object.keys(patterns).forEach(slot => {
      if (patterns[slot].count > 0) {
        patterns[slot].avg = patterns[slot].total / patterns[slot].count;
      }
    });

    return patterns;
  }, [energyLogs]);

  // Find peak energy time
  const peakEnergySlot = useMemo(() => {
    let maxAvg = 0;
    let peakSlot = '';
    
    Object.entries(energyPatterns).forEach(([slot, data]) => {
      if (data.avg > maxAvg && data.count >= 3) {
        maxAvg = data.avg;
        peakSlot = slot;
      }
    });

    return TIME_SLOTS.find(s => s.id === peakSlot);
  }, [energyPatterns]);

  // Get today's logs
  const todayLogs = energyLogs.filter(l => l.date === today);

  // Current hour to suggest which slot to log
  const currentHour = new Date().getHours();
  const suggestedSlot = useMemo(() => {
    if (currentHour >= 6 && currentHour < 9) return 'morning';
    if (currentHour >= 9 && currentHour < 12) return 'late_morning';
    if (currentHour >= 12 && currentHour < 15) return 'afternoon';
    if (currentHour >= 15 && currentHour < 18) return 'late_afternoon';
    if (currentHour >= 18 && currentHour < 21) return 'evening';
    return null;
  }, [currentHour]);

  // Get current energy level
  const currentEnergyLevel = useMemo(() => {
    if (!suggestedSlot) return null;
    const currentLog = todayLogs.find(l => l.time_slot === suggestedSlot);
    return currentLog?.energy_level || null;
  }, [todayLogs, suggestedSlot]);

  // Get recommended tasks based on current energy
  const recommendedTasks = useMemo(() => {
    if (!currentEnergyLevel) return tasks;
    
    if (currentEnergyLevel >= 4) {
      return tasks.filter(t => t.energyRequired === 'high' || t.energyRequired === 'medium');
    } else if (currentEnergyLevel >= 3) {
      return tasks.filter(t => t.energyRequired === 'medium' || t.energyRequired === 'low');
    }
    return tasks.filter(t => t.energyRequired === 'low');
  }, [currentEnergyLevel, tasks]);

  // Calculate overall metrics
  const metrics = useMemo(() => {
    const todayTotal = todayLogs.reduce((acc, log) => acc + log.energy_level, 0);
    const todayAvg = todayLogs.length > 0 ? todayTotal / todayLogs.length : 0;
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalSlots = TIME_SLOTS.length;
    const loggedSlots = todayLogs.length;
    
    return {
      todayAvg: todayAvg.toFixed(1),
      loggedSlots,
      totalSlots,
      completedTasks,
      totalTasks: tasks.length,
      productivity: Math.round((completedTasks / tasks.length) * 100)
    };
  }, [todayLogs, tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Header with Metrics */}
      <Card className="border-border/30 overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                  <Cpu className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Energy Flow
                  <span className="text-[10px] bg-gradient-to-r from-primary to-secondary text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    AI Powered
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sistema de otimização biológica em tempo real
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Energia Média</span>
              </div>
              <p className="text-2xl font-bold text-primary">{metrics.todayAvg}<span className="text-sm font-normal text-muted-foreground">/5</span></p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-secondary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Registros</span>
              </div>
              <p className="text-2xl font-bold text-secondary">{metrics.loggedSlots}<span className="text-sm font-normal text-muted-foreground">/{metrics.totalSlots}</span></p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-violet-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Produtividade</span>
              </div>
              <p className="text-2xl font-bold text-violet-500">{metrics.productivity}<span className="text-sm font-normal text-muted-foreground">%</span></p>
            </div>
          </div>
        </CardHeader>

        {/* Navigation Tabs */}
        <div className="px-4 pb-2">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
            {[
              { id: 'register', label: 'Registrar', icon: Zap },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'tasks', label: 'Tarefas', icon: CheckCircle2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-4 pt-2">
          <AnimatePresence mode="wait">
            {/* Register Tab */}
            {activeTab === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Energy Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Timeline de Energia
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-border via-primary/30 to-border -translate-y-1/2 z-0" />
                    
                    <div className="relative flex justify-between gap-2 z-10">
                      {TIME_SLOTS.map((slot, index) => {
                        const logged = todayLogs.find(l => l.time_slot === slot.id);
                        const isSuggested = slot.id === suggestedSlot && !logged;
                        const Icon = slot.icon;
                        
                        return (
                          <motion.button
                            key={slot.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setSelectedSlot(slot.id);
                              if (logged) {
                                setSelectedLevel(logged.energy_level);
                                setActivity(logged.activity || '');
                              } else {
                                setSelectedLevel(null);
                                setActivity('');
                              }
                            }}
                            className={cn(
                              'relative flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl transition-all flex-1',
                              selectedSlot === slot.id
                                ? 'bg-card border-2 border-primary shadow-lg scale-105 z-20'
                                : logged
                                  ? 'bg-card border border-secondary/50 shadow-sm'
                                  : isSuggested
                                    ? 'bg-primary/10 border-2 border-dashed border-primary/50'
                                    : 'bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card'
                            )}
                          >
                            {isSuggested && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                                AGORA
                              </span>
                            )}
                            <div className={cn(
                              'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center',
                              logged 
                                ? `bg-gradient-to-br ${ENERGY_LEVELS[logged.energy_level - 1].color}`
                                : `bg-gradient-to-br ${slot.gradient} opacity-60`
                            )}>
                              {logged ? (
                                <span className="text-base sm:text-lg font-bold text-white">{logged.energy_level}</span>
                              ) : (
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              )}
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">{slot.time}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Energy Level Selector */}
                <AnimatePresence>
                  {selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Battery className="w-4 h-4 text-primary" />
                            Nível de Energia
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {TIME_SLOTS.find(s => s.id === selectedSlot)?.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {ENERGY_LEVELS.map((level) => {
                            const LevelIcon = level.icon;
                            return (
                              <motion.button
                                key={level.level}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedLevel(level.level)}
                                className={cn(
                                  'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
                                  selectedLevel === level.level
                                    ? `border-transparent bg-gradient-to-br ${level.color} shadow-lg`
                                    : 'border-border/50 bg-card hover:border-primary/30'
                                )}
                              >
                                {level.pulse && selectedLevel === level.level && (
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                                )}
                                <LevelIcon className={cn(
                                  'w-5 h-5',
                                  selectedLevel === level.level ? 'text-white' : 'text-muted-foreground'
                                )} />
                                <span className={cn(
                                  'text-lg font-bold',
                                  selectedLevel === level.level ? 'text-white' : 'text-foreground'
                                )}>
                                  {level.level}
                                </span>
                                <span className={cn(
                                  'text-[10px] font-medium',
                                  selectedLevel === level.level ? 'text-white/90' : 'text-muted-foreground'
                                )}>
                                  {level.label}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>

                        <Input
                          placeholder="Atividade atual (opcional)"
                          value={activity}
                          onChange={(e) => setActivity(e.target.value)}
                          className="h-11 rounded-xl bg-card border-border/50"
                        />

                        <Button
                          onClick={handleLogEnergy}
                          disabled={!selectedLevel}
                          className="w-full h-12 rounded-xl font-semibold text-base bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:opacity-90"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Sincronizar Energia
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Peak Energy Card */}
                {peakEnergySlot ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <p className="font-semibold">Pico de Performance</p>
                      </div>
                      <p className="text-3xl font-bold mb-1">
                        {peakEnergySlot.label}
                      </p>
                      <p className="text-sm opacity-90 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {peakEnergySlot.time} — Horário ideal para tarefas de alta complexidade
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 text-center">
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Registre sua energia por alguns dias para descobrir padrões
                    </p>
                  </div>
                )}

                {/* Energy Pattern Chart */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Padrão Energético (30 dias)
                  </p>
                  <div className="space-y-2">
                    {TIME_SLOTS.map((slot) => {
                      const pattern = energyPatterns[slot.id];
                      const percentage = (pattern.avg / 5) * 100;
                      const Icon = slot.icon;
                      
                      return (
                        <div key={slot.id} className="group">
                          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors">
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br',
                              slot.gradient
                            )}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{slot.label}</span>
                                <span className="text-xs font-bold text-primary">
                                  {pattern.count > 0 ? pattern.avg.toFixed(1) : '—'}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pattern.count > 0 ? percentage : 0}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className={cn(
                                    'h-full rounded-full bg-gradient-to-r',
                                    percentage >= 80 ? 'from-emerald-500 to-teal-500' :
                                    percentage >= 60 ? 'from-lime-500 to-green-500' :
                                    percentage >= 40 ? 'from-yellow-500 to-amber-500' :
                                    percentage >= 20 ? 'from-orange-500 to-red-500' : 'from-red-500 to-rose-600'
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold">Insight AI</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {energyLogs.length < 7 
                      ? 'Continue registrando sua energia. Em 7 dias, a IA fornecerá insights personalizados sobre seu ritmo biológico.'
                      : peakEnergySlot
                        ? `Seus dados mostram que ${peakEnergySlot.label.toLowerCase()} é seu período mais produtivo. Recomendo bloquear ${peakEnergySlot.time} para trabalho profundo e evitar interrupções.`
                        : 'Registre energia em diferentes períodos para mapear seu ciclo circadiano e otimizar sua rotina.'
                    }
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Current Energy Status */}
                {currentEnergyLevel && (
                  <div className={cn(
                    'p-3 rounded-xl border flex items-center justify-between',
                    currentEnergyLevel >= 4 
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : currentEnergyLevel >= 3
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                  )}>
                    <div className="flex items-center gap-2">
                      <Sparkles className={cn(
                        'w-4 h-4',
                        currentEnergyLevel >= 4 ? 'text-emerald-500' :
                        currentEnergyLevel >= 3 ? 'text-amber-500' : 'text-red-500'
                      )} />
                      <span className="text-sm font-medium">
                        {currentEnergyLevel >= 4 ? 'Energia Alta' :
                         currentEnergyLevel >= 3 ? 'Energia Moderada' : 'Energia Baixa'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {recommendedTasks.length} tarefas sugeridas
                    </span>
                  </div>
                )}

                {/* Task List */}
                <div className="space-y-2">
                  {recommendedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        'group relative p-4 rounded-xl border cursor-pointer transition-all',
                        task.completed
                          ? 'bg-secondary/10 border-secondary/30'
                          : 'bg-card border-border/50 hover:border-primary/30 hover:shadow-md'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn(
                              'font-semibold text-sm',
                              task.completed && 'line-through text-muted-foreground'
                            )}>
                              {task.title}
                            </h4>
                            <span className={cn(
                              'text-[10px] px-2 py-0.5 rounded-full font-medium',
                              task.energyRequired === 'high'
                                ? 'bg-red-500/10 text-red-500'
                                : task.energyRequired === 'medium'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-green-500/10 text-green-500'
                            )}>
                              {task.energyRequired === 'high' ? 'Alta Energia' :
                               task.energyRequired === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {task.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" />
                              {task.category}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={cn(
                          'w-5 h-5 text-muted-foreground/50 transition-transform',
                          'group-hover:translate-x-1 group-hover:text-primary'
                        )} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progresso do Dia</span>
                    <span className="text-sm font-bold text-primary">
                      {metrics.completedTasks}/{metrics.totalTasks}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.productivity}%` }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
