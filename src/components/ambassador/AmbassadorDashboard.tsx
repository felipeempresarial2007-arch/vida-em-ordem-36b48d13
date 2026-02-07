import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAmbassador } from '@/hooks/useAmbassador';
import { toast } from 'sonner';
import { 
  Copy, 
  Check, 
  Link2, 
  MousePointerClick, 
  Users, 
  DollarSign, 
  TrendingUp,
  Gift,
  Trophy,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';

export default function AmbassadorDashboard() {
  const { ambassador, stats, isLoading, isAmbassador, acceptTerms, getReferralLink } = useAmbassador();
  const [copied, setCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAmbassador || !ambassador) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Área Restrita</h2>
        <p className="text-muted-foreground">
          Você não é um embaixador. Este programa é apenas por convite.
        </p>
      </div>
    );
  }

  // Verificar se precisa aceitar os termos
  if (!ambassador.termsAcceptedAt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <FileText className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Bem-vindo ao Programa de Embaixadores!</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Para começar, você precisa aceitar os termos do programa.
        </p>
        <Button onClick={() => setShowTerms(true)}>
          Ver Termos do Programa
        </Button>

        <Dialog open={showTerms} onOpenChange={setShowTerms}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Termos do Programa de Embaixadores</DialogTitle>
              <DialogDescription>
                Leia atentamente os termos abaixo antes de aceitar
              </DialogDescription>
            </DialogHeader>
            
            <div className="prose prose-sm dark:prose-invert">
              <h4>1. Elegibilidade</h4>
              <p>O programa é exclusivo para convidados. Não é permitido autocadastro ou autoindicação.</p>
              
              <h4>2. Comissões</h4>
              <p>Você receberá comissão sobre cada assinatura ativa gerada através do seu link. A comissão é recorrente enquanto o cliente mantiver a assinatura ativa.</p>
              
              <h4>3. Cliente Válido</h4>
              <p>Considera-se cliente válido aquele que possui assinatura paga ativa, fora do período de trial e sem chargeback pendente.</p>
              
              <h4>4. Bônus de Performance</h4>
              <p>Ao atingir 10 clientes pagantes ativos, você receberá um bônus de R$ 50,00 via Pix.</p>
              
              <h4>5. Conduta</h4>
              <p>É proibido spam, publicidade enganosa ou qualquer prática que prejudique a imagem do FOCUS 30. Violações podem resultar em suspensão ou bloqueio.</p>
              
              <h4>6. Cancelamento</h4>
              <p>Quando um cliente cancela a assinatura, as comissões referentes a esse cliente são encerradas.</p>
              
              <h4>7. Pagamentos</h4>
              <p>Comissões são pagas mensalmente via Pix após atingir o mínimo de R$ 50,00 acumulados.</p>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <Checkbox 
                id="accept-terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="accept-terms" className="text-sm cursor-pointer">
                Li e aceito os termos do programa de embaixadores
              </label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTerms(false)}>
                Cancelar
              </Button>
              <Button 
                disabled={!termsAccepted || isAccepting}
                onClick={async () => {
                  setIsAccepting(true);
                  const success = await acceptTerms();
                  setIsAccepting(false);
                  if (success) {
                    setShowTerms(false);
                    toast.success('Termos aceitos! Bem-vindo ao programa.');
                  } else {
                    toast.error('Erro ao aceitar termos');
                  }
                }}
              >
                {isAccepting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Aceitar e Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (ambassador.status === 'blocked') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Conta Bloqueada</h2>
        <p className="text-muted-foreground">
          Sua conta de embaixador foi bloqueada. Entre em contato para mais informações.
        </p>
      </div>
    );
  }

  if (ambassador.status === 'suspended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Conta Suspensa</h2>
        <p className="text-muted-foreground">
          Sua conta de embaixador está temporariamente suspensa.
        </p>
      </div>
    );
  }

  const referralLink = getReferralLink();
  const bonusProgress = stats?.bonusProgress || 0;
  const bonusPercentage = (bonusProgress / 10) * 100;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Painel do Embaixador</h1>
        <p className="text-muted-foreground">
          Código: <span className="font-mono font-semibold text-primary">{ambassador.referralCode}</span>
        </p>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link2 className="w-5 h-5 text-primary" />
            Seu Link de Indicação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="bg-background/80 font-mono text-sm"
            />
            <Button onClick={handleCopyLink} variant="secondary" size="icon">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalClicks || 0}</p>
                <p className="text-xs text-muted-foreground">Cliques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.activeCustomers || 0}</p>
                <p className="text-xs text-muted-foreground">Clientes Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  R$ {(stats?.totalRevenue || 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Receita Gerada</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  R$ {(stats?.totalCommission || 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Comissão Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bonus Progress Card */}
      <Card className={stats?.bonusEligible ? 'border-secondary bg-secondary/5' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {stats?.bonusEligible ? (
              <Trophy className="w-5 h-5 text-secondary" />
            ) : (
              <Gift className="w-5 h-5 text-primary" />
            )}
            Meta de Bônus
          </CardTitle>
          <CardDescription>
            {stats?.bonusEligible 
              ? 'Parabéns! Você atingiu a meta! Seu bônus de R$ 50 será pago via Pix.'
              : `Atinja 10 clientes pagantes ativos para ganhar R$ 50 de bônus.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{bonusProgress}/10 clientes ativos</span>
              <span className="text-muted-foreground">{bonusPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={bonusPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Commission Details - Only show non-sensitive data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Comissão Pendente</span>
            <span className="font-semibold text-orange-500">
              R$ {(stats?.pendingCommission || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Total de Clientes</span>
            <span className="font-semibold">{stats?.totalCustomers || 0}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
