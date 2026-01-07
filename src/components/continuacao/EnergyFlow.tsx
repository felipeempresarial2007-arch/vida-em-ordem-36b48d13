import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EnergyLog {
  id: string;
  time_slot: string;
  energy_level: number;
  activity: string | null;
  date: string;
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Manhã', time: '6h-9h', icon: Sunrise },
  { id: 'late_morning', label: 'Final da Manhã', time: '9h-12h', icon: Sun },
  { id: 'afternoon', label: 'Tarde', time: '12h-15h', icon: Coffee },
  { id: 'late_afternoon', label: 'Final da Tarde', time: '15h-18h', icon: Sun },
  { id: 'evening', label: 'Noite', time: '18h-21h', icon: Moon },
];

const ENERGY_LEVELS = [
  { level: 1, label: 'Muito Baixo', color: 'bg-red-500', emoji: '😴' },
  { level: 2, label: 'Baixo', color: 'bg-orange-500', emoji: '😕' },
  { level: 3, label: 'Médio', color: 'bg-yellow-500', emoji: '😐' },
  { level: 4, label: 'Alto', color: 'bg-lime-500', emoji: '😊' },
  { level: 5, label: 'Muito Alto', color: 'bg-green-500', emoji: '🔥' },
];

const TASK_RECOMMENDATIONS = {
  high: [
    { icon: Brain, title: 'Trabalho Profundo', desc: 'Tarefas complexas que exigem concentração' },
    { icon: Target, title: 'Decisões Importantes', desc: 'Momento ideal para escolhas difíceis' },
    { icon: Lightbulb, title: 'Criatividade', desc: 'Brainstorming e ideação' },
  ],
  medium: [
    { icon: Coffee, title: 'Reuniões', desc: 'Interações que exigem atenção moderada' },
    { icon: Target, title: 'Planejamento', desc: 'Organizar próximas atividades' },
  ],
  low: [
    { icon: Coffee, title: 'Tarefas Mecânicas', desc: 'E-mails, organização, arquivos' },
    { icon: Moon, title: 'Descanso Ativo', desc: 'Caminhada leve, alongamento' },
  ],
};

export function EnergyFlow() {
  const { user } = useAuth();
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [activity, setActivity] = useState('');
  const [showInsights, setShowInsights] = useState(false);

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
        toast.success('Energia registrada!');
        setSelectedSlot(null);
        setSelectedLevel(null);
        setActivity('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao registrar energia');
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

  // Get recommendation based on current energy
  const getCurrentRecommendation = () => {
    if (!suggestedSlot) return null;
    const currentLog = todayLogs.find(l => l.time_slot === suggestedSlot);
    if (!currentLog) return null;
    
    if (currentLog.energy_level >= 4) return TASK_RECOMMENDATIONS.high;
    if (currentLog.energy_level >= 3) return TASK_RECOMMENDATIONS.medium;
    return TASK_RECOMMENDATIONS.low;
  };

  const currentRecommendation = getCurrentRecommendation();

  return (
    <div className="space-y-4">
      {/* Main Energy Flow Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-border/50 overflow-hidden bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Fluxo de Energia
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Inovador
                    </span>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Descubra seus picos de produtividade
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInsights(!showInsights)}
                className="text-xs"
              >
                {showInsights ? 'Registrar' : 'Ver Insights'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <AnimatePresence mode="wait">
              {!showInsights ? (
                <motion.div
                  key="logger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Today's Energy Timeline */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Registre sua energia de hoje
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {TIME_SLOTS.map((slot) => {
                        const logged = todayLogs.find(l => l.time_slot === slot.id);
                        const isSuggested = slot.id === suggestedSlot && !logged;
                        const Icon = slot.icon;
                        
                        return (
                          <button
                            key={slot.id}
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
                              'flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-xl border transition-all min-w-[70px]',
                              selectedSlot === slot.id
                                ? 'border-primary bg-primary/10'
                                : logged
                                  ? 'border-secondary/30 bg-secondary/5'
                                  : isSuggested
                                    ? 'border-primary/50 bg-primary/5 animate-pulse'
                                    : 'border-border/50 bg-muted/30 hover:bg-muted/50'
                            )}
                          >
                            <Icon className={cn(
                              'w-4 h-4',
                              logged ? 'text-secondary' : 'text-muted-foreground'
                            )} />
                            <span className="text-xs font-medium">{slot.time}</span>
                            {logged && (
                              <span className="text-lg">
                                {ENERGY_LEVELS[logged.energy_level - 1].emoji}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Energy Level Selector */}
                  {selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2 border-t border-border/50"
                    >
                      <p className="text-sm font-medium text-foreground">
                        Como está sua energia?
                      </p>
                      <div className="flex gap-2 justify-center">
                        {ENERGY_LEVELS.map((level) => (
                          <button
                            key={level.level}
                            onClick={() => setSelectedLevel(level.level)}
                            className={cn(
                              'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                              selectedLevel === level.level
                                ? 'border-primary bg-primary/10 scale-105'
                                : 'border-border/50 hover:border-primary/50'
                            )}
                          >
                            <span className="text-2xl">{level.emoji}</span>
                            <div className={cn('w-8 h-1.5 rounded-full', level.color)} />
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Input
                          placeholder="O que você está fazendo? (opcional)"
                          value={activity}
                          onChange={(e) => setActivity(e.target.value)}
                          className="h-10 rounded-xl text-sm"
                        />
                      </div>

                      <Button
                        onClick={handleLogEnergy}
                        disabled={!selectedLevel}
                        className="w-full h-10 rounded-xl"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Registrar Energia
                      </Button>
                    </motion.div>
                  )}

                  {/* Current Recommendation */}
                  {currentRecommendation && !selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-secondary/10 border border-secondary/20"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-secondary" />
                        <p className="text-sm font-semibold text-secondary">
                          Recomendado agora
                        </p>
                      </div>
                      <div className="space-y-2">
                        {currentRecommendation.map((rec, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <rec.icon className="w-4 h-4 text-secondary" />
                            <div>
                              <span className="font-medium">{rec.title}</span>
                              <span className="text-muted-foreground"> - {rec.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Peak Energy Time */}
                  {peakEnergySlot ? (
                    <div className="p-4 rounded-xl gradient-primary text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <p className="font-semibold">Seu Pico de Energia</p>
                      </div>
                      <p className="text-2xl font-bold mb-1">
                        {peakEnergySlot.label}
                      </p>
                      <p className="text-sm opacity-90">
                        {peakEnergySlot.time} é quando você tem mais energia. 
                        Agende tarefas importantes para este horário!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted text-center">
                      <p className="text-sm text-muted-foreground">
                        Registre sua energia por alguns dias para descobrir seus padrões
                      </p>
                    </div>
                  )}

                  {/* Energy Pattern Visualization */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Padrão de Energia (últimos 30 dias)
                    </p>
                    <div className="space-y-2">
                      {TIME_SLOTS.map((slot) => {
                        const pattern = energyPatterns[slot.id];
                        const percentage = (pattern.avg / 5) * 100;
                        const Icon = slot.icon;
                        
                        return (
                          <div key={slot.id} className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">{slot.time}</span>
                                <span className="text-xs font-medium">
                                  {pattern.count > 0 ? pattern.avg.toFixed(1) : '-'}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pattern.count > 0 ? percentage : 0}%` }}
                                  transition={{ duration: 0.5 }}
                                  className={cn(
                                    'h-full rounded-full',
                                    percentage >= 80 ? 'bg-green-500' :
                                    percentage >= 60 ? 'bg-lime-500' :
                                    percentage >= 40 ? 'bg-yellow-500' :
                                    percentage >= 20 ? 'bg-orange-500' : 'bg-red-500'
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Smart Insights */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Dica Inteligente</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyLogs.length < 7 
                        ? 'Continue registrando sua energia diariamente. Em uma semana, você terá insights personalizados!'
                        : peakEnergySlot
                          ? `Você é mais produtivo ${peakEnergySlot.label.toLowerCase()}. Bloqueie este horário para suas tarefas mais importantes e evite reuniões.`
                          : 'Registre sua energia em diferentes horários para descobrir seu padrão único de produtividade.'
                      }
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
