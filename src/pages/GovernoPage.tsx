import { useParams, Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { useGovernoItens } from "@/hooks/useGovernoItens";
import { ChevronRight, Loader2 } from "lucide-react";

export default function GovernoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: governoItens = [], isLoading } = useGovernoItens();
  
  const item = governoItens.find((g) => g.slug === slug);

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
              <span className="text-foreground font-medium">{item.titulo}</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {item.titulo}
          </h1>
          
          <div className="bg-card rounded-xl border border-border p-8">
            <p className="text-muted-foreground">
              Conteúdo da página "{item.titulo}" em construção.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
