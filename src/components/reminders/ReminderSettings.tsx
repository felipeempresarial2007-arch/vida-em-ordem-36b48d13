import { useState } from 'react';
import { useReminderSettings } from '@/hooks/useReminderSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Clock, TestTube2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const REMINDER_TIMES = [
  { value: '06:00:00', label: '06:00' },
  { value: '07:00:00', label: '07:00' },
  { value: '08:00:00', label: '08:00' },
  { value: '09:00:00', label: '09:00' },
  { value: '10:00:00', label: '10:00' },
  { value: '12:00:00', label: '12:00' },
  { value: '18:00:00', label: '18:00' },
  { value: '19:00:00', label: '19:00' },
  { value: '20:00:00', label: '20:00' },
  { value: '21:00:00', label: '21:00' },
];

export function ReminderSettings() {
  const {
    settings,
    loading,
    notificationPermission,
    updateReminderTime,
    toggleReminder,
    testNotification,
  } = useReminderSettings();

  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    await toggleReminder(checked);
    setIsUpdating(false);
  };

  const handleTimeChange = async (time: string) => {
    setIsUpdating(true);
    await updateReminderTime(time);
    setIsUpdating(false);
  };

  const isBlocked = notificationPermission === 'denied';
  const isEnabled = settings?.isEnabled && notificationPermission === 'granted';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-muted">
                <BellOff className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-base">Lembrete Diário</CardTitle>
              <CardDescription className="text-xs">
                Receba uma notificação para completar sua missão
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={settings?.isEnabled ?? false}
            onCheckedChange={handleToggle}
            disabled={isUpdating || isBlocked}
          />
        </div>
      </CardHeader>

      {isBlocked && (
        <CardContent className="pt-0">
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <p className="font-medium">Notificações bloqueadas</p>
            <p className="text-xs mt-1">
              Acesse as configurações do seu navegador para permitir notificações deste site.
            </p>
          </div>
        </CardContent>
      )}

      {settings?.isEnabled && !isBlocked && (
        <CardContent className="pt-0 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário do lembrete
            </Label>
            <div className="flex flex-wrap gap-2">
              {REMINDER_TIMES.map((time) => (
                <Button
                  key={time.value}
                  variant={settings.reminderTime === time.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeChange(time.value)}
                  disabled={isUpdating}
                  className={cn(
                    'min-w-[60px]',
                    settings.reminderTime === time.value && 'ring-2 ring-primary/30'
                  )}
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>

          {notificationPermission === 'granted' && (
            <Button
              variant="outline"
              size="sm"
              onClick={testNotification}
              className="w-full"
            >
              <TestTube2 className="w-4 h-4 mr-2" />
              Testar Notificação
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
