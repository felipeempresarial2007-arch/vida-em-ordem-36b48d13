import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

export interface AgendaItem {
  id: string;
  user_id: string;
  date: string;
  title: string;
  description: string | null;
  time_start: string | null;
  time_end: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export function useDailyAgenda(selectedDate: Date | undefined) {
  const { user } = useAuth();
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const fetchItems = async () => {
    if (!user || !dateStr) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_agenda')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .order('time_start', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setItems((data as AgendaItem[]) || []);
    } catch (error) {
      console.error('Error fetching agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user, dateStr]);

  const addItem = async (item: {
    title: string;
    description?: string;
    time_start?: string;
    time_end?: string;
    priority?: 'low' | 'medium' | 'high';
  }) => {
    if (!user || !dateStr) return;

    try {
      const { data, error } = await supabase
        .from('daily_agenda')
        .insert({
          user_id: user.id,
          date: dateStr,
          title: item.title,
          description: item.description || null,
          time_start: item.time_start || null,
          time_end: item.time_end || null,
          priority: item.priority || 'medium',
        })
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [...prev, data as AgendaItem].sort((a, b) => {
        if (!a.time_start) return 1;
        if (!b.time_start) return -1;
        return a.time_start.localeCompare(b.time_start);
      }));
      toast.success('Tarefa adicionada!');
    } catch (error) {
      console.error('Error adding agenda item:', error);
      toast.error('Erro ao adicionar tarefa');
    }
  };

  const updateItem = async (id: string, updates: Partial<AgendaItem>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_agenda')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Error updating agenda item:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const toggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      await updateItem(id, { completed: !item.completed });
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_agenda')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Tarefa removida!');
    } catch (error) {
      console.error('Error deleting agenda item:', error);
      toast.error('Erro ao remover tarefa');
    }
  };

  const getItemsCountForDate = async (date: Date): Promise<number> => {
    if (!user) return 0;
    
    const { count, error } = await supabase
      .from('daily_agenda')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('date', format(date, 'yyyy-MM-dd'));

    if (error) return 0;
    return count || 0;
  };

  return {
    items,
    loading,
    addItem,
    updateItem,
    toggleComplete,
    deleteItem,
    refetch: fetchItems,
    getItemsCountForDate,
  };
}
