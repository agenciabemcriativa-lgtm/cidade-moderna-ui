import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Info,
  ExternalLink,
  FileText,
  MessageSquare,
  Eye,
  ChevronRight,
  Download,
  Scale
} from "lucide-react";

const breadcrumbItems = [
  { label: "Legislação", href: "/legislacao" },
  { label: "Lei de Acesso à Informação" },
];

const recursos = [
  {
    titulo: "e-SIC",
    descricao: "Sistema Eletrônico do Serviço de Informação ao Cidadão",
    icone: MessageSquare,
    link: "/transparencia/esic",
    tipo: "interno",
    cor: "from-blue-500 to-blue-600"
  },
  {
    titulo: "Ouvidoria",
    descricao: "Canal de comunicação direta com a Administração",
    icone: MessageSquare,
    link: "/contato",
    tipo: "interno",
    cor: "from-emerald-500 to-emerald-600"
  },
  {
    titulo: "Portal da Transparência",
    descricao: "Acesso às informações públicas do Município",
    icone: Eye,
    link: "#",
    tipo: "externo",
    cor: "from-amber-500 to-amber-600"
  },
];

export default function LeiAcessoInformacaoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Info className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Lei de Acesso à Informação
                </h1>
                <p className="text-white/80 mt-1">
                  Lei nº 12.527/2011 e normas municipais de transparência
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sobre a LAI */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    O que é a Lei de Acesso à Informação?
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    A <strong>Lei nº 12.527/2011</strong>, conhecida como Lei de Acesso à Informação (LAI), 
                    regulamenta o direito constitucional de acesso às informações públicas. Essa norma entrou 
                    em vigor em 16 de maio de 2012 e criou mecanismos que possibilitam a qualquer pessoa, 
                    física ou jurídica, sem necessidade de apresentar motivo, o recebimento de informações 
                    públicas dos órgãos e entidades.
                  </p>
                  <p>
                    A LAI vale para os três Poderes da União, Estados, Distrito Federal e Municípios, 
                    inclusive aos Tribunais de Contas e Ministério Público. Entidades privadas sem fins 
                    lucrativos também são obrigadas a dar publicidade a informações referentes ao recebimento 
                    e à destinação dos recursos públicos por elas recebidos.
                  </p>
                </CardContent>
              </Card>

              {/* Legislação Federal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Legislação Federal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Lei nº 12.527/2011</h4>
                      <p className="text-sm text-muted-foreground">
                        Regula o acesso a informações previsto na Constituição Federal
                      </p>
                    </div>
                    <a 
                      href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Acessar
                      </Button>
                    </a>
                  </div>
                  <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Lei Complementar nº 131/2009</h4>
                      <p className="text-sm text-muted-foreground">
                        Lei da Transparência - Disponibilização de informações sobre execução orçamentária
                      </p>
                    </div>
                    <a 
                      href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp131.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Acessar
                      </Button>
                    </a>
                  </div>
                  <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Decreto nº 7.724/2012</h4>
                      <p className="text-sm text-muted-foreground">
                        Regulamenta a Lei de Acesso à Informação no âmbito federal
                      </p>
                    </div>
                    <a 
                      href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/decreto/d7724.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Acessar
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Regulamentação Municipal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Regulamentação Municipal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Normas municipais que regulamentam a Lei de Acesso à Informação no âmbito do Município de Ipubi:
                  </p>
                  <Link to="/publicacoes-oficiais?search=acesso%20informação">
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Ver Publicações Relacionadas
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Canais de Atendimento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Canais de Atendimento</CardTitle>
                  <CardDescription>
                    Solicite informações ou faça reclamações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recursos.map((recurso) => {
                    const IconComponent = recurso.icone;
                    const Wrapper = recurso.tipo === "interno" ? Link : "a";
                    const props = recurso.tipo === "interno" 
                      ? { to: recurso.link }
                      : { href: recurso.link, target: "_blank", rel: "noopener noreferrer" };
                    
                    return (
                      <Wrapper key={recurso.titulo} {...props as any}>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${recurso.cor} flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-foreground text-sm">{recurso.titulo}</span>
                            <p className="text-xs text-muted-foreground">{recurso.descricao}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Wrapper>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Direitos do Cidadão */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seus Direitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Acesso a informações públicas sem necessidade de justificativa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Resposta em até 20 dias (prorrogáveis por mais 10)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Gratuidade do serviço, salvo custos de reprodução</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Possibilidade de recurso em caso de negativa</span>
                    </li>
                  </ul>
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
