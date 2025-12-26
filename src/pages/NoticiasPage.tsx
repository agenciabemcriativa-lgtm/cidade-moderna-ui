import { Link, useSearchParams } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { useNoticias } from "@/hooks/useNoticias";
import { Calendar, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useEffect } from "react";
import { ListPagination } from "@/components/ui/list-pagination";
import { usePagination } from "@/hooks/usePagination";

// Mapeamento de cores para garantir que o Tailwind inclua as classes
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

export default function NoticiasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("busca") || "";
  const { data: noticias, isLoading } = useNoticias();

  const filteredNoticias = useMemo(() => {
    if (!noticias || !searchQuery) return noticias;
    const query = searchQuery.toLowerCase();
    return noticias.filter(
      (noticia) =>
        noticia.title.toLowerCase().includes(query) ||
        noticia.summary.toLowerCase().includes(query) ||
        noticia.category.toLowerCase().includes(query)
    );
  }, [noticias, searchQuery]);

  const pagination = usePagination(filteredNoticias, { initialItemsPerPage: 12 });

  // Reset to page 1 when search changes
  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs items={[{ label: "Notícias" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Notícias
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Acompanhe as últimas notícias e eventos do município
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            {/* Search indicator */}
            {searchQuery && (
              <div className="mb-8 flex items-center justify-between bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-foreground">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span>
                    Resultados para: <strong>"{searchQuery}"</strong>
                    {!isLoading && (
                      <span className="text-muted-foreground ml-2">
                        ({filteredNoticias?.length || 0} encontrado{filteredNoticias?.length !== 1 ? "s" : ""})
                      </span>
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
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden shadow-sm">
                    <Skeleton className="aspect-video" />
                    <div className="p-5">
                      <Skeleton className="h-4 w-24 mb-3" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNoticias?.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma notícia encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos resultados para "{searchQuery}"
                </p>
                <button
                  onClick={clearSearch}
                  className="text-primary hover:underline"
                >
                  Ver todas as notícias
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagination.paginatedItems?.map((noticia) => (
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
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-full text-white shadow-sm ${getCategoryColor(noticia.categoryColor)}`}
                          >
                            {noticia.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {noticia.date}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {noticia.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {noticia.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {filteredNoticias && filteredNoticias.length > 0 && (
                  <ListPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={pagination.setCurrentPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                    isFirstPage={pagination.isFirstPage}
                    isLastPage={pagination.isLastPage}
                    itemLabel="notícia"
                    isTransitioning={pagination.isTransitioning}
                  />
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
