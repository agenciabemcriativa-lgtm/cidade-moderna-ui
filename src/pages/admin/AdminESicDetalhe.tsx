import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, ArrowLeft, Send, 
  User, Mail, Phone, Calendar, MessageSquare, History
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useSolicitacaoById, 
  useRespostasBySolicitacao,
  useRecursosBySolicitacao,
  useResponderSolicitacao,
  useUpdateSolicitacaoStatus,
  statusLabels, 
  statusColors,
  tipoRespostaLabels,
  type TipoRespostaESic,
  type StatusESic
} from '@/hooks/useESic';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function AdminESicDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: solicitacao, isLoading } = useSolicitacaoById(id);
  const { data: respostas } = useRespostasBySolicitacao(id);
  const { data: recursos } = useRecursosBySolicitacao(id);

  const responderMutation = useResponderSolicitacao();
  const updateStatusMutation = useUpdateSolicitacaoStatus();

  const [respostaForm, setRespostaForm] = useState({
    tipo: '' as TipoRespostaESic | '',
    conteudo: '',
    fundamentacao_legal: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleResponder = async () => {
    if (!id || !respostaForm.tipo || !respostaForm.conteudo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await responderMutation.mutateAsync({
        solicitacaoId: id,
        tipo: respostaForm.tipo as TipoRespostaESic,
        conteudo: respostaForm.conteudo,
        fundamentacao_legal: respostaForm.fundamentacao_legal || undefined,
      });

      setDialogOpen(false);
      setRespostaForm({ tipo: '', conteudo: '', fundamentacao_legal: '' });
    } catch (error) {
      console.error('Erro ao responder:', error);
    }
  };

  const handleUpdateStatus = async (status: StatusESic) => {
    if (!id) return;
    
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const calcularDiasRestantes = (dataLimite: string, dataProrrogacao?: string) => {
    const limite = new Date(dataProrrogacao || dataLimite);
    const hoje = new Date();
    const diffTime = limite.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!solicitacao) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Solicitação não encontrada</h2>
          <Button onClick={() => navigate('/admin/esic')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const diasRestantes = calcularDiasRestantes(solicitacao.data_limite, solicitacao.data_prorrogacao || undefined);
  const isPendente = solicitacao.status === 'pendente' || solicitacao.status === 'em_andamento';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/esic')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-mono">{solicitacao.protocolo}</h1>
              <p className="text-muted-foreground">
                Registrado em {format(new Date(solicitacao.data_solicitacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${statusColors[solicitacao.status]} border text-sm px-3 py-1`}>
              {statusLabels[solicitacao.status]}
            </Badge>
          </div>
        </div>

        {/* Alerta de Prazo */}
        {isPendente && diasRestantes <= 5 && (
          <div className={`p-4 rounded-lg border ${
            diasRestantes < 0 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-orange-50 border-orange-200 text-orange-800'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {diasRestantes < 0 
                  ? `Esta solicitação está atrasada há ${Math.abs(diasRestantes)} dias!`
                  : `Atenção: Restam apenas ${diasRestantes} dias para responder.`
                }
              </span>
            </div>
          </div>
        )}

        <Tabs defaultValue="detalhes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="respostas">
              Respostas ({respostas?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="recursos">
              Recursos ({recursos?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Aba Detalhes */}
          <TabsContent value="detalhes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dados do Solicitante */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dados do Solicitante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{solicitacao.solicitante_nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{solicitacao.solicitante_email}</p>
                  </div>
                  {solicitacao.solicitante_telefone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{solicitacao.solicitante_telefone}</p>
                    </div>
                  )}
                  {solicitacao.solicitante_documento && (
                    <div>
                      <p className="text-sm text-muted-foreground">Documento</p>
                      <p className="font-medium">{solicitacao.solicitante_documento}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prazos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Prazos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                    <p className="font-medium">
                      {format(new Date(solicitacao.data_solicitacao), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo Limite</p>
                    <p className="font-medium">
                      {format(new Date(solicitacao.data_limite), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  {solicitacao.data_prorrogacao && (
                    <div>
                      <p className="text-sm text-muted-foreground">Prazo Prorrogado</p>
                      <p className="font-medium text-orange-600">
                        {format(new Date(solicitacao.data_prorrogacao), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {solicitacao.data_resposta && (
                    <div>
                      <p className="text-sm text-muted-foreground">Data da Resposta</p>
                      <p className="font-medium text-green-600">
                        {format(new Date(solicitacao.data_resposta), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ações */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isPendente && (
                    <>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full gap-2">
                            <Send className="w-4 h-4" />
                            Responder
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Responder Solicitação</DialogTitle>
                            <DialogDescription>
                              Protocolo: {solicitacao.protocolo}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Tipo de Resposta *</Label>
                              <Select
                                value={respostaForm.tipo}
                                onValueChange={(v) => setRespostaForm(prev => ({ ...prev, tipo: v as TipoRespostaESic }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="deferido">Deferido - Informação Concedida</SelectItem>
                                  <SelectItem value="deferido_parcial">Parcialmente Deferido</SelectItem>
                                  <SelectItem value="indeferido">Indeferido - Acesso Negado</SelectItem>
                                  <SelectItem value="nao_possui">Órgão Não Possui a Informação</SelectItem>
                                  <SelectItem value="encaminhado">Encaminhado a Outro Órgão</SelectItem>
                                  <SelectItem value="prorrogacao">Solicitar Prorrogação de Prazo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Conteúdo da Resposta *</Label>
                              <Textarea
                                value={respostaForm.conteudo}
                                onChange={(e) => setRespostaForm(prev => ({ ...prev, conteudo: e.target.value }))}
                                placeholder="Digite a resposta ao cidadão..."
                                rows={6}
                              />
                            </div>

                            {(respostaForm.tipo === 'indeferido' || respostaForm.tipo === 'prorrogacao') && (
                              <div className="space-y-2">
                                <Label>Fundamentação Legal</Label>
                                <Textarea
                                  value={respostaForm.fundamentacao_legal}
                                  onChange={(e) => setRespostaForm(prev => ({ ...prev, fundamentacao_legal: e.target.value }))}
                                  placeholder="Cite a base legal para a negativa ou prorrogação..."
                                  rows={3}
                                />
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button 
                              onClick={handleResponder} 
                              disabled={responderMutation.isPending}
                            >
                              {responderMutation.isPending ? 'Enviando...' : 'Enviar Resposta'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {solicitacao.status === 'pendente' && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleUpdateStatus('em_andamento')}
                        >
                          Marcar como Em Andamento
                        </Button>
                      )}
                    </>
                  )}

                  {solicitacao.status === 'respondida' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUpdateStatus('arquivada')}
                    >
                      Arquivar Solicitação
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo da Solicitação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Solicitação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Assunto</p>
                  <p className="font-semibold text-lg">{solicitacao.assunto}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descrição da Solicitação</p>
                  <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                    {solicitacao.descricao}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forma de Recebimento</p>
                  <p className="font-medium capitalize">{solicitacao.forma_recebimento}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Respostas */}
          <TabsContent value="respostas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Histórico de Respostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {respostas && respostas.length > 0 ? (
                  <div className="space-y-4">
                    {respostas.map((resposta) => (
                      <div key={resposta.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge>{tipoRespostaLabels[resposta.tipo]}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(resposta.data_resposta), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">{resposta.conteudo}</div>
                        {resposta.fundamentacao_legal && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-1">Fundamentação Legal:</p>
                            <p className="text-sm">{resposta.fundamentacao_legal}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma resposta registrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Recursos */}
          <TabsContent value="recursos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recursos Interpostos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recursos && recursos.length > 0 ? (
                  <div className="space-y-4">
                    {recursos.map((recurso) => (
                      <div key={recurso.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {recurso.instancia === 'primeira' ? '1ª Instância' : 
                             recurso.instancia === 'segunda' ? '2ª Instância' : '3ª Instância'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(recurso.data_recurso), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Motivo do Recurso:</p>
                          <p className="whitespace-pre-wrap">{recurso.motivo}</p>
                        </div>
                        {recurso.decisao ? (
                          <div className="pt-2 border-t">
                            <p className="font-medium">Decisão: {recurso.decisao}</p>
                            {recurso.fundamentacao && (
                              <p className="text-sm text-muted-foreground mt-1">{recurso.fundamentacao}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-orange-600">Aguardando decisão</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum recurso registrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
