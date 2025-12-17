import { useParams, Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { useGovernoItens } from "@/hooks/useGovernoItens";
import { ChevronRight, Loader2, Mail, Phone, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizeHTML } from "@/lib/sanitize";

// Dados temporários para Prefeito e Vice-prefeito (podem ser movidos para o banco depois)
const autoridades = {
  prefeito: {
    nome: "Nome do Prefeito",
    cargo: "Prefeito Municipal",
    foto: null,
    biografia: "Biografia do prefeito em construção. Adicione informações sobre a trajetória política, formação acadêmica e principais realizações.",
    contato: {
      telefone: "(87) 3881-1156",
      email: "gabinete@ipubi.pe.gov.br",
      endereco: "Praça Agamenon Magalhães, S/N, Centro - Ipubi/PE"
    }
  },
  "vice-prefeito": {
    nome: "Nome do Vice-Prefeito",
    cargo: "Vice-Prefeito Municipal",
    foto: null,
    biografia: "Biografia do vice-prefeito em construção. Adicione informações sobre a trajetória política, formação acadêmica e principais realizações.",
    contato: {
      telefone: "(87) 3881-1156",
      email: "gabinete@ipubi.pe.gov.br",
      endereco: "Praça Agamenon Magalhães, S/N, Centro - Ipubi/PE"
    }
  }
};

export default function GovernoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: governoItens = [], isLoading } = useGovernoItens();
  
  const item = governoItens.find((g) => g.slug === slug);
  const autoridade = slug ? autoridades[slug as keyof typeof autoridades] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <AccessibilityBar />
        <Header />
        <main className="container py-12">
          <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
          <p className="text-muted-foreground mt-2">O item solicitado não existe.</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Voltar para a página inicial
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Layout especial para Prefeito e Vice-prefeito
  const isAutoridade = slug === "prefeito" || slug === "vice-prefeito";

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
              <span className="text-foreground font-medium">{item.titulo}</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {item.titulo}
          </h1>
          
          {isAutoridade && autoridade ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Foto */}
              <Card className="md:col-span-1">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    {autoridade.foto ? (
                      <img 
                        src={autoridade.foto} 
                        alt={autoridade.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-muted-foreground/50" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{autoridade.nome}</h2>
                  <p className="text-primary font-medium">{autoridade.cargo}</p>
                </CardContent>
              </Card>

              {/* Biografia e Contato */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Biografia</h3>
                    {(item as any).conteudo ? (
                      <div 
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML((item as any).conteudo) }}
                      />
                    ) : (
                      <p className="text-muted-foreground">{autoridade.biografia}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Informações de Contato</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="w-5 h-5 text-primary" />
                        <span>{autoridade.contato.telefone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-5 h-5 text-primary" />
                        <a href={`mailto:${autoridade.contato.email}`} className="hover:text-primary transition-colors">
                          {autoridade.contato.email}
                        </a>
                      </div>
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{autoridade.contato.endereco}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                {(item as any).conteudo ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML((item as any).conteudo) }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Conteúdo da página "{item.titulo}" em construção.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
