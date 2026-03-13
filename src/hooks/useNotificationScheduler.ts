import { useEffect, useRef } from 'react';

export function useNotificationScheduler() {
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastNotificationDateRef = useRef<string | null>(null);

  useEffect(() => {
    // Check if notifications are supported and enabled
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkAndNotify = () => {
      const isEnabled = localStorage.getItem('focus30_reminder_enabled') === 'true';
      const reminderTime = localStorage.getItem('focus30_reminder_time');

      if (!isEnabled || !reminderTime) return;

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Only notify once per day
      if (lastNotificationDateRef.current === today) return;

      // Parse reminder time (format: HH:MM:SS)
      const [hours, minutes] = reminderTime.split(':').map(Number);
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Check if it's time to notify (within 1 minute window)
      if (currentHours === hours && currentMinutes === minutes) {
        lastNotificationDateRef.current = today;
        showNotification();
      }
    };

    const showNotification = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('FOCUS 30 🎯', {
            body: 'Hora de completar sua missão do dia! Vamos manter o foco?',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: 'focus30-daily-reminder',
            requireInteraction: true,
          });
        });
      } else {
        new Notification('FOCUS 30 🎯', {
          body: 'Hora de completar sua missão do dia! Vamos manter o foco?',
          icon: '/pwa-192x192.png',
        });
      }
    };

    // Check every minute
    checkIntervalRef.current = setInterval(checkAndNotify, 60000);
    
    // Initial check
    checkAndNotify();

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);
}
