import { ReminderSettings } from '@/components/reminders/ReminderSettings';
import ClaimInviteCard from '@/components/ambassador/ClaimInviteCard';
import { Bell, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const navigate = useNavigate();
  const { isAmbassador } = useAuth();

  const handleInviteClaimed = () => {
    // Refresh page to update auth context with new ambassador status
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground">Personalize sua experiência</p>
        </div>
      </div>

      {/* Ambassador Invite Section - only show if not already an ambassador */}
      {!isAmbassador && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Embaixador</span>
          </div>
          <ClaimInviteCard onSuccess={handleInviteClaimed} />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Bell className="w-4 h-4" />
          <span>Notificações</span>
        </div>
        <ReminderSettings />
      </section>
    </div>
  );
}
