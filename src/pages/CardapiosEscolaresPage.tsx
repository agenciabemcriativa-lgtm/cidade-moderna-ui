import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ExternalLink } from "lucide-react";
import { useCardapiosEscolares } from "@/hooks/useCardapiosEscolares";

export default function CardapiosEscolaresPage() {
  const { data: cardapios, isLoading } = useCardapiosEscolares();

  const breadcrumbItems = [
    { label: "Início", href: "/" },
    { label: "Cardápios Escolares" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AccessibilityBar />
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} className="text-white/80 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cardápios Escolares</h1>
            <p className="text-white/90 max-w-2xl">
              Confira os cardápios das escolas municipais, creches e tempo integral.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-12 w-full max-w-md" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : cardapios && cardapios.length > 0 ? (
              <div className="space-y-8">
                {cardapios.map((grupo) => (
                  <div key={`${grupo.ano}-${grupo.mes}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-primary text-white px-6 py-4">
                      <h2 className="text-lg font-semibold">{grupo.label}</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {grupo.itens.map((item) => (
                        <a
                          key={item.id}
                          href={item.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors group"
                        >
                          <FileText className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                          <span className="text-gray-700 group-hover:text-primary transition-colors flex-1">
                            {item.titulo}
                          </span>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum cardápio disponível</h3>
                <p className="text-gray-500">Os cardápios serão exibidos aqui quando forem publicados.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
