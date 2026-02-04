import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAmbassadorInvites, AmbassadorInvite } from '@/hooks/useAmbassadorInvites';
import { toast } from 'sonner';
import { 
  Plus, 
  Loader2, 
  Copy, 
  Trash2, 
  Ticket,
  Check,
  Clock
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function InviteCodeManager() {
  const { invites, isLoading, createInvite, deleteInvite } = useAmbassadorInvites();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [commissionRate, setCommissionRate] = useState('20');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    const code = await createInvite(parseFloat(commissionRate) || 20, notes || undefined);
    setIsCreating(false);
    
    if (code) {
      setNewCode(code);
      setCommissionRate('20');
      setNotes('');
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Código copiado!');
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleDelete = async (invite: AmbassadorInvite) => {
    if (invite.usedAt) {
      toast.error('Não é possível excluir um convite já utilizado');
      return;
    }
    await deleteInvite(invite.id);
  };

  const pendingInvites = invites.filter(i => !i.usedAt);
  const usedInvites = invites.filter(i => i.usedAt);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Códigos de Convite
            </CardTitle>
            <CardDescription>
              Gere códigos para convidar novos embaixadores
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Gerar Código
          </Button>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum código de convite gerado ainda.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                Gerar primeiro código
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Invites */}
              {pendingInvites.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Pendentes ({pendingInvites.length})
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Comissão</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingInvites.map((invite) => (
                        <TableRow key={invite.id}>
                          <TableCell>
                            <button
                              onClick={() => copyCode(invite.code)}
                              className="font-mono text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors"
                            >
                              {invite.code}
                              <Copy className="w-3 h-3" />
                            </button>
                          </TableCell>
                          <TableCell>{invite.commissionRate}%</TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                            {invite.notes || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(invite.createdAt), "dd/MM/yy", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(invite)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Used Invites */}
              {usedInvites.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Utilizados ({usedInvites.length})
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Usado em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usedInvites.map((invite) => (
                        <TableRow key={invite.id} className="opacity-60">
                          <TableCell className="font-mono text-sm">
                            {invite.code}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Utilizado
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {invite.usedAt && format(new Date(invite.usedAt), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) setNewCode(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newCode ? 'Código Gerado!' : 'Gerar Código de Convite'}
            </DialogTitle>
            <DialogDescription>
              {newCode 
                ? 'Copie e envie este código para o influenciador.'
                : 'Configure as opções do convite para o novo embaixador.'
              }
            </DialogDescription>
          </DialogHeader>

          {newCode ? (
            <div className="py-6">
              <div className="bg-muted rounded-xl p-6 text-center">
                <p className="text-xs text-muted-foreground mb-2">Código de Convite</p>
                <button
                  onClick={() => copyCode(newCode)}
                  className="text-3xl font-mono font-bold tracking-wider hover:text-primary transition-colors flex items-center justify-center gap-3 mx-auto"
                >
                  {newCode}
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                O influenciador deve inserir este código em Configurações → Embaixador
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Taxa de Comissão (%)</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Input
                  placeholder="Ex: @influencer_instagram"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {newCode ? (
              <Button onClick={() => {
                setShowCreateDialog(false);
                setNewCode(null);
              }}>
                Fechar
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Gerar Código
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
