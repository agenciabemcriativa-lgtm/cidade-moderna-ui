import { Link, useSearchParams } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { SearchBar } from "@/components/portal/SearchBar";
import { useNoticias } from "@/hooks/useNoticias";
import { useLicitacoes, modalidadeLabels, statusLabels, statusColors } from "@/hooks/useLicitacoes";
import { useDocumentosLegislacao, tipoDocumentoLabels } from "@/hooks/useDocumentosLegislacao";
import { usePublicacoesOficiais, tipoLabels, situacaoLabels, situacaoColors } from "@/hooks/usePublicacoesOficiais";
import { useObrasPublicas } from "@/hooks/useObrasPublicas";
import { useSecretarias } from "@/hooks/useSecretarias";
import { useRelatoriosFiscais } from "@/hooks/useRelatoriosFiscais";
import { 
  Calendar, Search, FileText, Newspaper, X, ScrollText, Building2, 
  HardHat, FileBarChart, ChevronRight, BookOpen 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const statusObraLabels: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  paralisada: "Paralisada",
  planejada: "Planejada",
};

const statusObraColors: Record<string, string> = {
  em_andamento: "bg-blue-600",
  concluida: "bg-green-600",
  paralisada: "bg-red-600",
  planejada: "bg-amber-600",
};

export default function BuscaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("todos");
  
  const { data: noticias, isLoading: loadingNoticias } = useNoticias();
  const { data: licitacoes, isLoading: loadingLicitacoes } = useLicitacoes({ publicadoOnly: true });
  const { data: legislacao, isLoading: loadingLegislacao } = useDocumentosLegislacao();
  const { data: publicacoes, isLoading: loadingPublicacoes } = usePublicacoesOficiais({ publicado: true });
  const { data: obras, isLoading: loadingObras } = useObrasPublicas();
  const { data: secretarias, isLoading: loadingSecretarias } = useSecretarias();
  const { data: relatorios, isLoading: loadingRelatorios } = useRelatoriosFiscais();

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

  const filteredLegislacao = useMemo(() => {
    if (!legislacao || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return legislacao.filter(
      (doc) =>
        doc.titulo.toLowerCase().includes(query) ||
        (doc.descricao?.toLowerCase().includes(query) ?? false)
    );
  }, [legislacao, searchQuery]);

  const filteredPublicacoes = useMemo(() => {
    if (!publicacoes || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return publicacoes.filter(
      (pub) =>
        pub.titulo.toLowerCase().includes(query) ||
        pub.ementa.toLowerCase().includes(query) ||
        pub.numero.toLowerCase().includes(query) ||
        (pub.secretaria_nome?.toLowerCase().includes(query) ?? false)
    );
  }, [publicacoes, searchQuery]);

  const filteredObras = useMemo(() => {
    if (!obras || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return obras.filter(
      (obra) =>
        obra.titulo.toLowerCase().includes(query) ||
        obra.objeto.toLowerCase().includes(query) ||
        (obra.localizacao?.toLowerCase().includes(query) ?? false) ||
        (obra.empresa_executora?.toLowerCase().includes(query) ?? false)
    );
  }, [obras, searchQuery]);

  const filteredSecretarias = useMemo(() => {
    if (!secretarias || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return secretarias.filter(
      (sec) =>
        sec.nome.toLowerCase().includes(query) ||
        (sec.secretario?.nome?.toLowerCase().includes(query) ?? false)
    );
  }, [secretarias, searchQuery]);

  const filteredRelatorios = useMemo(() => {
    if (!relatorios || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return relatorios.filter(
      (rel) =>
        rel.titulo.toLowerCase().includes(query) ||
        (rel.descricao?.toLowerCase().includes(query) ?? false)
    );
  }, [relatorios, searchQuery]);

  const clearSearch = () => {
    setSearchParams({});
  };

  const isLoading = loadingNoticias || loadingLicitacoes || loadingLegislacao || 
    loadingPublicacoes || loadingObras || loadingSecretarias || loadingRelatorios;
  
  const counts = {
    noticias: filteredNoticias.length,
    licitacoes: filteredLicitacoes.length,
    legislacao: filteredLegislacao.length,
    publicacoes: filteredPublicacoes.length,
    obras: filteredObras.length,
    secretarias: filteredSecretarias.length,
    relatorios: filteredRelatorios.length,
  };
  
  const totalResults = Object.values(counts).reduce((a, b) => a + b, 0);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("search") as string;
    if (newQuery?.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AccessibilityBar />
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gradient-to-r from-primary to-primary/90">
          <div className="container">
            <Breadcrumbs items={[{ label: "Busca" }]} variant="light" />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Busca no Portal
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-6">
              Encontre notícias, licitações, legislação, publicações e muito mais
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="O que você está procurando?"
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            {!searchQuery ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Digite algo para buscar
                </h3>
                <p className="text-muted-foreground">
                  Use a barra de busca acima para encontrar conteúdos no portal
                </p>
              </div>
            ) : (
              <>
                {/* Search summary */}
                <div className="mb-6 flex items-center justify-between bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-foreground">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {isLoading ? (
                        "Buscando..."
                      ) : (
                        <>
                          <strong>{totalResults}</strong> resultado{totalResults !== 1 ? "s" : ""} para "<strong>{searchQuery}</strong>"
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
                    <Skeleton className="h-12 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48" />
                      ))}
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
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent mb-6 justify-start">
                      <TabsTrigger value="todos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Todos ({totalResults})
                      </TabsTrigger>
                      {counts.noticias > 0 && (
                        <TabsTrigger value="noticias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <Newspaper className="h-4 w-4 mr-1" /> Notícias ({counts.noticias})
                        </TabsTrigger>
                      )}
                      {counts.licitacoes > 0 && (
                        <TabsTrigger value="licitacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <FileText className="h-4 w-4 mr-1" /> Licitações ({counts.licitacoes})
                        </TabsTrigger>
                      )}
                      {counts.publicacoes > 0 && (
                        <TabsTrigger value="publicacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <ScrollText className="h-4 w-4 mr-1" /> Publicações ({counts.publicacoes})
                        </TabsTrigger>
                      )}
                      {counts.legislacao > 0 && (
                        <TabsTrigger value="legislacao" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <BookOpen className="h-4 w-4 mr-1" /> Legislação ({counts.legislacao})
                        </TabsTrigger>
                      )}
                      {counts.obras > 0 && (
                        <TabsTrigger value="obras" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <HardHat className="h-4 w-4 mr-1" /> Obras ({counts.obras})
                        </TabsTrigger>
                      )}
                      {counts.secretarias > 0 && (
                        <TabsTrigger value="secretarias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <Building2 className="h-4 w-4 mr-1" /> Secretarias ({counts.secretarias})
                        </TabsTrigger>
                      )}
                      {counts.relatorios > 0 && (
                        <TabsTrigger value="relatorios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <FileBarChart className="h-4 w-4 mr-1" /> Relatórios ({counts.relatorios})
                        </TabsTrigger>
                      )}
                    </TabsList>

                    {/* Todos */}
                    <TabsContent value="todos" className="space-y-10">
                      {counts.noticias > 0 && <NoticiasSection noticias={filteredNoticias} searchQuery={searchQuery} />}
                      {counts.licitacoes > 0 && <LicitacoesSection licitacoes={filteredLicitacoes} />}
                      {counts.publicacoes > 0 && <PublicacoesSection publicacoes={filteredPublicacoes} />}
                      {counts.legislacao > 0 && <LegislacaoSection documentos={filteredLegislacao} />}
                      {counts.obras > 0 && <ObrasSection obras={filteredObras} />}
                      {counts.secretarias > 0 && <SecretariasSection secretarias={filteredSecretarias} />}
                      {counts.relatorios > 0 && <RelatoriosSection relatorios={filteredRelatorios} />}
                    </TabsContent>

                    {/* Individual tabs */}
                    <TabsContent value="noticias">
                      <NoticiasSection noticias={filteredNoticias} searchQuery={searchQuery} showAll />
                    </TabsContent>
                    <TabsContent value="licitacoes">
                      <LicitacoesSection licitacoes={filteredLicitacoes} showAll />
                    </TabsContent>
                    <TabsContent value="publicacoes">
                      <PublicacoesSection publicacoes={filteredPublicacoes} showAll />
                    </TabsContent>
                    <TabsContent value="legislacao">
                      <LegislacaoSection documentos={filteredLegislacao} showAll />
                    </TabsContent>
                    <TabsContent value="obras">
                      <ObrasSection obras={filteredObras} showAll />
                    </TabsContent>
                    <TabsContent value="secretarias">
                      <SecretariasSection secretarias={filteredSecretarias} showAll />
                    </TabsContent>
                    <TabsContent value="relatorios">
                      <RelatoriosSection relatorios={filteredRelatorios} showAll />
                    </TabsContent>
                  </Tabs>
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

// Section Components
function NoticiasSection({ noticias, searchQuery, showAll = false }: { noticias: any[]; searchQuery: string; showAll?: boolean }) {
  const items = showAll ? noticias : noticias.slice(0, 6);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Notícias ({noticias.length})</h2>
        </div>
        {!showAll && noticias.length > 6 && (
          <Link to={`/noticias?busca=${encodeURIComponent(searchQuery)}`} className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((noticia) => (
          <Link
            key={noticia.id}
            to={`/noticia/${noticia.slug}`}
            className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-border"
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
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white ${getCategoryColor(noticia.categoryColor)}`}>
                  {noticia.category}
                </span>
                <span className="text-xs text-muted-foreground">{noticia.date}</span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {noticia.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LicitacoesSection({ licitacoes, showAll = false }: { licitacoes: any[]; showAll?: boolean }) {
  const items = showAll ? licitacoes : licitacoes.slice(0, 5);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Licitações ({licitacoes.length})</h2>
        </div>
        {!showAll && licitacoes.length > 5 && (
          <Link to="/licitacoes" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {items.map((licitacao) => (
          <Link
            key={licitacao.id}
            to={`/licitacao/${licitacao.id}`}
            className="block bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/30"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-primary">{licitacao.numero_processo}</span>
                  <Badge variant="secondary" className="text-xs">{modalidadeLabels[licitacao.modalidade]}</Badge>
                  <Badge className={`text-xs text-white ${statusColors[licitacao.status]}`}>{statusLabels[licitacao.status]}</Badge>
                </div>
                <h3 className="font-medium text-foreground line-clamp-1">{licitacao.objeto}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(licitacao.data_abertura), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PublicacoesSection({ publicacoes, showAll = false }: { publicacoes: any[]; showAll?: boolean }) {
  const items = showAll ? publicacoes : publicacoes.slice(0, 5);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Publicações Oficiais ({publicacoes.length})</h2>
        </div>
        {!showAll && publicacoes.length > 5 && (
          <Link to="/publicacoes-oficiais" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {items.map((pub) => (
          <Link
            key={pub.id}
            to={`/publicacao/${pub.id}`}
            className="block bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/30"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant="outline">{tipoLabels[pub.tipo]}</Badge>
                  <span className="text-sm text-muted-foreground">Nº {pub.numero}/{pub.ano}</span>
                  <Badge className={situacaoColors[pub.situacao]}>{situacaoLabels[pub.situacao]}</Badge>
                </div>
                <h3 className="font-medium text-foreground line-clamp-1">{pub.titulo}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(pub.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LegislacaoSection({ documentos, showAll = false }: { documentos: any[]; showAll?: boolean }) {
  const items = showAll ? documentos : documentos.slice(0, 5);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Legislação ({documentos.length})</h2>
        </div>
        {!showAll && documentos.length > 5 && (
          <Link to="/legislacao" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {items.map((doc) => (
          <Link
            key={doc.id}
            to={`/legislacao/documento/${doc.id}`}
            className="block bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/30"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant="outline">{tipoDocumentoLabels[doc.tipo]}</Badge>
                  <span className="text-sm text-muted-foreground">{doc.ano}</span>
                  {doc.vigente && <Badge className="bg-green-600 text-white">Vigente</Badge>}
                </div>
                <h3 className="font-medium text-foreground line-clamp-1">{doc.titulo}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(doc.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ObrasSection({ obras, showAll = false }: { obras: any[]; showAll?: boolean }) {
  const items = showAll ? obras : obras.slice(0, 5);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Obras Públicas ({obras.length})</h2>
        </div>
        {!showAll && obras.length > 5 && (
          <Link to="/transparencia/obras-publicas" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {items.map((obra) => (
          <div
            key={obra.id}
            className="bg-card p-4 rounded-lg shadow-sm border border-border"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {obra.status && (
                    <Badge className={`text-white ${statusObraColors[obra.status] || 'bg-gray-600'}`}>
                      {statusObraLabels[obra.status] || obra.status}
                    </Badge>
                  )}
                  {obra.localizacao && <span className="text-sm text-muted-foreground">{obra.localizacao}</span>}
                </div>
                <h3 className="font-medium text-foreground">{obra.titulo}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{obra.objeto}</p>
              </div>
              {obra.percentual_execucao !== null && (
                <div className="text-right">
                  <span className="text-lg font-semibold text-primary">{obra.percentual_execucao}%</span>
                  <p className="text-xs text-muted-foreground">Execução</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecretariasSection({ secretarias, showAll = false }: { secretarias: any[]; showAll?: boolean }) {
  const items = showAll ? secretarias : secretarias.slice(0, 6);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Secretarias ({secretarias.length})</h2>
        </div>
        {!showAll && secretarias.length > 6 && (
          <Link to="/secretarias" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((sec) => (
          <Link
            key={sec.slug}
            to={`/secretaria/${sec.slug}`}
            className="block bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/30"
          >
            <h3 className="font-semibold text-foreground group-hover:text-primary mb-1">{sec.nome}</h3>
            {sec.secretario?.nome && (
              <p className="text-sm text-muted-foreground">Secretário(a): {sec.secretario.nome}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function RelatoriosSection({ relatorios, showAll = false }: { relatorios: any[]; showAll?: boolean }) {
  const items = showAll ? relatorios : relatorios.slice(0, 5);
  
  const tipoRelatorioLabels: Record<string, string> = {
    rreo: 'RREO',
    rgf: 'RGF',
    parecer_tce: 'Parecer TCE',
    prestacao_contas: 'Prestação de Contas',
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Relatórios Fiscais ({relatorios.length})</h2>
        </div>
        {!showAll && relatorios.length > 5 && (
          <Link to="/transparencia/relatorios" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {items.map((rel) => (
          <a
            key={rel.id}
            href={rel.arquivo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/30"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant="outline">{tipoRelatorioLabels[rel.tipo] || rel.tipo}</Badge>
                  <span className="text-sm text-muted-foreground">{rel.ano}</span>
                </div>
                <h3 className="font-medium text-foreground line-clamp-1">{rel.titulo}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(rel.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
