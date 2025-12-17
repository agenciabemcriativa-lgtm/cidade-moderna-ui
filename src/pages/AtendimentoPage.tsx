import { useParams, Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { useAtendimentoItem } from "@/hooks/useAtendimentoItens";
import { MapPin, Phone, Mail, Clock, User, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "dompurify";

export default function AtendimentoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, error } = useAtendimentoItem(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="container py-12">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-32 mb-8" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="container py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Serviço não encontrado
            </h1>
            <p className="text-muted-foreground mb-8">
              O serviço que você está procurando não existe ou foi removido.
            </p>
            <Link
              to="/atendimento"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todos os serviços
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Saúde":
        return "bg-green-500";
      case "Assistência Social":
        return "bg-blue-500";
      case "Educação":
        return "bg-yellow-500";
      case "Programas e Serviços":
        return "bg-purple-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className={`${getCategoryColor(item.categoria)} py-16`}>
          <div className="container">
            <Link
              to="/atendimento"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Atendimento ao Cidadão
            </Link>
            <Badge className="bg-white/20 text-white mb-4">
              {item.categoria}
              {item.subcategoria && ` • ${item.subcategoria}`}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {item.titulo}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {item.conteudo && (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(item.conteudo) 
                    }}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info Card */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informações de Contato
                  </h3>
                  <div className="space-y-4">
                    {item.endereco && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item.endereco}</span>
                      </div>
                    )}
                    {item.telefone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <a 
                          href={`tel:${item.telefone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.telefone}
                        </a>
                      </div>
                    )}
                    {item.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                        <a 
                          href={`mailto:${item.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          {item.email}
                        </a>
                      </div>
                    )}
                    {item.horario && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item.horario}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Responsible Person Card */}
                {(item.responsavel_nome || item.foto_url) && (
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Responsável
                    </h3>
                    <div className="flex items-center gap-4">
                      {item.foto_url ? (
                        <img
                          src={item.foto_url}
                          alt={item.responsavel_nome || "Responsável"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div>
                        {item.responsavel_nome && (
                          <p className="font-medium text-foreground">
                            {item.responsavel_nome}
                          </p>
                        )}
                        {item.responsavel_cargo && (
                          <p className="text-sm text-muted-foreground">
                            {item.responsavel_cargo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
