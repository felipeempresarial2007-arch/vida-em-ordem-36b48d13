import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isFuture, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { DailyAgendaSheet } from './DailyAgendaSheet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [agendaDates, setAgendaDates] = useState<Set<string>>(new Set());

  // Fetch dates that have agenda items
  useEffect(() => {
    const fetchAgendaDates = async () => {
      if (!user) return;
      
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      const { data } = await supabase
        .from('daily_agenda')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'));

      if (data) {
        setAgendaDates(new Set(data.map(d => d.date)));
      }
    };

    fetchAgendaDates();
  }, [user, currentMonth, sheetOpen]);

  // Calculate completion status for each day
  const getDayStatus = (date: Date): 'complete' | 'partial' | 'none' | 'future' | 'hasAgenda' => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if has agenda items
    if (agendaDates.has(dateStr)) return 'hasAgenda';
    
    if (isFuture(date) && !isToday(date)) return 'future';
    if (tasks.length === 0) return 'none';
    
    const completedCount = tasks.filter(t => t.completedDates.includes(dateStr)).length;
    
    if (completedCount === tasks.length) return 'complete';
    if (completedCount > 0) return 'partial';
    return 'none';
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
      scheduled: agendaDates.size,
      percentage: days.length > 0 ? Math.round((completeDays / days.length) * 100) : 0,
    };
  };

  const monthlyStats = getMonthlyStats();

  // Custom modifiers for calendar
  const modifiers = {
    complete: (date: Date) => getDayStatus(date) === 'complete',
    partial: (date: Date) => getDayStatus(date) === 'partial',
    missed: (date: Date) => getDayStatus(date) === 'none' && !isFuture(date) && !isToday(date) && tasks.length > 0,
    hasAgenda: (date: Date) => agendaDates.has(format(date, 'yyyy-MM-dd')),
  };

  const modifiersClassNames = {
    complete: 'habit-day-complete',
    partial: 'habit-day-partial',
    missed: 'habit-day-missed',
    hasAgenda: 'habit-day-agenda',
  };

  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSheetOpen(true);
    }
  };

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/50 overflow-hidden bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Calendário & Agenda</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Clique em qualquer dia para organizar
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {/* Monthly Stats */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-secondary/10 rounded-xl p-3 text-center"
              >
                <p className="text-xl font-bold text-secondary">{monthlyStats.complete}</p>
                <p className="text-[10px] text-muted-foreground">Completos</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-primary/10 rounded-xl p-3 text-center"
              >
                <p className="text-xl font-bold text-primary">{monthlyStats.partial}</p>
                <p className="text-[10px] text-muted-foreground">Parciais</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-accent/50 rounded-xl p-3 text-center"
              >
                <p className="text-xl font-bold text-foreground">{monthlyStats.scheduled}</p>
                <p className="text-[10px] text-muted-foreground">Agendados</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-muted rounded-xl p-3 text-center"
              >
                <p className="text-xl font-bold text-foreground">{monthlyStats.percentage}%</p>
                <p className="text-[10px] text-muted-foreground">Taxa</p>
              </motion.div>
            </div>

            {/* Custom Month Navigation */}
            <div className="flex items-center justify-between mb-3 px-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-9 w-9 rounded-xl hover:bg-primary/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-base font-semibold capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="h-9 w-9 rounded-xl hover:bg-primary/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDayClick}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={ptBR}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="habit-calendar-premium rounded-2xl p-3 pointer-events-auto"
                showOutsideDays={false}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-secondary to-secondary/70" />
                <span className="text-muted-foreground">Completo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary/60 to-primary/40" />
                <span className="text-muted-foreground">Parcial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-accent to-accent/70 ring-2 ring-primary/30" />
                <span className="text-muted-foreground">Agendado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Agenda Sheet */}
      <DailyAgendaSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedDate={selectedDate}
      />
    </>
  );
}
