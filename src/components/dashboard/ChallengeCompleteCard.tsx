import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  ArrowRight, 
  Award,
  CheckCircle2,
  Home,
  Wallet,
  Clock,
  Flag
} from 'lucide-react';

interface ChallengeCompleteCardProps {
  completedAt: string;
}

const pillars = [
  { icon: Home, name: 'Ambiente', color: 'bg-orange-500' },
  { icon: Wallet, name: 'Finanças', color: 'bg-amber-500' },
  { icon: Clock, name: 'Rotina', color: 'bg-rose-500' },
  { icon: Flag, name: 'Metas', color: 'bg-violet-500' },
];

export function ChallengeCompleteCard({ completedAt }: ChallengeCompleteCardProps) {
  const completedDate = new Date(completedAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
        <CardContent className="p-6">
          {/* Header with Trophy */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Trophy className="w-8 h-8 text-secondary" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-secondary" />
                <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                  Conquista desbloqueada
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Desafio Completo
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Concluído em {completedDate}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-background/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-foreground">30</p>
              <p className="text-xs text-muted-foreground mt-1">Missões Completadas</p>
            </div>
            <div className="bg-background/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground mt-1">Pilares Dominados</p>
            </div>
          </div>

          {/* Pillars Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, type: 'spring' }}
                  className={`w-10 h-10 rounded-xl ${pillar.color} flex items-center justify-center`}
                  title={pillar.name}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
            </motion.div>
          </div>

          {/* Message */}
          <div className="bg-background/50 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-foreground leading-relaxed">
              Você completou os 30 dias com sucesso! Agora é hora de manter 
              os hábitos que construiu. Continue sua jornada na aba <strong>Continuação</strong>.
            </p>
          </div>

          {/* CTA Button */}
          <Link to="/continuacao">
            <Button className="w-full" size="lg">
              Continuar Evoluindo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
