import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  ArrowRight, 
  Target, 
  Calendar, 
  CheckCircle2,
  Sparkles,
  Home,
  Wallet,
  Clock,
  Flag
} from 'lucide-react';
import Logo from '@/components/Logo';

interface WelcomeWizardProps {
  open: boolean;
  onComplete: () => void;
  userName?: string;
}

const slides = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: 'Bem-vindo ao FOCUS 30!',
    description: 'Você está prestes a iniciar uma jornada de transformação de 30 dias.',
    highlight: 'Foco, disciplina e evolução diária.',
  },
  {
    id: 'challenge',
    icon: Calendar,
    title: 'O Desafio de 30 Dias',
    description: 'Uma missão por dia, cuidadosamente desenhada para construir hábitos duradouros.',
    highlight: 'Complete cada missão para desbloquear a próxima.',
  },
  {
    id: 'pillars',
    icon: Target,
    title: 'Os 4 Pilares',
    description: 'O desafio é dividido em 4 áreas fundamentais da sua vida:',
    pillars: [
      { icon: Home, name: 'Ambiente', days: 'Dias 1-7', color: 'bg-orange-500' },
      { icon: Wallet, name: 'Finanças', days: 'Dias 8-14', color: 'bg-amber-500' },
      { icon: Clock, name: 'Rotina', days: 'Dias 15-22', color: 'bg-rose-500' },
      { icon: Flag, name: 'Metas', days: 'Dias 23-30', color: 'bg-violet-500' },
    ],
  },
  {
    id: 'howto',
    icon: CheckCircle2,
    title: 'Como Funciona',
    description: 'Cada missão tem um checklist prático. Complete todas as tarefas e registre sua reflexão.',
    highlight: 'Reflexões diárias aceleram seu crescimento.',
  },
  {
    id: 'start',
    icon: ArrowRight,
    title: 'Pronto para Começar?',
    description: 'Sua primeira missão está esperando. Lembre-se: consistência é mais importante que perfeição.',
    highlight: 'Vamos lá! 🚀',
  },
];

export function WelcomeWizard({ open, onComplete, userName }: WelcomeWizardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md p-0 gap-0 overflow-hidden border-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative min-h-[480px] flex flex-col">
          {/* Progress Dots */}
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-6 bg-primary' 
                    : index < currentSlide 
                      ? 'w-1.5 bg-primary/50' 
                      : 'w-1.5 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 pt-12 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                {/* Logo on first slide */}
                {currentSlide === 0 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <Logo size="xl" variant="full" />
                  </motion.div>
                )}

                {/* Icon */}
                {currentSlide !== 0 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </motion.div>
                )}

                {/* Title with user name */}
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {currentSlide === 0 && userName 
                    ? `Bem-vindo, ${userName}!`
                    : slide.title
                  }
                </h2>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-xs">
                  {slide.description}
                </p>

                {/* Pillars Grid */}
                {slide.pillars && (
                  <div className="grid grid-cols-2 gap-3 w-full mt-2">
                    {slide.pillars.map((pillar) => {
                      const PillarIcon = pillar.icon;
                      return (
                        <motion.div
                          key={pillar.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                        >
                          <div className={`w-8 h-8 rounded-lg ${pillar.color} flex items-center justify-center`}>
                            <PillarIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{pillar.name}</p>
                            <p className="text-xs text-muted-foreground">{pillar.days}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Highlight */}
                {slide.highlight && !slide.pillars && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 px-4 py-2 bg-primary/10 rounded-full"
                  >
                    <span className="text-sm font-medium text-primary">
                      {slide.highlight}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="p-6 pt-0 flex gap-3">
            {currentSlide > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="flex-1"
            >
              {isLastSlide ? 'Começar Jornada' : 'Continuar'}
              {!isLastSlide && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
