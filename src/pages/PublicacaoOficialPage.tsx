import { Link, useParams } from "react-router-dom";
import { FileText, Calendar, Building2, Download, ArrowLeft, Scale, Info, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  usePublicacaoOficial,
  tipoLabels,
  situacaoLabels,
  situacaoColors,
} from "@/hooks/usePublicacoesOficiais";

export default function PublicacaoOficialPage() {
  const { id } = useParams<{ id: string }>();
  const { data: publicacao, isLoading, error } = usePublicacaoOficial(id || "");

  const breadcrumbItems = [
    { label: "Publicações Oficiais", href: "/publicacoes-oficiais" },
    { label: publicacao?.titulo || "Carregando..." },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !publicacao) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Publicação não encontrada</h2>
              <p className="text-muted-foreground mb-6">
                A publicação solicitada não existe ou foi removida.
              </p>
              <Button asChild>
                <Link to="/publicacoes-oficiais">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às publicações
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} className="mb-6 text-white/80" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {tipoLabels[publicacao.tipo]}
                  </Badge>
                  <Badge className={`${situacaoColors[publicacao.situacao]} border-0`}>
                    {situacaoLabels[publicacao.situacao]}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {tipoLabels[publicacao.tipo]} Nº {publicacao.numero}/{publicacao.ano}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/publicacoes-oficiais">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às publicações
            </Link>
          </Button>

          {/* Revogado Alert */}
          {publicacao.situacao === 'revogado' && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>ATENÇÃO:</strong> Este ato normativo foi REVOGADO e não possui mais validade jurídica.
                Mantido disponível para fins de consulta histórica.
              </AlertDescription>
            </Alert>
          )}

          {/* Alterado Alert */}
          {publicacao.situacao === 'alterado' && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>ATENÇÃO:</strong> Este ato normativo foi ALTERADO por publicação posterior.
                Verifique as atualizações mais recentes.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{publicacao.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">EMENTA</h3>
                      <p className="text-foreground leading-relaxed">{publicacao.ementa}</p>
                    </div>

                    {publicacao.observacoes && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">OBSERVAÇÕES</h3>
                          <p className="text-foreground leading-relaxed">{publicacao.observacoes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Download Section */}
              {publicacao.texto_completo_url && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Texto Completo (PDF)</p>
                          <p className="text-sm text-muted-foreground">
                            Documento oficial para download
                          </p>
                        </div>
                      </div>
                      <Button asChild>
                        <a
                          href={publicacao.texto_completo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar PDF
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Publicação</p>
                      <p className="font-medium">
                        {format(new Date(publicacao.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {publicacao.secretaria_nome && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Órgão Emissor</p>
                        <p className="font-medium">{publicacao.secretaria_nome}</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <Badge variant="secondary">{tipoLabels[publicacao.tipo]}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Situação</p>
                    <Badge className={situacaoColors[publicacao.situacao]}>
                      {situacaoLabels[publicacao.situacao]}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Número/Ano</p>
                    <p className="font-medium">{publicacao.numero}/{publicacao.ano}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Disclaimer */}
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs text-muted-foreground">
                  Este espaço destina-se à publicação oficial de atos administrativos do Município, 
                  em atendimento aos princípios da publicidade e da Lei de Acesso à Informação.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
