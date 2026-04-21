import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useReminderSettings } from '@/hooks/useReminderSettings';

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const { settings, loading } = useReminderSettings();

  // Detect iOS Safari without standalone PWA mode
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone =
    (window.navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;
  const iosNeedsInstall = isIOS && !isStandalone;

  useEffect(() => {
    // Don't show if still loading settings or if reminders are already enabled
    if (loading || settings?.isEnabled) return;
    
    // Check if user already dismissed the prompt today
    const lastDismissed = localStorage.getItem('focus30_notification_prompt_dismissed');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastDismissed === today) return;

    // iOS Safari (not installed): show install hint instead of permission prompt
    if (iosNeedsInstall) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // Check if notifications are supported
    if (!('Notification' in window)) return;
    
    // Check if notifications are already granted
    if (Notification.permission === 'granted') return;

    // Show prompt after a short delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, settings?.isEnabled, iosNeedsInstall]);

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('focus30_notification_prompt_dismissed', today);
    setShowPrompt(false);
  };

  const handleEnable = () => {
    setShowPrompt(false);
    navigate(iosNeedsInstall ? '/install' : '/settings');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 z-40"
      >
        <Card className="border-primary/20 bg-card/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {iosNeedsInstall ? 'Instale o app no iPhone' : 'Ativar lembretes diários?'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {iosNeedsInstall
                    ? 'Para receber lembretes no iOS, adicione o FOCUS 30 à tela de início.'
                    : 'Receba uma notificação para completar sua missão todos os dias.'}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handleEnable} className="flex-1">
                    {iosNeedsInstall ? 'Como instalar' : 'Ativar'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDismiss}>
                    Depois
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 shrink-0 -mt-1 -mr-1"
                onClick={handleDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
