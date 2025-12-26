import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Landmark,
  Info,
  FileText,
  Download,
  ChevronRight,
  Calendar,
  CheckCircle2,
  History,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDocumentosLegislacao } from "@/hooks/useDocumentosLegislacao";
import { LastUpdated } from "@/components/portal/LastUpdated";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";

const breadcrumbItems = [
  { label: "Legislação", href: "/legislacao" },
  { label: "Lei Orgânica do Município" },
];

export default function LeiOrganicaPage() {
  const { data: leiOrganica, isLoading: loadingLei } = useDocumentosLegislacao({ 
    tipo: 'lei_organica',
    vigente: true 
  });
  
  const { data: emendas, isLoading: loadingEmendas } = useDocumentosLegislacao({ 
    tipo: 'emenda_lei_organica' 
  });

  const documentoVigente = leiOrganica?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Landmark className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Lei Orgânica do Município
                  </h1>
                  <p className="text-white/80 mt-1">
                    Constituição Municipal de Ipubi
                  </p>
                </div>
              </div>
              {(leiOrganica || emendas) && (
                <LastUpdated 
                  date={[...(leiOrganica || []), ...(emendas || [])].reduce((latest, d) => 
                    d.updated_at && new Date(d.updated_at) > new Date(latest || 0) ? d.updated_at : latest, 
                    leiOrganica?.[0]?.updated_at || emendas?.[0]?.updated_at
                  )}
                  className="text-white/80"
                />
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Aviso Legal */}
          <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Aviso Legal:</strong> Este espaço organiza e facilita o acesso à legislação municipal. 
              Os atos oficiais têm validade conforme publicação nos meios legais competentes.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sobre a Lei Orgânica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" />
                    O que é a Lei Orgânica?
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    A <strong>Lei Orgânica Municipal</strong> é a norma fundamental do Município, 
                    funcionando como uma "Constituição Municipal". Ela estabelece a estrutura e 
                    organização do governo local, definindo as competências dos Poderes Executivo 
                    e Legislativo, os direitos e deveres dos cidadãos, e os princípios que regem 
                    a administração pública municipal.
                  </p>
                  <p>
                    A Lei Orgânica do Município de Ipubi foi promulgada em conformidade com a 
                    Constituição Federal de 1988 e a Constituição do Estado de Pernambuco, 
                    respeitando os princípios da autonomia municipal e do interesse local.
                  </p>
                </CardContent>
              </Card>

              {/* Texto Integral */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Texto Integral Consolidado
                  </CardTitle>
                  <CardDescription>
                    Versão atualizada com todas as emendas incorporadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingLei ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : documentoVigente ? (
                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{documentoVigente.titulo}</h4>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Vigente
                            </Badge>
                          </div>
                          {documentoVigente.descricao && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {documentoVigente.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Publicação: {format(new Date(documentoVigente.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <a href={documentoVigente.arquivo_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="default" className="gap-2">
                            <Download className="h-4 w-4" />
                            Baixar PDF
                          </Button>
                        </a>
                        <Link to="/publicacoes-oficiais?search=lei%20orgânica">
                          <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Ver Publicação Oficial
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg border border-border text-center">
                      <p className="text-muted-foreground">
                        Documento ainda não cadastrado no sistema.
                      </p>
                      <Link to="/publicacoes-oficiais?search=lei%20orgânica" className="mt-2 inline-block">
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Buscar nas Publicações Oficiais
                        </Button>
                      </Link>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> O documento em PDF disponibilizado contém o texto consolidado 
                    da Lei Orgânica, com todas as emendas incorporadas ao texto original para facilitar 
                    a consulta. Para verificar as alterações específicas, consulte o histórico de emendas.
                  </p>
                </CardContent>
              </Card>

              {/* Estrutura da Lei */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Estrutura da Lei Orgânica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { titulo: "Título I", descricao: "Dos Princípios Fundamentais" },
                      { titulo: "Título II", descricao: "Da Organização dos Poderes" },
                      { titulo: "Título III", descricao: "Da Organização do Município" },
                      { titulo: "Título IV", descricao: "Da Administração Pública" },
                      { titulo: "Título V", descricao: "Das Finanças Municipais" },
                      { titulo: "Título VI", descricao: "Da Ordem Econômica e Social" },
                      { titulo: "Título VII", descricao: "Das Disposições Gerais e Transitórias" },
                    ].map((item) => (
                      <div key={item.titulo} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium text-foreground">{item.titulo}</span>
                          <span className="text-muted-foreground"> - {item.descricao}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informações */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documentoVigente ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Data de Publicação</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(documentoVigente.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Situação</p>
                          <p className="text-sm text-muted-foreground">Vigente</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Informações disponíveis após cadastro do documento.</p>
                  )}
                </CardContent>
              </Card>

              {/* Histórico de Emendas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico de Emendas
                  </CardTitle>
                  <CardDescription>
                    Alterações à Lei Orgânica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingEmendas ? (
                    <Skeleton className="h-16 w-full" />
                  ) : emendas && emendas.length > 0 ? (
                    <div className="space-y-2">
                      {emendas.map((emenda) => (
                        <a
                          key={emenda.id}
                          href={emenda.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium">{emenda.titulo}</p>
                            <p className="text-xs text-muted-foreground">{emenda.ano}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Consulte as emendas à Lei Orgânica nas Publicações Oficiais:
                      </p>
                      <Link to="/publicacoes-oficiais?search=emenda%20lei%20orgânica">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Emendas
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Links Relacionados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Links Relacionados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link 
                    to="/publicacoes-oficiais?tipo=lei"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Leis Municipais
                  </Link>
                  <Link 
                    to="/legislacao/planejamento-orcamento"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Planejamento e Orçamento
                  </Link>
                  <a 
                    href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Constituição Federal
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Voltar */}
          <div className="mt-8">
            <Link 
              to="/legislacao" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Voltar para Legislação
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
