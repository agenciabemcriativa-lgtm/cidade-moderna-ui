import { Link, useSearchParams } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { useNoticias } from "@/hooks/useNoticias";
import { useLicitacoes, modalidadeLabels, statusLabels, statusColors } from "@/hooks/useLicitacoes";
import { Calendar, Search, FileText, Newspaper, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryColorMap: Record<string, string> = {
  "bg-primary": "bg-primary",
  "bg-blue-600": "bg-blue-600",
  "bg-green-600": "bg-green-600",
  "bg-red-600": "bg-red-600",
  "bg-purple-600": "bg-purple-600",
  "bg-orange-600": "bg-orange-600",
  "bg-amber-600": "bg-amber-600",
  "bg-teal-600": "bg-teal-600",
  "bg-gray-600": "bg-gray-600",
  "bg-green-700": "bg-green-700",
  "bg-indigo-600": "bg-indigo-600",
  "bg-pink-600": "bg-pink-600",
  "bg-yellow-600": "bg-yellow-600",
};

const getCategoryColor = (color: string) => {
  return categoryColorMap[color] || "bg-primary";
};

export default function BuscaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  
  const { data: noticias, isLoading: loadingNoticias } = useNoticias();
  const { data: licitacoes, isLoading: loadingLicitacoes } = useLicitacoes({ publicadoOnly: true });

  const filteredNoticias = useMemo(() => {
    if (!noticias || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return noticias.filter(
      (noticia) =>
        noticia.title.toLowerCase().includes(query) ||
        noticia.summary.toLowerCase().includes(query) ||
        noticia.category.toLowerCase().includes(query)
    );
  }, [noticias, searchQuery]);

  const filteredLicitacoes = useMemo(() => {
    if (!licitacoes || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return licitacoes.filter(
      (licitacao) =>
        licitacao.numero_processo.toLowerCase().includes(query) ||
        licitacao.objeto.toLowerCase().includes(query) ||
        (licitacao.secretaria_nome?.toLowerCase().includes(query) ?? false)
    );
  }, [licitacoes, searchQuery]);

  const clearSearch = () => {
    setSearchParams({});
  };

  const isLoading = loadingNoticias || loadingLicitacoes;
  const totalResults = filteredNoticias.length + filteredLicitacoes.length;

  return (
    <div className="min-h-screen flex flex-col">
      <AccessibilityBar />
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs items={[{ label: "Busca" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Resultados da Busca
            </h1>
            {searchQuery && (
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                Buscando por: "{searchQuery}"
              </p>
            )}
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            {!searchQuery ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Digite algo para buscar
                </h3>
                <p className="text-muted-foreground">
                  Use a barra de busca na página inicial para encontrar notícias e licitações
                </p>
              </div>
            ) : (
              <>
                {/* Search summary */}
                <div className="mb-8 flex items-center justify-between bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-foreground">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {isLoading ? (
                        "Buscando..."
                      ) : (
                        <>
                          <strong>{totalResults}</strong> resultado{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Limpar
                  </button>
                </div>

                {isLoading ? (
                  <div className="space-y-8">
                    <div>
                      <Skeleton className="h-8 w-32 mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-48" />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : totalResults === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos resultados para "{searchQuery}"
                    </p>
                    <Link to="/" className="text-primary hover:underline">
                      Voltar para a página inicial
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* News Results */}
                    {filteredNoticias.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <Newspaper className="h-6 w-6 text-primary" />
                          <h2 className="text-2xl font-bold text-foreground">
                            Notícias ({filteredNoticias.length})
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredNoticias.map((noticia) => (
                            <Link
                              key={noticia.id}
                              to={`/noticia/${noticia.slug}`}
                              className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                            >
                              <div className="aspect-video overflow-hidden">
                                <img
                                  src={noticia.image}
                                  alt={noticia.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getCategoryColor(noticia.categoryColor)}`}
                                  >
                                    {noticia.category}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {noticia.date}
                                  </span>
                                </div>
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                  {noticia.title}
                                </h3>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {filteredNoticias.length > 0 && (
                          <div className="mt-4 text-center">
                            <Link
                              to={`/noticias?busca=${encodeURIComponent(searchQuery)}`}
                              className="text-primary hover:underline text-sm"
                            >
                              Ver todas as notícias →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Licitações Results */}
                    {filteredLicitacoes.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <FileText className="h-6 w-6 text-primary" />
                          <h2 className="text-2xl font-bold text-foreground">
                            Licitações ({filteredLicitacoes.length})
                          </h2>
                        </div>
                        <div className="space-y-4">
                          {filteredLicitacoes.map((licitacao) => (
                            <Link
                              key={licitacao.id}
                              to={`/licitacao/${licitacao.id}`}
                              className="block bg-card p-5 rounded-xl shadow-sm hover:shadow-lg transition-all border border-border hover:border-primary/30"
                            >
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-primary">
                                      {licitacao.numero_processo}
                                    </span>
                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                      {modalidadeLabels[licitacao.modalidade]}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded text-white ${statusColors[licitacao.status]}`}>
                                      {statusLabels[licitacao.status]}
                                    </span>
                                  </div>
                                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                                    {licitacao.objeto}
                                  </h3>
                                  {licitacao.secretaria_nome && (
                                    <p className="text-sm text-muted-foreground">
                                      {licitacao.secretaria_nome}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm text-muted-foreground">
                                  <p>Postagem: {format(new Date(licitacao.data_abertura), "dd/MM/yyyy", { locale: ptBR })}</p>
                                  {licitacao.valor_estimado && (
                                    <p className="font-semibold text-foreground">
                                      R$ {licitacao.valor_estimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Link
                            to="/licitacoes"
                            className="text-primary hover:underline text-sm"
                          >
                            Ver todas as licitações →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
