import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Download, Check, X } from 'lucide-react';
import { STAGE_INFO } from '@/lib/missions';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';

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
  const [saving, setSaving] = useState(false);

  const phrase = getPhrase(stage, dayNumber);
  const stageInfo = STAGE_INFO[stage as keyof typeof STAGE_INFO];
  const progressPercent = Math.round((dayNumber / 30) * 100);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#1a1a1a',
      });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error('Falha ao gerar imagem');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focus30-dia-${dayNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Imagem salva');
    } catch {
      toast.error('Erro ao salvar imagem');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (blob && navigator.share && navigator.canShare) {
      const file = new File([blob], `focus30-dia-${dayNumber}.png`, { type: 'image/png' });
      const shareData = { files: [file], title: `FOCUS 30 — Dia ${dayNumber}` };
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          setShared(true);
          setTimeout(() => setShared(false), 2000);
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
        }
      }
    }
    // Fallback: copy text
    const shareText = `Dia ${dayNumber}/30: ${phrase} +1 passo no FOCUS 30.`;
    navigator.clipboard.writeText(`${shareText}\nhttps://focus-30-app.lovable.app`);
    toast.success('Texto copiado para compartilhar');
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 180, damping: 22 }}
        className="space-y-3"
      >
        {/* === Exportable Card (this is what becomes the image) === */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, hsl(24 85% 52% / 0.08) 0%, hsl(24 10% 8%) 40%, hsl(220 15% 10%) 100%)',
            padding: '2rem',
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, hsl(24 85% 52%) 0%, hsl(24 85% 52% / 0.3) 60%, transparent 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Day + Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(24 85% 52% / 0.12)' }}
                >
                  <span className="text-base font-bold" style={{ color: 'hsl(24 85% 58%)' }}>
                    {dayNumber}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'hsl(0 0% 55%)' }}>
                    Dia {dayNumber} de 30
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
                    {stageInfo?.name || stage}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold" style={{ color: 'hsl(24 85% 58%)' }}>
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-[3px] w-full rounded-full" style={{ background: 'hsl(0 0% 18%)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, hsl(24 85% 52%), hsl(24 90% 60%))',
                  }}
                />
              </div>
            </div>

            {/* Main phrase */}
            <h3
              className="text-xl font-bold leading-snug mb-1"
              style={{ color: 'hsl(0 0% 93%)' }}
            >
              {phrase}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
              +1 passo para a sua melhor versão
            </p>

            {/* Mission */}
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid hsl(0 0% 16%)' }}>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1.5"
                style={{ color: 'hsl(0 0% 45%)' }}
              >
                Missão concluída
              </p>
              <p className="text-sm font-medium" style={{ color: 'hsl(0 0% 80%)' }}>
                {title}
              </p>
            </div>

            {/* Footer branding */}
            <div className="mt-6 flex items-center justify-between">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.25em]"
                style={{ color: 'hsl(0 0% 30%)' }}
              >
                FOCUS 30
              </span>
              <span className="text-[9px]" style={{ color: 'hsl(0 0% 25%)' }}>
                focus-30-app.lovable.app
              </span>
            </div>
          </div>
        </div>

        {/* === Action buttons (outside the card, not exported) === */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {saving ? 'Salvando...' : 'Salvar imagem'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1 gap-2 text-xs"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="w-9 h-9 p-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
