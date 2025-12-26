import { useParams, Link } from "react-router-dom";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Building2,
  FileText,
  ExternalLink,
  Download,
  AlertCircle,
  Clock,
  DollarSign,
  Hash,
  Gavel,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useLicitacao,
  modalidadeLabels,
  statusLabels,
  statusColors,
  tipoDocumentoLabels,
} from "@/hooks/useLicitacoes";

export default function LicitacaoPage() {
  const { id } = useParams<{ id: string }>();
  const { data: licitacao, isLoading, error } = useLicitacao(id || "");

  const formatCurrency = (value: number | null) => {
    if (!value) return "Não informado";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !licitacao) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <Link to="/licitacoes" className="inline-flex items-center text-primary hover:underline mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Licitações
            </Link>
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Licitação não encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  O processo solicitado não existe ou não está disponível.
                </p>
                <Button asChild>
                  <Link to="/licitacoes">Ver todas as licitações</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const documentosPorTipo = licitacao.documentos_licitacao?.reduce((acc, doc) => {
    if (!acc[doc.tipo]) acc[doc.tipo] = [];
    acc[doc.tipo].push(doc);
    return acc;
  }, {} as Record<string, typeof licitacao.documentos_licitacao>);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs 
              items={[
                { label: "Licitações", href: "/licitacoes" },
                { label: licitacao.numero_processo }
              ]} 
            />
          </div>
        </div>

        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={`${statusColors[licitacao.status]} text-white`}>
                {statusLabels[licitacao.status]}
              </Badge>
              <Badge variant="outline">
                {modalidadeLabels[licitacao.modalidade]}
              </Badge>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {licitacao.objeto}
            </h1>
            
            <p className="text-lg font-mono text-muted-foreground">
              Processo nº {licitacao.numero_processo}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    Informações do Processo
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Número do Processo</p>
                      <p className="font-medium">{licitacao.numero_processo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Modalidade</p>
                      <p className="font-medium">{modalidadeLabels[licitacao.modalidade]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Postagem</p>
                      <p className="font-medium">
                        {format(parseISO(licitacao.data_abertura), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {licitacao.data_abertura_processo && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Abertura</p>
                        <p className="font-medium">
                          {format(parseISO(licitacao.data_abertura_processo), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {licitacao.data_encerramento && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Encerramento</p>
                        <p className="font-medium">
                          {format(parseISO(licitacao.data_encerramento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Estimado</p>
                      <p className="font-medium">{formatCurrency(licitacao.valor_estimado)}</p>
                    </div>
                  </div>
                  
                  {licitacao.secretaria_nome && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Secretaria Demandante</p>
                        <p className="font-medium">{licitacao.secretaria_nome}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Objeto */}
              <Card>
                <CardHeader>
                  <CardTitle>Objeto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {licitacao.objeto}
                  </p>
                </CardContent>
              </Card>

              {/* Observações */}
              {licitacao.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {licitacao.observacoes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Documentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {licitacao.documentos_licitacao && licitacao.documentos_licitacao.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(documentosPorTipo || {}).map(([tipo, docs]) => (
                        <div key={tipo}>
                          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                            {tipoDocumentoLabels[tipo as keyof typeof tipoDocumentoLabels]}
                          </h4>
                          <div className="space-y-2">
                            {docs.map((doc) => (
                              <a
                                key={doc.id}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                  <div>
                                    <p className="font-medium group-hover:text-primary">{doc.titulo}</p>
                                    {doc.descricao && (
                                      <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      Publicado em {format(parseISO(doc.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                                    </p>
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum documento disponível no momento.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status do Processo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${statusColors[licitacao.status]} text-white text-base px-4 py-2`}>
                    {statusLabels[licitacao.status]}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3">
                    Última atualização: {format(new Date(licitacao.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>

              {/* Link Sistema Oficial */}
              {licitacao.link_sistema_oficial && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sistema Oficial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Acesse o sistema oficial para informações completas e atualizadas.
                    </p>
                    <Button asChild className="w-full">
                      <a
                        href={licitacao.link_sistema_oficial}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Acessar Sistema
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Legal Notice */}
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      As informações detalhadas dos processos licitatórios e financeiros são disponibilizadas 
                      por meio do sistema oficial de gestão utilizado pelo Município, alimentado pelos setores responsáveis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
