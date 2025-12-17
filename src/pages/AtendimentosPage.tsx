import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { useAtendimentoItens } from "@/hooks/useAtendimentoItens";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Phone, 
  Clock,
  ArrowRight 
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "Saúde": Heart,
  "Assistência Social": Users,
  "Educação": GraduationCap,
  "Programas e Serviços": Briefcase,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Saúde": { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/20" },
  "Assistência Social": { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
  "Educação": { bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-500/20" },
  "Programas e Serviços": { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
};

const categoryBadgeColors: Record<string, string> = {
  "Saúde": "bg-green-500",
  "Assistência Social": "bg-blue-500",
  "Educação": "bg-yellow-500",
  "Programas e Serviços": "bg-purple-500",
};

export default function AtendimentosPage() {
  const { data: itens = [], isLoading } = useAtendimentoItens();

  // Group items by category
  const groupedItems = itens.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, typeof itens>);

  // Define category order
  const categoryOrder = ["Saúde", "Assistência Social", "Educação", "Programas e Serviços"];
  const sortedCategories = categoryOrder.filter(cat => groupedItems[cat]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="container py-12">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs items={[{ label: "Atendimento ao Cidadão" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Atendimento ao Cidadão
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Conheça todos os serviços de atendimento oferecidos pela Prefeitura de Ipubi 
              para você e sua família.
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container space-y-12">
            {sortedCategories.map((categoria) => {
              const Icon = categoryIcons[categoria] || Briefcase;
              const colors = categoryColors[categoria] || categoryColors["Programas e Serviços"];
              const items = groupedItems[categoria];

              return (
                <div key={categoria}>
                  {/* Category Header */}
                  <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                    <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${colors.text}`}>
                        {categoria}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {items.length} {items.length === 1 ? "serviço disponível" : "serviços disponíveis"}
                      </p>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <Link key={item.id} to={`/atendimento/${item.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-border/50">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                {item.subcategoria && (
                                  <Badge 
                                    className={`${categoryBadgeColors[categoria]} mb-2`}
                                  >
                                    {item.subcategoria}
                                  </Badge>
                                )}
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                  {item.titulo}
                                </CardTitle>
                              </div>
                              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {item.endereco && (
                              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{item.endereco}</span>
                              </div>
                            )}
                            {item.telefone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>{item.telefone}</span>
                              </div>
                            )}
                            {item.horario && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span>{item.horario}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {sortedCategories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum serviço de atendimento cadastrado no momento.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
