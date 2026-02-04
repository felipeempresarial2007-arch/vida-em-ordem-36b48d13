import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClaimInvite } from '@/hooks/useAmbassadorInvites';
import { Ticket, Loader2, Gift, ArrowRight } from 'lucide-react';

interface ClaimInviteCardProps {
  onSuccess?: () => void;
}

export default function ClaimInviteCard({ onSuccess }: ClaimInviteCardProps) {
  const { claimInvite, isLoading } = useClaimInvite();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const success = await claimInvite(code);
    if (success) {
      setCode('');
      onSuccess?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Tornar-se Embaixador
          </CardTitle>
          <CardDescription>
            Recebeu um código de convite? Insira abaixo para ativar sua conta de embaixador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="INV-XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="pl-10 font-mono tracking-wider uppercase"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !code.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Ativar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
