import { Link } from "react-router-dom";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Scale, 
  FileText, 
  BookOpen, 
  Landmark, 
  PiggyBank, 
  Info,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const breadcrumbItems = [
  { label: "Legislação" },
];

const categorias = [
  {
    titulo: "Leis Municipais",
    descricao: "Acesso organizado às Leis Ordinárias e Complementares do Município",
    icone: Scale,
    link: "/publicacoes-oficiais?tipo=lei",
    cor: "from-blue-500 to-blue-600",
    tipo: "link-interno"
  },
  {
    titulo: "Outros Atos Normativos",
    descricao: "Decretos, Resoluções, Regulamentos e Instruções Normativas",
    icone: FileText,
    link: "/legislacao/outros-atos",
    cor: "from-emerald-500 to-emerald-600",
    tipo: "pagina"
  },
  {
    titulo: "Lei de Acesso à Informação",
    descricao: "Lei nº 12.527/2011 e normas municipais de transparência",
    icone: Info,
    link: "/legislacao/lei-acesso-informacao",
    cor: "from-amber-500 to-amber-600",
    tipo: "pagina"
  },
  {
    titulo: "Lei Orgânica do Município",
    descricao: "Texto integral consolidado da Lei Orgânica Municipal",
    icone: Landmark,
    link: "/legislacao/lei-organica",
    cor: "from-purple-500 to-purple-600",
    tipo: "pagina"
  },
  {
    titulo: "Planejamento e Orçamento",
    descricao: "PPA, LDO e LOA - Instrumentos de planejamento fiscal",
    icone: PiggyBank,
    link: "/legislacao/planejamento-orcamento",
    cor: "from-rose-500 to-rose-600",
    tipo: "pagina"
  },
];

export default function LegislacaoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary-foreground/20 rounded-lg">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  Legislação Municipal
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Acesso organizado às normas legais do Município de Ipubi
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

          {/* Sobre o Módulo */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Sobre este Módulo
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O Módulo de Legislação Municipal tem como objetivo organizar e facilitar o acesso do cidadão 
              às principais normas do Município, em conformidade com a Lei nº 12.527/2011 (Lei de Acesso à Informação) 
              e a Lei Complementar nº 131/2009 (Lei da Transparência). Este módulo atua como facilitador de consulta temática, 
              direcionando para as publicações oficiais correspondentes.
            </p>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => {
              const IconComponent = categoria.icone;
              return (
                <Link key={categoria.titulo} to={categoria.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-border">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${categoria.cor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {categoria.titulo}
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {categoria.descricao}
                      </CardDescription>
                      {categoria.tipo === "link-interno" && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary mt-3">
                          <ExternalLink className="h-3 w-3" />
                          Acessar Publicações Oficiais
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Links Úteis */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Links Úteis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/publicacoes-oficiais" 
                className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Publicações Oficiais</span>
                  <p className="text-xs text-muted-foreground">Diário Oficial do Município</p>
                </div>
              </Link>
              <a 
                href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <ExternalLink className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">LAI Federal</span>
                  <p className="text-xs text-muted-foreground">Lei nº 12.527/2011</p>
                </div>
              </a>
              <Link 
                to="/contato" 
                className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <Info className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Ouvidoria</span>
                  <p className="text-xs text-muted-foreground">Canais de atendimento</p>
                </div>
              </Link>
              <Link 
                to="/licitacoes" 
                className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <Scale className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Licitações</span>
                  <p className="text-xs text-muted-foreground">Processos licitatórios</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
