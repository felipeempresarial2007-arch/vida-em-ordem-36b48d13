import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Check, X } from 'lucide-react';
import { STAGE_INFO } from '@/lib/missions';
import { toast } from 'sonner';

interface AchievementCardProps {
  dayNumber: number;
  stage: string;
  title: string;
  onDismiss: () => void;
}

const STAGE_PHRASES: Record<string, string[]> = {
  rotina: [
    'Consistência ativada.',
    'Hábito em construção.',
    'Um passo mais perto do equilíbrio.',
    'Rotina sob controle.',
  ],
  ambiente: [
    'Espaço limpo, mente clara.',
    'Ordem externa, paz interna.',
    'Ambiente transformado.',
    'Clareza começa no espaço.',
  ],
  financas: [
    'Finanças sob controle.',
    'Clareza financeira desbloqueada.',
    'Um passo para a liberdade.',
    'Controle financeiro ativado.',
  ],
  metas: [
    'Foco no que importa.',
    'Direção definida.',
    'Propósito em movimento.',
    'Visão clara, ação certa.',
  ],
};

function getPhrase(stage: string, day: number): string {
  const phrases = STAGE_PHRASES[stage] || STAGE_PHRASES.rotina;
  return phrases[day % phrases.length];
}

export function AchievementCard({ dayNumber, stage, title, onDismiss }: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);

  const phrase = getPhrase(stage, dayNumber);
  const stageInfo = STAGE_INFO[stage as keyof typeof STAGE_INFO];

  const shareText = `Dia ${dayNumber}/30: ${phrase} +1 passo no FOCUS 30.`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FOCUS 30 — Dia ${dayNumber}`,
          text: shareText,
          url: 'https://focus-30-app.lovable.app',
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(`${shareText}\nhttps://focus-30-app.lovable.app`);
    toast.success('Texto copiado para compartilhar');
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Card
          ref={cardRef}
          className="relative overflow-hidden border-border/60 bg-card"
        >
          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Subtle accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

          <div className="px-6 pt-6 pb-5">
            {/* Day badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{dayNumber}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Dia {dayNumber} de 30
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stageInfo?.name || stage}
                </p>
              </div>
            </div>

            {/* Main phrase */}
            <h3 className="text-xl font-bold text-foreground leading-snug mb-1.5">
              {phrase}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              +1 passo para a sua melhor versão
            </p>

            {/* Mission title */}
            <div className="mt-5 pt-4 border-t border-border/50">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Missão concluída
              </p>
              <p className="text-sm font-medium text-foreground">{title}</p>
            </div>
          </div>

          {/* Footer with branding + share */}
          <div className="px-6 pb-5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
              FOCUS 30
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 text-xs"
            >
              {shared ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
