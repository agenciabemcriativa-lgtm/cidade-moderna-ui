import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
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
  GitBranch,
  ChevronRight,
  Shield,
  Briefcase,
  Scale
} from "lucide-react";
import {
  useOrgaosAdministracao,
  useUnidadesVinculadas,
} from "@/hooks/useEstruturaOrganizacional";

// Mapa de ícones
const iconMap: Record<string, React.ElementType> = {
  Building2,
  Users,
  Wallet,
  Heart,
  GraduationCap,
  HandHeart,
  HardHat,
  Wheat,
  Shield,
  FileText,
  Briefcase,
  Scale,
};

export default function EstruturaOrganizacionalPage() {
  const { data: orgaos, isLoading: loadingOrgaos } = useOrgaosAdministracao();
  const { data: unidades, isLoading: loadingUnidades } = useUnidadesVinculadas();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <AccessibilityBar />
      <Header />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs 
              items={[
                { label: "O Governo" },
                { label: "Estrutura Organizacional" }
              ]} 
            />
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
            
            {loadingOrgaos ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <Skeleton className="h-6 w-48" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {orgaos?.map((orgao) => {
                  const IconComponent = iconMap[orgao.icone] || Building2;
                  return (
                    <Card key={orgao.id} className="hover:shadow-lg transition-shadow">
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
                        {orgao.competencia && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {orgao.competencia}
                          </p>
                        )}
                        
                        <div className="space-y-2 pt-2 border-t border-border">
                          {orgao.responsavel && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">Responsável:</span>
                              <span className="text-foreground font-medium">{orgao.responsavel}</span>
                            </div>
                          )}
                          {orgao.contato && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">Contato:</span>
                              <span className="text-foreground">{orgao.contato}</span>
                            </div>
                          )}
                          {orgao.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">E-mail:</span>
                              <a href={`mailto:${orgao.email}`} className="text-primary hover:underline">
                                {orgao.email}
                              </a>
                            </div>
                          )}
                          {orgao.base_legal && (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">Base Legal:</span>
                              <span className="text-foreground">{orgao.base_legal}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
            
            {loadingUnidades ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {unidades?.map((unidade) => {
                  const IconComponent = iconMap[unidade.icone] || Building2;
                  return (
                    <Card key={unidade.id} className="bg-card">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-base text-foreground">
                            {unidade.secretaria}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {unidade.itens && unidade.itens.length > 0 && (
                          <ul className="space-y-2">
                            {unidade.itens.map((item) => (
                              <li key={item.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item.nome}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
