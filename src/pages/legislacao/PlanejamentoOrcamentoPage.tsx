import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PiggyBank,
  Info,
  FileText,
  Download,
  ChevronRight,
  Calendar,
  ExternalLink,
  Target,
  TrendingUp,
  Wallet
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDocumentosLegislacao, DocumentoLegislacao } from "@/hooks/useDocumentosLegislacao";

const breadcrumbItems = [
  { label: "Legislação", href: "/legislacao" },
  { label: "Planejamento e Orçamento" },
];

const currentYear = new Date().getFullYear();

function DocumentoCard({ documento, tipo }: { documento?: DocumentoLegislacao; tipo: string }) {
  if (!documento) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg border border-border text-center">
        <p className="text-muted-foreground">
          Documento ainda não cadastrado no sistema.
        </p>
        <Link to={`/publicacoes-oficiais?search=${tipo}%20${currentYear}`} className="mt-2 inline-block">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Buscar nas Publicações Oficiais
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium">{documento.titulo}</h4>
          {documento.descricao && (
            <p className="text-sm text-muted-foreground">
              {documento.descricao}
            </p>
          )}
        </div>
        <Badge className={documento.vigente ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
          {documento.vigente ? "Vigente" : "Não vigente"}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar className="h-3 w-3" />
        {format(new Date(documento.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
      </div>
      <div className="flex gap-2">
        <a href={documento.arquivo_url} target="_blank" rel="noopener noreferrer">
          <Button variant="default" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </a>
      </div>
    </div>
  );
}

function HistoricoList({ documentos, tipo, isLoading }: { documentos?: DocumentoLegislacao[]; tipo: string; isLoading: boolean }) {
  const historico = documentos?.filter(d => !d.vigente) || [];
  const anos = [currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (historico.length > 0) {
    return (
      <div className="space-y-2">
        {historico.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <span className="text-sm font-medium">{doc.titulo}</span>
              <p className="text-xs text-muted-foreground">{doc.ano}</p>
            </div>
            <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-1 h-8">
                <FileText className="h-3 w-3" />
                Ver
              </Button>
            </a>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {anos.map((ano) => (
        <div key={ano} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm">{tipo} {ano}</span>
          <Link to={`/publicacoes-oficiais?search=${tipo}%20${ano}`}>
            <Button variant="ghost" size="sm" className="gap-1 h-8">
              <FileText className="h-3 w-3" />
              Ver
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function PlanejamentoOrcamentoPage() {
  const { data: ppaDocs, isLoading: loadingPPA } = useDocumentosLegislacao({ tipo: 'ppa' });
  const { data: ldoDocs, isLoading: loadingLDO } = useDocumentosLegislacao({ tipo: 'ldo' });
  const { data: loaDocs, isLoading: loadingLOA } = useDocumentosLegislacao({ tipo: 'loa' });

  const ppaVigente = ppaDocs?.find(d => d.vigente);
  const ldoVigente = ldoDocs?.find(d => d.vigente);
  const loaVigente = loaDocs?.find(d => d.vigente);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Planejamento e Orçamento
                </h1>
                <p className="text-white/80 mt-1">
                  PPA, LDO e LOA - Instrumentos de planejamento fiscal
                </p>
              </div>
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

          {/* Introdução */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Sobre os Instrumentos de Planejamento
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O planejamento orçamentário municipal é realizado através de três instrumentos principais, 
              conforme estabelecido pela Constituição Federal: o Plano Plurianual (PPA), a Lei de Diretrizes 
              Orçamentárias (LDO) e a Lei Orçamentária Anual (LOA). Esses instrumentos são essenciais para 
              a gestão fiscal responsável e transparente dos recursos públicos.
            </p>
          </div>

          {/* Tabs para cada instrumento */}
          <Tabs defaultValue="ppa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="ppa" className="flex flex-col gap-1 py-3">
                <Target className="h-5 w-5" />
                <span className="text-xs sm:text-sm">PPA</span>
              </TabsTrigger>
              <TabsTrigger value="ldo" className="flex flex-col gap-1 py-3">
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs sm:text-sm">LDO</span>
              </TabsTrigger>
              <TabsTrigger value="loa" className="flex flex-col gap-1 py-3">
                <Wallet className="h-5 w-5" />
                <span className="text-xs sm:text-sm">LOA</span>
              </TabsTrigger>
            </TabsList>

            {/* PPA */}
            <TabsContent value="ppa">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Plano Plurianual (PPA)
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Estabelece diretrizes, objetivos e metas para 4 anos
                      </CardDescription>
                    </div>
                    {ppaVigente && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {ppaVigente.ano}-{ppaVigente.ano + 3}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>
                      O <strong>Plano Plurianual (PPA)</strong> é o instrumento de planejamento governamental 
                      de médio prazo, previsto no artigo 165 da Constituição Federal. Ele estabelece, de forma 
                      regionalizada, as diretrizes, objetivos e metas da administração pública para as despesas 
                      de capital e outras delas decorrentes e para as relativas aos programas de duração continuada.
                    </p>
                  </div>

                  {/* Documento Vigente */}
                  <div>
                    <h4 className="font-medium mb-3">Documento Vigente</h4>
                    {loadingPPA ? (
                      <Skeleton className="h-24 w-full" />
                    ) : (
                      <DocumentoCard documento={ppaVigente} tipo="PPA" />
                    )}
                  </div>

                  {/* Histórico */}
                  <div>
                    <h4 className="font-medium mb-3">Histórico de PPAs</h4>
                    <HistoricoList documentos={ppaDocs} tipo="PPA" isLoading={loadingPPA} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LDO */}
            <TabsContent value="ldo">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Lei de Diretrizes Orçamentárias (LDO)
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Define metas e prioridades para o exercício seguinte
                      </CardDescription>
                    </div>
                    {ldoVigente && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {ldoVigente.ano}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>
                      A <strong>Lei de Diretrizes Orçamentárias (LDO)</strong> é o instrumento que orienta 
                      a elaboração da Lei Orçamentária Anual. Ela estabelece as metas e prioridades da 
                      administração pública, incluindo as despesas de capital para o exercício financeiro 
                      subsequente, e orienta a elaboração da LOA.
                    </p>
                  </div>

                  {/* Documento Vigente */}
                  <div>
                    <h4 className="font-medium mb-3">Documento Vigente</h4>
                    {loadingLDO ? (
                      <Skeleton className="h-24 w-full" />
                    ) : (
                      <DocumentoCard documento={ldoVigente} tipo="LDO" />
                    )}
                  </div>

                  {/* Histórico */}
                  <div>
                    <h4 className="font-medium mb-3">Histórico de LDOs</h4>
                    <HistoricoList documentos={ldoDocs} tipo="LDO" isLoading={loadingLDO} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LOA */}
            <TabsContent value="loa">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        Lei Orçamentária Anual (LOA)
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Estima receitas e fixa despesas para o exercício
                      </CardDescription>
                    </div>
                    {loaVigente && (
                      <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                        {loaVigente.ano}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>
                      A <strong>Lei Orçamentária Anual (LOA)</strong> é o orçamento propriamente dito, 
                      que estima as receitas e fixa as despesas para o exercício financeiro. A LOA deve 
                      ser elaborada de forma compatível com o PPA e com a LDO.
                    </p>
                  </div>

                  {/* Documento Vigente */}
                  <div>
                    <h4 className="font-medium mb-3">Documento Vigente</h4>
                    {loadingLOA ? (
                      <Skeleton className="h-24 w-full" />
                    ) : (
                      <DocumentoCard documento={loaVigente} tipo="LOA" />
                    )}
                  </div>

                  {/* Histórico */}
                  <div>
                    <h4 className="font-medium mb-3">Histórico de LOAs</h4>
                    <HistoricoList documentos={loaDocs} tipo="LOA" isLoading={loadingLOA} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Link para Portal da Transparência */}
          <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Portal da Transparência</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Para acompanhamento da execução orçamentária em tempo real e outras informações 
                  fiscais, acesse o Portal da Transparência do Município.
                </p>
                <a href="https://www.ipubi.pe.gov.br/portaldatransparencia/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Acessar Portal da Transparência
                  </Button>
                </a>
              </div>
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
