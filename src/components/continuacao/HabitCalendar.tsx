import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailyTask {
  id: string;
  name: string;
  category: string;
  completedDates: string[];
}

interface HabitCalendarProps {
  tasks: DailyTask[];
}

export function HabitCalendar({ tasks }: HabitCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate completion status for each day
  const getDayStatus = (date: Date): 'complete' | 'partial' | 'none' | 'future' => {
    if (isFuture(date) && !isToday(date)) return 'future';
    if (tasks.length === 0) return 'none';
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = tasks.filter(t => t.completedDates.includes(dateStr)).length;
    
    if (completedCount === tasks.length) return 'complete';
    if (completedCount > 0) return 'partial';
    return 'none';
  };

  // Get tasks for selected date
  const getSelectedDateTasks = () => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return tasks.map(task => ({
      ...task,
      completed: task.completedDates.includes(dateStr),
    }));
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end }).filter(d => !isFuture(d) || isToday(d));
    
    let completeDays = 0;
    let partialDays = 0;
    
    days.forEach(day => {
      const status = getDayStatus(day);
      if (status === 'complete') completeDays++;
      else if (status === 'partial') partialDays++;
    });
    
    return {
      total: days.length,
      complete: completeDays,
      partial: partialDays,
      percentage: days.length > 0 ? Math.round((completeDays / days.length) * 100) : 0,
    };
  };

  const monthlyStats = getMonthlyStats();
  const selectedDateTasks = getSelectedDateTasks();

  // Custom day content for calendar
  const modifiers = {
    complete: (date: Date) => getDayStatus(date) === 'complete',
    partial: (date: Date) => getDayStatus(date) === 'partial',
    missed: (date: Date) => getDayStatus(date) === 'none' && !isFuture(date) && !isToday(date) && tasks.length > 0,
  };

  const modifiersStyles = {
    complete: {
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      fontWeight: 600,
    },
    partial: {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
      color: 'hsl(var(--primary))',
      fontWeight: 600,
    },
    missed: {
      backgroundColor: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Calendário de Hábitos</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visualize sua consistência diária
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Monthly Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-secondary/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-secondary">{monthlyStats.complete}</p>
              <p className="text-xs text-muted-foreground">Dias completos</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-primary">{monthlyStats.partial}</p>
              <p className="text-xs text-muted-foreground">Dias parciais</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-foreground">{monthlyStats.percentage}%</p>
              <p className="text-xs text-muted-foreground">Taxa mensal</p>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onMonthChange={setCurrentMonth}
              locale={ptBR}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-xl border border-border/50 p-3 pointer-events-auto"
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Completo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <span className="text-muted-foreground">Parcial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-muted-foreground">Sem tarefas</span>
            </div>
          </div>

          {/* Selected Date Tasks */}
          {selectedDate && selectedDateTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              <p className="text-sm font-semibold text-foreground mb-3">
                {isToday(selectedDate) ? 'Tarefas de Hoje' : format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="space-y-2">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl text-sm',
                      task.completed 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : isFuture(selectedDate) && !isToday(selectedDate) ? (
                      <Minus className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className={cn(task.completed && 'line-through')}>{task.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
