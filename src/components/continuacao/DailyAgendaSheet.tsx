import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, Trash2, Flag, CalendarDays } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyAgenda, AgendaItem } from '@/hooks/useDailyAgenda';
import { cn } from '@/lib/utils';

interface DailyAgendaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'text-muted-foreground', bg: 'bg-muted/50' },
  medium: { label: 'Média', color: 'text-primary', bg: 'bg-primary/10' },
  high: { label: 'Alta', color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function DailyAgendaSheet({ open, onOpenChange, selectedDate }: DailyAgendaSheetProps) {
  const { items, loading, addItem, toggleComplete, deleteItem } = useDailyAgenda(selectedDate);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    await addItem({
      title: newTask,
      time_start: newTime || undefined,
      priority: newPriority,
    });
    
    setNewTask('');
    setNewTime('');
    setNewPriority('medium');
    setShowForm(false);
  };

  const getDateLabel = () => {
    if (!selectedDate) return '';
    if (isToday(selectedDate)) return 'Hoje';
    if (isTomorrow(selectedDate)) return 'Amanhã';
    return format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl capitalize">{getDateLabel()}</SheetTitle>
              <SheetDescription className="text-sm">
                {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
              </SheetDescription>
            </div>
          </div>
          
          {/* Progress indicator */}
          {items.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso do dia</span>
                <span className="font-medium">{completedCount}/{items.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="py-4 flex-1 overflow-y-auto space-y-4">
          {/* Add task button/form */}
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-muted/30 rounded-2xl p-4 space-y-3"
              >
                <Input
                  placeholder="O que você precisa fazer?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="bg-background"
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="bg-background"
                      placeholder="Horário"
                    />
                  </div>
                  
                  <Select value={newPriority} onValueChange={(v) => setNewPriority(v as any)}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Baixa</SelectItem>
                      <SelectItem value="medium">🟡 Média</SelectItem>
                      <SelectItem value="high">🔴 Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddTask}
                    disabled={!newTask.trim()}
                  >
                    Adicionar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="button">
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar tarefa
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task list */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhuma tarefa para este dia</p>
              <p className="text-sm text-muted-foreground/70">
                Clique no botão acima para começar a organizar seu dia
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((item, index) => (
                  <TaskItem
                    key={item.id}
                    item={item}
                    index={index}
                    onToggle={() => toggleComplete(item.id)}
                    onDelete={() => deleteItem(item.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface TaskItemProps {
  item: AgendaItem;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
}

function TaskItem({ item, index, onToggle, onDelete }: TaskItemProps) {
  const config = priorityConfig[item.priority];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group flex items-center gap-3 p-4 rounded-2xl transition-all",
        item.completed ? "bg-muted/30" : "bg-background border border-border/50 hover:border-primary/30"
      )}
    >
      <Checkbox
        checked={item.completed}
        onCheckedChange={onToggle}
        className="w-6 h-6 rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium transition-all",
          item.completed && "line-through text-muted-foreground"
        )}>
          {item.title}
        </p>
        
        <div className="flex items-center gap-3 mt-1">
          {item.time_start && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {item.time_start.slice(0, 5)}
            </span>
          )}
          
          <span className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
            config.bg, config.color
          )}>
            <Flag className="w-3 h-3" />
            {config.label}
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
