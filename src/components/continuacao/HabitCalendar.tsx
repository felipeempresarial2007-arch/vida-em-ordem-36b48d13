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

  const modifiersClassNames = {
    complete: 'habit-day-complete',
    partial: 'habit-day-partial',
    missed: 'habit-day-missed',
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
              modifiersClassNames={modifiersClassNames}
              className="habit-calendar rounded-xl border border-border/30 p-4 pointer-events-auto"
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-muted-foreground font-medium">Completo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="text-muted-foreground font-medium">Parcial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground font-medium">Pendente</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
