import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if notifications are supported and not yet granted
    if (!('Notification' in window)) return;
    
    // Check if user already dismissed the prompt today
    const lastDismissed = localStorage.getItem('focus30_notification_prompt_dismissed');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastDismissed === today) return;
    
    // Check if notifications are already granted
    if (Notification.permission === 'granted') return;
    
    // Check if reminder is already enabled
    const reminderEnabled = localStorage.getItem('focus30_reminder_enabled');
    if (reminderEnabled === 'true') return;

    // Show prompt after a short delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('focus30_notification_prompt_dismissed', today);
    setShowPrompt(false);
  };

  const handleEnable = () => {
    setShowPrompt(false);
    navigate('/settings');
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
                <p className="font-medium text-sm">Ativar lembretes diários?</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receba uma notificação para completar sua missão todos os dias.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handleEnable} className="flex-1">
                    Ativar
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
