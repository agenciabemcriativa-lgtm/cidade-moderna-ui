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

const breadcrumbItems = [
  { label: "Início", href: "/" },
  { label: "Legislação", href: "/legislacao" },
  { label: "Planejamento e Orçamento" },
];

const currentYear = new Date().getFullYear();

export default function PlanejamentoOrcamentoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} className="mb-6 text-white/80" />
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
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      2022-2025
                    </Badge>
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
                    <p>
                      O PPA vigente abrange o período de <strong>2022 a 2025</strong>, tendo sido elaborado no 
                      primeiro ano do mandato e devendo ser executado até o primeiro ano do mandato subsequente.
                    </p>
                  </div>

                  {/* Documento Vigente */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">PPA 2022-2025 (Vigente)</h4>
                        <p className="text-sm text-muted-foreground">
                          Plano Plurianual do Município de Ipubi
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Vigente</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </Button>
                      <Link to="/publicacoes-oficiais?search=PPA%202022">
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Publicação
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Histórico */}
                  <div>
                    <h4 className="font-medium mb-3">Histórico de PPAs</h4>
                    <div className="space-y-2">
                      {["2018-2021", "2014-2017", "2010-2013"].map((periodo) => (
                        <div key={periodo} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">PPA {periodo}</span>
                          <Link to={`/publicacoes-oficiais?search=PPA%20${periodo.split('-')[0]}`}>
                            <Button variant="ghost" size="sm" className="gap-1 h-8">
                              <FileText className="h-3 w-3" />
                              Ver
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
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
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {currentYear}
                    </Badge>
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
                    <p>
                      A LDO também dispõe sobre alterações na legislação tributária e estabelece a 
                      política de aplicação das agências financeiras oficiais de fomento.
                    </p>
                  </div>

                  {/* Documento Vigente */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">LDO {currentYear} (Vigente)</h4>
                        <p className="text-sm text-muted-foreground">
                          Lei de Diretrizes Orçamentárias para o exercício de {currentYear}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Vigente</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </Button>
                      <Link to={`/publicacoes-oficiais?search=LDO%20${currentYear}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Publicação
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Histórico */}
                  <div>
                    <h4 className="font-medium mb-3">Histórico de LDOs</h4>
                    <div className="space-y-2">
                      {[currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].map((ano) => (
                        <div key={ano} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">LDO {ano}</span>
                          <Link to={`/publicacoes-oficiais?search=LDO%20${ano}`}>
                            <Button variant="ghost" size="sm" className="gap-1 h-8">
                              <FileText className="h-3 w-3" />
                              Ver
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
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
                    <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                      {currentYear}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>
                      A <strong>Lei Orçamentária Anual (LOA)</strong> é o orçamento propriamente dito, 
                      que estima as receitas e fixa as despesas para o exercício financeiro. A LOA deve 
                      ser elaborada de forma compatível com o PPA e com a LDO.
                    </p>
                    <p>
                      A LOA compreende o orçamento fiscal, o orçamento de investimento das empresas 
                      estatais e o orçamento da seguridade social.
                    </p>
                  </div>

                  {/* Documento Vigente */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">LOA {currentYear} (Vigente)</h4>
                        <p className="text-sm text-muted-foreground">
                          Lei Orçamentária Anual para o exercício de {currentYear}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Vigente</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </Button>
                      <Link to={`/publicacoes-oficiais?search=LOA%20${currentYear}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Publicação
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Histórico */}
                  <div>
                    <h4 className="font-medium mb-3">Histórico de LOAs</h4>
                    <div className="space-y-2">
                      {[currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].map((ano) => (
                        <div key={ano} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">LOA {ano}</span>
                          <Link to={`/publicacoes-oficiais?search=LOA%20${ano}`}>
                            <Button variant="ghost" size="sm" className="gap-1 h-8">
                              <FileText className="h-3 w-3" />
                              Ver
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
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
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Acessar Portal da Transparência
                </Button>
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
