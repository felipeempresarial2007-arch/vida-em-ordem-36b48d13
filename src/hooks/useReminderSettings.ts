import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReminderSettings {
  id: string;
  reminderTime: string;
  isEnabled: boolean;
}

export function useReminderSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Fetch user settings
  const fetchSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          reminderTime: data.reminder_time,
          isEnabled: data.is_enabled,
        });
      } else {
        // Create default settings
        const { data: newSettings, error: createError } = await supabase
          .from('reminder_settings')
          .insert({
            user_id: user.id,
            reminder_time: '09:00:00',
            is_enabled: true,
          })
          .select()
          .single();

        if (createError) throw createError;

        if (newSettings) {
          setSettings({
            id: newSettings.id,
            reminderTime: newSettings.reminder_time,
            isEnabled: newSettings.is_enabled,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching reminder settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Request notification permission
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      toast.error('Notificações bloqueadas. Altere nas configurações do navegador.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Notificações ativadas!');
        return true;
      } else {
        toast.error('Permissão de notificação negada');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Erro ao solicitar permissão de notificação');
      return false;
    }
  };

  // Update reminder time
  const updateReminderTime = async (time: string) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from('reminder_settings')
        .update({ reminder_time: time })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings({ ...settings, reminderTime: time });
      
      // Reschedule local notification
      if (settings.isEnabled && notificationPermission === 'granted') {
        scheduleLocalNotification(time);
      }
      
      toast.success('Horário do lembrete atualizado!');
    } catch (error) {
      console.error('Error updating reminder time:', error);
      toast.error('Erro ao atualizar horário');
    }
  };

  // Toggle reminder
  const toggleReminder = async (enabled: boolean) => {
    if (!user || !settings) return;

    // If enabling, request permission first
    if (enabled) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;
    }

    try {
      const { error } = await supabase
        .from('reminder_settings')
        .update({ is_enabled: enabled })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings({ ...settings, isEnabled: enabled });
      
      if (enabled && notificationPermission === 'granted') {
        scheduleLocalNotification(settings.reminderTime);
        toast.success('Lembretes diários ativados!');
      } else {
        clearScheduledNotifications();
        toast.success('Lembretes desativados');
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Erro ao alterar lembrete');
    }
  };

  // Schedule local notification using localStorage + setInterval
  const scheduleLocalNotification = (time: string) => {
    localStorage.setItem('focus30_reminder_time', time);
    localStorage.setItem('focus30_reminder_enabled', 'true');
  };

  const clearScheduledNotifications = () => {
    localStorage.removeItem('focus30_reminder_time');
    localStorage.setItem('focus30_reminder_enabled', 'false');
  };

  // Test notification
  const testNotification = () => {
    if (notificationPermission !== 'granted') {
      toast.error('Permita notificações primeiro');
      return;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('FOCUS 30', {
          body: 'Hora de completar sua missão do dia!',
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'focus30-test',
          requireInteraction: true,
        });
      });
    } else {
      // Fallback to regular notification
      new Notification('FOCUS 30', {
        body: 'Hora de completar sua missão do dia!',
        icon: '/pwa-192x192.png',
      });
    }
  };

  return {
    settings,
    loading,
    notificationPermission,
    requestNotificationPermission,
    updateReminderTime,
    toggleReminder,
    testNotification,
    refetch: fetchSettings,
  };
}
