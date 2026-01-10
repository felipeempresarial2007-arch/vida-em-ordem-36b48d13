import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, TrendingUp, TrendingDown, X, CheckCircle2, Lock, ChevronRight, Loader2, Sparkles, DollarSign } from 'lucide-react';
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

interface FinancialEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string | null;
  date: string;
}

const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros'],
};

export default function Financas() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMission, setSelectedMission] = useState<any>(null);

  const stageMissions = MISSIONS.filter(m => m.stage === 'financas');
  const stageInfo = STAGE_INFO.financas;

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
          .eq('stage', 'financas')
          .eq('completed', true);

        if (missions) {
          setCompletedMissions(missions.map(m => m.day_number));
        }

        const { data: entriesData } = await supabase
          .from('financial_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(50);

        if (entriesData) {
          setEntries(entriesData as FinancialEntry[]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !category) return;

    try {
      const { data, error } = await supabase
        .from('financial_entries')
        .insert({
          user_id: user.id,
          type: formType,
          amount: parseFloat(amount),
          category,
          description: description || null,
          date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEntries([data as FinancialEntry, ...entries]);
        toast.success('Registro adicionado!');
        setShowForm(false);
        setAmount('');
        setCategory('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao adicionar registro');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;
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
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{stageInfo.name}</h1>
          <p className="text-xs text-muted-foreground">{stageInfo.description}</p>
        </div>
      </div>

      {/* Summary Cards - Compact */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-3 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-center gap-1.5 text-secondary mb-1.5">
              <div className="w-6 h-6 rounded-md bg-secondary/15 flex items-center justify-center">
                <TrendingUp className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-semibold uppercase">Entradas</span>
            </div>
            <p className="text-sm font-bold text-foreground truncate">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-3 bg-gradient-to-br from-destructive/10 to-destructive/5">
            <div className="flex items-center gap-1.5 text-destructive mb-1.5">
              <div className="w-6 h-6 rounded-md bg-destructive/15 flex items-center justify-center">
                <TrendingDown className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-semibold uppercase">Saídas</span>
            </div>
            <p className="text-sm font-bold text-foreground truncate">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 overflow-hidden">
          <CardContent className={cn(
            'p-3 bg-gradient-to-br',
            balance >= 0 ? 'from-primary/10 to-primary/5' : 'from-destructive/10 to-destructive/5'
          )}>
            <div className={cn('flex items-center gap-1.5 mb-1.5', balance >= 0 ? 'text-primary' : 'text-destructive')}>
              <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', balance >= 0 ? 'bg-primary/15' : 'bg-destructive/15')}>
                <DollarSign className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-semibold uppercase">Saldo</span>
            </div>
            <p className={cn(
              'text-sm font-bold truncate',
              balance >= 0 ? 'text-primary' : 'text-destructive'
            )}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Buttons - Compact */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="secondary" 
          className="h-10 text-sm"
          onClick={() => { setFormType('income'); setShowForm(true); }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Entrada
        </Button>
        <Button 
          variant="outline" 
          className="h-10 text-sm"
          onClick={() => { setFormType('expense'); setShowForm(true); }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Saída
        </Button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <Card className="animate-scale-in border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {formType === 'income' ? 'Nova Entrada' : 'Nova Saída'}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Valor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Categoria</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES[formType].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Descrição (opcional)</Label>
                <Input
                  placeholder="Ex: Conta de luz"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button type="submit" className="w-full h-10" variant={formType === 'income' ? 'secondary' : 'default'}>
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="animate-slide-up border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Últimos Registros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.slice(0, 5).map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {entry.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-foreground">{entry.category}</p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                    )}
                  </div>
                </div>
                <p className={cn(
                  'font-bold text-sm',
                  entry.type === 'income' ? 'text-secondary' : 'text-destructive'
                )}>
                  {entry.type === 'income' ? '+' : '-'} R$ {Number(entry.amount).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
            ))}
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
              style={{ width: `${progressPercent}%` }}
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