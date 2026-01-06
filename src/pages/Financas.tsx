import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MISSIONS, STAGE_INFO } from '@/lib/missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, TrendingUp, TrendingDown, X, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

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

  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stageInfo.gradient)}>
            <Wallet className="w-6 h-6 text-primary-foreground" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 animate-slide-up">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Entradas</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-destructive mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Saídas</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-medium">Saldo</span>
            </div>
            <p className={cn(
              'text-xl font-bold',
              balance >= 0 ? 'text-secondary' : 'text-destructive'
            )}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Button */}
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => { setFormType('income'); setShowForm(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Entrada
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => { setFormType('expense'); setShowForm(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Saída
        </Button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {formType === 'income' ? 'Nova Entrada' : 'Nova Saída'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
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
                <Label>Descrição (opcional)</Label>
                <Input
                  placeholder="Ex: Conta de luz"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" variant={formType === 'income' ? 'secondary' : 'default'}>
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Últimos Registros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.slice(0, 10).map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {entry.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-foreground">{entry.category}</p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                    )}
                  </div>
                </div>
                <p className={cn(
                  'font-bold',
                  entry.type === 'income' ? 'text-secondary' : 'text-destructive'
                )}>
                  {entry.type === 'income' ? '+' : '-'} R$ {Number(entry.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stage Missions */}
      <div className="space-y-4">
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
