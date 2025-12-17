import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Building2, 
  Users, 
  Wallet, 
  Heart, 
  GraduationCap, 
  HandHeart, 
  HardHat, 
  Wheat,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  User,
  GitBranch
} from "lucide-react";

const orgaosAdministracao = [
  {
    nome: "Gabinete do Prefeito",
    icone: Building2,
    competencia: "Assessoramento direto ao Chefe do Poder Executivo Municipal na direção superior da administração municipal.",
    responsavel: "Prefeito Municipal",
    contato: "(87) 3831-1156",
    email: "gabinete@ipubi.pe.gov.br",
    baseLegal: "Lei Orgânica Municipal"
  },
  {
    nome: "Secretaria Municipal de Administração",
    icone: Users,
    competencia: "Gestão de pessoal, recursos humanos, patrimônio público, serviços gerais e administração de contratos.",
    responsavel: "Secretário(a) de Administração",
    contato: "(87) 3831-1156",
    email: "administracao@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
  {
    nome: "Secretaria Municipal de Finanças",
    icone: Wallet,
    competencia: "Gestão financeira, orçamentária, tributária, contabilidade e controle fiscal do município.",
    responsavel: "Secretário(a) de Finanças",
    contato: "(87) 3831-1156",
    email: "financas@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
  {
    nome: "Secretaria Municipal de Saúde",
    icone: Heart,
    competencia: "Planejamento, coordenação e execução das políticas públicas de saúde no âmbito municipal.",
    responsavel: "Secretário(a) de Saúde",
    contato: "(87) 3831-1156",
    email: "saude@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
  {
    nome: "Secretaria Municipal de Educação",
    icone: GraduationCap,
    competencia: "Gestão da educação básica municipal, incluindo educação infantil e ensino fundamental.",
    responsavel: "Secretário(a) de Educação",
    contato: "(87) 3831-1156",
    email: "educacao@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
  {
    nome: "Secretaria Municipal de Assistência Social",
    icone: HandHeart,
    competencia: "Coordenação e execução das políticas de assistência social, proteção básica e especial.",
    responsavel: "Secretário(a) de Assistência Social",
    contato: "(87) 3831-1156",
    email: "assistenciasocial@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
  {
    nome: "Secretaria Municipal de Infraestrutura",
    icone: HardHat,
    competencia: "Obras públicas, urbanismo, transporte, manutenção de vias e equipamentos urbanos.",
    responsavel: "Secretário(a) de Infraestrutura",
    contato: "(87) 3831-1156",
    email: "infraestrutura@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
  {
    nome: "Secretaria Municipal de Agricultura",
    icone: Wheat,
    competencia: "Políticas de fomento à agricultura familiar, abastecimento e desenvolvimento rural.",
    responsavel: "Secretário(a) de Agricultura",
    contato: "(87) 3831-1156",
    email: "agricultura@ipubi.pe.gov.br",
    baseLegal: "Lei Municipal de Estrutura Administrativa"
  },
];

const unidadesVinculadas = [
  {
    secretaria: "Secretaria Municipal de Saúde",
    icone: Heart,
    unidades: [
      "Unidades Básicas de Saúde (UBS)",
      "Centro de Atenção Psicossocial (CAPS)",
      "Hospital/Unidade Mista",
      "Academia da Saúde",
      "Núcleo Ampliado de Saúde da Família (NASF)"
    ]
  },
  {
    secretaria: "Secretaria Municipal de Assistência Social",
    icone: HandHeart,
    unidades: [
      "Centro de Referência de Assistência Social (CRAS)",
      "Centro de Referência Especializado de Assistência Social (CREAS)",
      "Conselho Tutelar"
    ]
  },
  {
    secretaria: "Secretaria Municipal de Educação",
    icone: GraduationCap,
    unidades: [
      "Escolas Municipais",
      "Creches e Centros de Educação Infantil"
    ]
  }
];

export default function EstruturaOrganizacionalPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <AccessibilityBar />
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Início
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span>O Governo</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Estrutura Organizacional</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Estrutura Organizacional da Prefeitura de Ipubi
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed">
              Esta página apresenta a organização administrativa do Poder Executivo Municipal de Ipubi, 
              seus órgãos, competências e vínculos institucionais, em conformidade com os princípios 
              da transparência pública e da Lei de Acesso à Informação (Lei nº 12.527/2011).
            </p>
          </div>
        </section>

        {/* Órgãos da Administração Direta */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-8 h-8 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Órgãos da Administração Direta
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {orgaosAdministracao.map((orgao, index) => {
                const IconComponent = orgao.icone;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground">
                            {orgao.nome}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {orgao.competencia}
                      </p>
                      
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Responsável:</span>
                          <span className="text-foreground font-medium">{orgao.responsavel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Contato:</span>
                          <span className="text-foreground">{orgao.contato}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">E-mail:</span>
                          <a href={`mailto:${orgao.email}`} className="text-primary hover:underline">
                            {orgao.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Base Legal:</span>
                          <span className="text-foreground">{orgao.baseLegal}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Unidades Vinculadas */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-8 h-8 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Unidades Vinculadas às Secretarias
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-8 max-w-3xl">
              As unidades listadas abaixo são equipamentos públicos e equipes técnicas vinculadas às 
              Secretarias Municipais, responsáveis pela execução das políticas públicas no âmbito local.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {unidadesVinculadas.map((item, index) => {
                const IconComponent = item.icone;
                return (
                  <Card key={index} className="bg-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-base text-foreground">
                          {item.secretaria}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {item.unidades.map((unidade, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{unidade}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Aviso Legal */}
        <section className="py-12 md:py-16">
          <div className="container">
            <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-500/20">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                      Aviso Legal
                    </h3>
                    <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
                      As unidades de atendimento, equipamentos públicos e equipes técnicas vinculadas às 
                      Secretarias Municipais têm por finalidade a execução das políticas públicas, não 
                      possuindo natureza de órgão administrativo, conforme legislação vigente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Organograma */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Visualize a Estrutura Completa
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Acesse o organograma da Prefeitura de Ipubi para uma visualização gráfica 
              completa da estrutura administrativa municipal.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/governo/organograma">
                <GitBranch className="w-5 h-5" />
                Visualizar Organograma da Prefeitura
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
