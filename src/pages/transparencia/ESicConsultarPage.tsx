import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, FileText, Clock, CheckCircle, AlertTriangle, MessageSquare, ArrowRight, ExternalLink, Calendar, User, Mail } from 'lucide-react';
import { TopBar } from '@/components/portal/TopBar';
import { Header } from '@/components/portal/Header';
import { Footer } from '@/components/portal/Footer';
import { Breadcrumbs } from '@/components/portal/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const breadcrumbItems = [
  { label: "Transparência", href: "/transparencia" },
  { label: "e-SIC", href: "/transparencia/esic" },
  { label: "Consultar Solicitação" },
];

import { 
  useSolicitacaoByProtocolo, 
  useRespostasBySolicitacao, 
  useRecursosBySolicitacao,
  statusLabels, 
  statusColors,
  tipoRespostaLabels,
  type ESicSolicitacao
} from '@/hooks/useESic';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ESicConsultarPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [protocolo, setProtocolo] = useState(searchParams.get('protocolo') || '');
  const [searchProtocolo, setSearchProtocolo] = useState(searchParams.get('protocolo') || '');

  const { data: solicitacao, isLoading, error, refetch } = useSolicitacaoByProtocolo(searchProtocolo);
  const { data: respostas } = useRespostasBySolicitacao(solicitacao?.id);
  const { data: recursos } = useRecursosBySolicitacao(solicitacao?.id);

  useEffect(() => {
    const protocoloParam = searchParams.get('protocolo');
    if (protocoloParam) {
      setProtocolo(protocoloParam);
      setSearchProtocolo(protocoloParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (protocolo.trim()) {
      setSearchProtocolo(protocolo.trim().toUpperCase());
      navigate(`/transparencia/esic/consultar?protocolo=${protocolo.trim().toUpperCase()}`);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const calcularDiasRestantes = (dataLimite: string, dataProrrogacao?: string) => {
    const limite = new Date(dataProrrogacao || dataLimite);
    const hoje = new Date();
    const diffTime = limite.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderTimeline = (sol: ESicSolicitacao) => {
    const events = [
      { date: sol.data_solicitacao, label: 'Solicitação registrada', icon: FileText, color: 'text-primary' },
    ];

    if (sol.data_prorrogacao) {
      events.push({ date: sol.data_prorrogacao, label: 'Prazo prorrogado', icon: Clock, color: 'text-orange-500' });
    }

    if (sol.data_resposta) {
      events.push({ date: sol.data_resposta, label: 'Resposta enviada', icon: CheckCircle, color: 'text-green-500' });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary-foreground/20 rounded-lg">
                <Search className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  Consultar Solicitação
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Acompanhe o andamento da sua solicitação de informação
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Formulário de Busca */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Consultar por Protocolo
                </CardTitle>
                <CardDescription>
                  Digite o número do protocolo para consultar o andamento da sua solicitação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="protocolo">Número do Protocolo</Label>
                    <Input
                      id="protocolo"
                      value={protocolo}
                      onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
                      placeholder="Ex: ESIC-2025-000001"
                      className="uppercase"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="gap-2">
                      <Search className="w-4 h-4" />
                      Consultar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Resultado da Busca */}
            {isLoading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Buscando solicitação...</p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Erro ao buscar solicitação. Tente novamente.
                </AlertDescription>
              </Alert>
            )}

            {searchProtocolo && !isLoading && !solicitacao && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="py-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Solicitação não encontrada</h3>
                  <p className="text-yellow-700">
                    Não foi encontrada nenhuma solicitação com o protocolo <strong>{searchProtocolo}</strong>.
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    Verifique se o número está correto e tente novamente.
                  </p>
                </CardContent>
              </Card>
            )}

            {solicitacao && (
              <>
                {/* Dados da Solicitação */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Protocolo: {solicitacao.protocolo}
                        </CardTitle>
                        <CardDescription>
                          Registrado em {formatDate(solicitacao.data_solicitacao)}
                        </CardDescription>
                      </div>
                      <Badge className={`${statusColors[solicitacao.status]} border`}>
                        {statusLabels[solicitacao.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Prazo */}
                    {solicitacao.status !== 'respondida' && solicitacao.status !== 'arquivada' && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Prazo para Resposta</p>
                            <p className="text-sm text-muted-foreground">
                              Até {format(new Date(solicitacao.data_prorrogacao || solicitacao.data_limite), 'dd/MM/yyyy', { locale: ptBR })}
                              {solicitacao.data_prorrogacao && ' (prorrogado)'}
                            </p>
                          </div>
                          <div className="text-right">
                            {(() => {
                              const dias = calcularDiasRestantes(solicitacao.data_limite, solicitacao.data_prorrogacao || undefined);
                              if (dias < 0) {
                                return <Badge variant="destructive">Atrasado</Badge>;
                              } else if (dias <= 5) {
                                return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{dias} dias restantes</Badge>;
                              } else {
                                return <Badge className="bg-green-100 text-green-800 border-green-200">{dias} dias restantes</Badge>;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Dados do Solicitante */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Solicitante</p>
                          <p className="font-medium">{solicitacao.solicitante_nome}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">E-mail</p>
                          <p className="font-medium">{solicitacao.solicitante_email}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Assunto e Descrição */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Assunto</p>
                        <p className="font-medium">{solicitacao.assunto}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Descrição da Solicitação</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{solicitacao.descricao}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">Histórico</h4>
                      <div className="space-y-4">
                        {renderTimeline(solicitacao).map((event, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted ${event.color}`}>
                              <event.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{event.label}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Respostas */}
                {respostas && respostas.length > 0 && (
                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <MessageSquare className="w-5 h-5" />
                        Respostas ({respostas.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {respostas.map((resposta, index) => (
                          <AccordionItem key={resposta.id} value={`resposta-${index}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-2 text-left">
                                <Badge variant="outline" className="text-green-700">
                                  {tipoRespostaLabels[resposta.tipo]}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(resposta.data_resposta)}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="bg-white p-4 rounded-lg border mt-2 space-y-4">
                                <div>
                                  <p className="font-medium mb-2">Resposta:</p>
                                  <p className="text-muted-foreground whitespace-pre-wrap">{resposta.conteudo}</p>
                                </div>
                                {resposta.fundamentacao_legal && (
                                  <div>
                                    <p className="font-medium mb-2">Fundamentação Legal:</p>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{resposta.fundamentacao_legal}</p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}

                {/* Recursos */}
                {recursos && recursos.length > 0 && (
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-800">
                        <AlertTriangle className="w-5 h-5" />
                        Recursos ({recursos.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recursos.map((recurso) => (
                          <div key={recurso.id} className="bg-white p-4 rounded-lg border space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-purple-700">
                                {recurso.instancia === 'primeira' ? '1ª Instância' : 
                                 recurso.instancia === 'segunda' ? '2ª Instância' : '3ª Instância'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(recurso.data_recurso)}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{recurso.motivo}</p>
                            {recurso.decisao && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="font-medium">Decisão: {recurso.decisao}</p>
                                {recurso.fundamentacao && (
                                  <p className="text-sm text-muted-foreground mt-1">{recurso.fundamentacao}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {(solicitacao.status === 'respondida' || solicitacao.status === 'prorrogada') && (
                    <Link to={`/transparencia/esic/recurso/${solicitacao.id}`}>
                      <Button variant="outline" className="gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Interpor Recurso
                      </Button>
                    </Link>
                  )}
                  <Link to="/transparencia/esic/nova-solicitacao">
                    <Button variant="outline" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Nova Solicitação
                    </Button>
                  </Link>
                  <Link to="/transparencia/esic">
                    <Button variant="ghost" className="gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Voltar ao e-SIC
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
