import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Card, CardContent } from "@/components/ui/card";
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
  Crown,
  FileText,
  Download
} from "lucide-react";

interface OrgNode {
  id: string;
  titulo: string;
  subtitulo?: string;
  icone: React.ElementType;
  nivel: "prefeito" | "vice" | "secretaria";
  children?: OrgNode[];
}

const organogramaData: OrgNode = {
  id: "prefeito",
  titulo: "Prefeito Municipal",
  subtitulo: "Chefe do Poder Executivo",
  icone: Crown,
  nivel: "prefeito",
  children: [
    {
      id: "vice",
      titulo: "Vice-Prefeito",
      subtitulo: "Substituição Legal",
      icone: Users,
      nivel: "vice",
    },
    {
      id: "gabinete",
      titulo: "Gabinete do Prefeito",
      subtitulo: "Assessoramento Direto",
      icone: Building2,
      nivel: "secretaria",
    },
    {
      id: "administracao",
      titulo: "Sec. de Administração",
      subtitulo: "Gestão de Pessoal e Patrimônio",
      icone: Users,
      nivel: "secretaria",
    },
    {
      id: "financas",
      titulo: "Sec. de Finanças",
      subtitulo: "Gestão Financeira e Tributária",
      icone: Wallet,
      nivel: "secretaria",
    },
    {
      id: "saude",
      titulo: "Sec. de Saúde",
      subtitulo: "Políticas de Saúde",
      icone: Heart,
      nivel: "secretaria",
    },
    {
      id: "educacao",
      titulo: "Sec. de Educação",
      subtitulo: "Educação Básica Municipal",
      icone: GraduationCap,
      nivel: "secretaria",
    },
    {
      id: "assistencia",
      titulo: "Sec. de Assistência Social",
      subtitulo: "Proteção Social",
      icone: HandHeart,
      nivel: "secretaria",
    },
    {
      id: "infraestrutura",
      titulo: "Sec. de Infraestrutura",
      subtitulo: "Obras e Urbanismo",
      icone: HardHat,
      nivel: "secretaria",
    },
    {
      id: "agricultura",
      titulo: "Sec. de Agricultura",
      subtitulo: "Desenvolvimento Rural",
      icone: Wheat,
      nivel: "secretaria",
    },
  ]
};

const OrgCard = ({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) => {
  const IconComponent = node.icone;
  
  const getBgColor = () => {
    switch (node.nivel) {
      case "prefeito":
        return "bg-primary text-primary-foreground";
      case "vice":
        return "bg-secondary text-secondary-foreground";
      case "secretaria":
        return "bg-card border-2 border-primary/30 text-card-foreground";
      default:
        return "bg-card text-card-foreground";
    }
  };

  return (
    <div className={`rounded-xl p-4 shadow-lg transition-all hover:shadow-xl hover:scale-105 ${getBgColor()}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${node.nivel === "secretaria" ? "bg-primary/10" : "bg-white/20"}`}>
          <IconComponent className={`w-5 h-5 ${node.nivel === "secretaria" ? "text-primary" : ""}`} />
        </div>
        <div className="text-left">
          <h3 className={`font-bold text-sm leading-tight ${isRoot ? "text-base" : ""}`}>
            {node.titulo}
          </h3>
          {node.subtitulo && (
            <p className={`text-xs mt-0.5 ${node.nivel === "secretaria" ? "text-muted-foreground" : "opacity-80"}`}>
              {node.subtitulo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function OrganogramaPage() {
  const vicePrefeito = organogramaData.children?.find(c => c.nivel === "vice");
  const secretarias = organogramaData.children?.filter(c => c.nivel === "secretaria") || [];
  
  // Split secretarias into two rows for better layout
  const primeiraLinha = secretarias.slice(0, 4);
  const segundaLinha = secretarias.slice(4);

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
              <span className="text-foreground font-medium">Organograma</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Organograma da Prefeitura de Ipubi
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed">
              Visualização gráfica da estrutura administrativa do Poder Executivo Municipal, 
              apresentando a hierarquia e os órgãos que compõem a administração pública de Ipubi.
            </p>
          </div>
        </section>

        {/* Organograma Visual */}
        <section className="py-12 md:py-16 overflow-x-auto">
          <div className="container">
            <div className="min-w-[900px] px-4">
              {/* Nível 1: Prefeito */}
              <div className="flex flex-col items-center">
                <OrgCard node={organogramaData} isRoot />
                
                {/* Linha vertical do Prefeito */}
                <div className="w-0.5 h-8 bg-primary/40" />
                
                {/* Nível 2: Vice-Prefeito e conexão */}
                <div className="flex items-start gap-8">
                  {/* Vice-Prefeito (lateral) */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-0.5 bg-primary/40" />
                    {vicePrefeito && <OrgCard node={vicePrefeito} />}
                  </div>
                  
                  {/* Linha central continuando */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-primary/40" />
                    
                    {/* Linha horizontal para secretarias */}
                    <div className="relative">
                      <div className="h-0.5 bg-primary/40" style={{ width: "780px" }} />
                    </div>
                    
                    {/* Primeira linha de secretarias */}
                    <div className="flex gap-4 mt-0">
                      {primeiraLinha.map((secretaria, index) => (
                        <div key={secretaria.id} className="flex flex-col items-center">
                          <div className="w-0.5 h-6 bg-primary/40" />
                          <OrgCard node={secretaria} />
                        </div>
                      ))}
                    </div>
                    
                    {/* Segunda linha de secretarias */}
                    {segundaLinha.length > 0 && (
                      <>
                        <div className="w-0.5 h-8 bg-primary/40 mt-4" />
                        <div className="relative">
                          <div className="h-0.5 bg-primary/40" style={{ width: "580px" }} />
                        </div>
                        <div className="flex gap-4 mt-0">
                          {segundaLinha.map((secretaria) => (
                            <div key={secretaria.id} className="flex flex-col items-center">
                              <div className="w-0.5 h-6 bg-primary/40" />
                              <OrgCard node={secretaria} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legenda */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <h2 className="text-xl font-bold text-foreground mb-6">Legenda</h2>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">Chefe do Executivo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-secondary" />
                <span className="text-sm text-muted-foreground">Vice-Prefeito</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded border-2 border-primary/30 bg-card" />
                <span className="text-sm text-muted-foreground">Secretarias e Órgãos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Informações Adicionais */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Base Legal
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        A estrutura administrativa da Prefeitura de Ipubi está fundamentada na 
                        Lei Orgânica Municipal e nas leis municipais de criação e organização 
                        das secretarias, em conformidade com a Constituição Federal e Estadual.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Estrutura Detalhada
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Para informações detalhadas sobre as competências e atribuições de cada 
                        órgão da administração municipal, acesse a página de Estrutura Organizacional.
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/governo/estrutura-organizacional">
                          Ver Estrutura Completa
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Atualização */}
        <section className="py-8 border-t border-border">
          <div className="container">
            <p className="text-sm text-muted-foreground text-center">
              Última atualização: Dezembro de 2025 | Gestão 2025-2028
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
