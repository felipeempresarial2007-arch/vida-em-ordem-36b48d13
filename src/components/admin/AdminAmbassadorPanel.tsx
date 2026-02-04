import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAdminAmbassadors, AdminAmbassador } from '@/hooks/useAdminAmbassadors';
import { toast } from 'sonner';
import { 
  Plus, 
  Loader2, 
  Users, 
  DollarSign, 
  MousePointerClick,
  Shield,
  ShieldOff,
  ShieldX,
  Gift,
  Check,
  AlertCircle,
  Copy,
  RefreshCw,
  Trophy
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';

export default function AdminAmbassadorPanel() {
  const { 
    ambassadors, 
    isLoading, 
    isAdmin, 
    createAmbassadorByUserId,
    updateAmbassadorStatus,
    markBonusPaid,
    refresh 
  } = useAdminAmbassadors();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newCommissionRate, setNewCommissionRate] = useState('20');
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta área.
        </p>
      </div>
    );
  }

  const handleCreateAmbassador = async () => {
    if (!newUserId.trim()) {
      toast.error('Informe o User ID');
      return;
    }

    setIsCreating(true);
    const success = await createAmbassadorByUserId(
      newUserId.trim(), 
      parseFloat(newCommissionRate) || 20
    );
    setIsCreating(false);

    if (success) {
      setShowAddDialog(false);
      setNewUserId('');
      setNewCommissionRate('20');
    }
  };

  const copyReferralLink = async (code: string) => {
    try {
      const link = `${window.location.origin}?ref=${code}`;
      await navigator.clipboard.writeText(link);
      toast.success('Link copiado!');
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-yellow-500 text-black">Suspenso</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Stats totais
  const totalClicks = ambassadors.reduce((sum, a) => sum + a.stats.totalClicks, 0);
  const totalActiveCustomers = ambassadors.reduce((sum, a) => sum + a.stats.activeCustomers, 0);
  const totalRevenue = ambassadors.reduce((sum, a) => sum + a.stats.totalRevenue, 0);
  const totalCommission = ambassadors.reduce((sum, a) => sum + a.stats.totalCommission, 0);
  const bonusEligibleCount = ambassadors.filter(a => a.stats.bonusEligible).length;

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Embaixadores</h1>
          <p className="text-muted-foreground">
            {ambassadors.length} embaixador{ambassadors.length !== 1 ? 'es' : ''} cadastrado{ambassadors.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={refresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Embaixador
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ambassadors.length}</p>
                <p className="text-xs text-muted-foreground">Embaixadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClicks}</p>
                <p className="text-xs text-muted-foreground">Cliques Totais</p>
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
                <p className="text-2xl font-bold">{totalActiveCustomers}</p>
                <p className="text-xs text-muted-foreground">Clientes Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Receita Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bonusEligibleCount}</p>
                <p className="text-xs text-muted-foreground">Bônus Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ambassadors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Embaixadores</CardTitle>
          <CardDescription>
            Gerencie todos os embaixadores e suas métricas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ambassadors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum embaixador cadastrado ainda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cliques</TableHead>
                  <TableHead className="text-right">Ativos</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead className="text-center">Bônus</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambassadors.map((ambassador) => (
                  <TableRow key={ambassador.id}>
                    <TableCell className="font-medium">
                      {ambassador.userName || 'Sem nome'}
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {ambassador.userId.substring(0, 8)}...
                      </p>
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => copyReferralLink(ambassador.referralCode)}
                        className="font-mono text-sm flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {ambassador.referralCode}
                        <Copy className="w-3 h-3" />
                      </button>
                    </TableCell>
                    <TableCell>{getStatusBadge(ambassador.status)}</TableCell>
                    <TableCell className="text-right">{ambassador.stats.totalClicks}</TableCell>
                    <TableCell className="text-right">{ambassador.stats.activeCustomers}</TableCell>
                    <TableCell className="text-right">R$ {ambassador.stats.totalRevenue.toFixed(0)}</TableCell>
                    <TableCell className="text-right">R$ {ambassador.stats.totalCommission.toFixed(0)}</TableCell>
                    <TableCell className="text-center">
                      {ambassador.bonusPaidAt ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Pago
                        </Badge>
                      ) : ambassador.stats.bonusEligible ? (
                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                          <Gift className="w-3 h-3 mr-1" />
                          Pendente
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {ambassador.stats.activeCustomers}/10
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => copyReferralLink(ambassador.referralCode)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          
                          {ambassador.status !== 'active' && (
                            <DropdownMenuItem 
                              onClick={() => updateAmbassadorStatus(ambassador.id, 'active')}
                            >
                              <Shield className="w-4 h-4 mr-2 text-green-500" />
                              Ativar
                            </DropdownMenuItem>
                          )}
                          
                          {ambassador.status !== 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => updateAmbassadorStatus(ambassador.id, 'suspended')}
                            >
                              <ShieldOff className="w-4 h-4 mr-2 text-yellow-500" />
                              Suspender
                            </DropdownMenuItem>
                          )}
                          
                          {ambassador.status !== 'blocked' && (
                            <DropdownMenuItem 
                              onClick={() => updateAmbassadorStatus(ambassador.id, 'blocked')}
                              className="text-destructive"
                            >
                              <ShieldX className="w-4 h-4 mr-2" />
                              Bloquear
                            </DropdownMenuItem>
                          )}
                          
                          {ambassador.stats.bonusEligible && !ambassador.bonusPaidAt && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => markBonusPaid(ambassador.id)}
                              >
                                <Gift className="w-4 h-4 mr-2 text-green-500" />
                                Marcar Bônus Pago
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Ambassador Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Embaixador</DialogTitle>
            <DialogDescription>
              Adicione um usuário existente como embaixador por convite.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User ID</label>
              <Input
                placeholder="UUID do usuário (ex: abc123-def456...)"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Encontre o User ID no painel do backend → Tabela profiles
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Comissão (%)</label>
              <Input
                type="number"
                placeholder="20"
                value={newCommissionRate}
                onChange={(e) => setNewCommissionRate(e.target.value)}
                min="0"
                max="100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAmbassador} disabled={isCreating}>
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Criar Embaixador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
