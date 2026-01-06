import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MissionTemplate, STAGE_INFO } from '@/lib/missions';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  mission: MissionTemplate;
  checklist: boolean[];
  reflection: string;
  onChecklistChange: (index: number, checked: boolean) => void;
  onReflectionChange: (value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export default function MissionCard({
  mission,
  checklist,
  reflection,
  onChecklistChange,
  onReflectionChange,
  onComplete,
  isCompleted,
}: MissionCardProps) {
  const [showReflection, setShowReflection] = useState(false);
  const stageInfo = STAGE_INFO[mission.stage];
  const allChecked = checklist.every(Boolean);
  const canComplete = allChecked && reflection.trim().length > 0;

  if (isCompleted) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up">
        <div className="flex items-center gap-3 text-secondary">
          <CheckCircle2 className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Missão Completa!</h3>
            <p className="text-muted-foreground text-sm">Você concluiu a missão de hoje.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className={cn('p-6', stageInfo.gradient)}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">
              {stageInfo.name} · Dia {mission.day}
            </span>
            <h2 className="text-2xl font-bold text-primary-foreground mt-1">
              {mission.title}
            </h2>
          </div>
          <Sparkles className="w-6 h-6 text-primary-foreground/80" />
        </div>
        <p className="text-primary-foreground/90 mt-2 text-sm">
          {mission.description}
        </p>
      </div>

      {/* Checklist */}
      <div className="p-6 space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Circle className="w-4 h-4 text-muted-foreground" />
          Checklist de Execução
        </h4>
        <div className="space-y-2">
          {mission.checklist.map((item, index) => (
            <label
              key={index}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all',
                checklist[index] 
                  ? 'bg-secondary/10 border border-secondary/30' 
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              <Checkbox
                checked={checklist[index]}
                onCheckedChange={(checked) => onChecklistChange(index, checked as boolean)}
                className="mt-0.5"
              />
              <span className={cn(
                'text-sm',
                checklist[index] && 'line-through text-muted-foreground'
              )}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reflection Section */}
      {allChecked && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="p-4 bg-muted rounded-xl">
            <h4 className="font-semibold text-foreground mb-2">
              Reflexão do Dia
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Como foi realizar esta missão? O que você aprendeu?
            </p>
            <Textarea
              placeholder="Escreva sua reflexão aqui..."
              value={reflection}
              onChange={(e) => onReflectionChange(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="p-6 pt-0">
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          disabled={!canComplete}
          onClick={onComplete}
        >
          Concluir Missão
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        {!allChecked && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Complete todos os itens do checklist para prosseguir
          </p>
        )}
        {allChecked && !reflection.trim() && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Escreva sua reflexão para concluir
          </p>
        )}
      </div>
    </div>
  );
}
