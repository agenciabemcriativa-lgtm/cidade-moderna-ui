import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Search, Filter, Download, Calendar, Building2, Scale, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePublicacoesOficiais,
  useAnosPublicacoes,
  tipoLabels,
  situacaoLabels,
  situacaoColors,
  TipoPublicacao,
  SituacaoPublicacao,
} from "@/hooks/usePublicacoesOficiais";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const breadcrumbItems = [
  { label: "Publicações Oficiais" },
];

export default function PublicacoesOficiaisPage() {
  const [search, setSearch] = useState("");
  const [selectedAno, setSelectedAno] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [selectedSituacao, setSelectedSituacao] = useState<string>("");
  const [selectedSecretaria, setSelectedSecretaria] = useState<string>("");

  const { data: anos, isLoading: loadingAnos } = useAnosPublicacoes();
  
  // Query secretarias directly to get IDs
  const { data: secretarias } = useQuery({
    queryKey: ['secretarias-list'],
    queryFn: async () => {
      const { data } = await supabase
        .from('secretarias')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    }
  });
  
  const { data: publicacoes, isLoading } = usePublicacoesOficiais({
    ano: selectedAno ? parseInt(selectedAno) : undefined,
    tipo: selectedTipo as TipoPublicacao || undefined,
    situacao: selectedSituacao as SituacaoPublicacao || undefined,
    secretariaId: selectedSecretaria || undefined,
    search: search || undefined,
    publicado: true,
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedAno("");
    setSelectedTipo("");
    setSelectedSituacao("");
    setSelectedSecretaria("");
  };

  const hasFilters = search || selectedAno || selectedTipo || selectedSituacao || selectedSecretaria;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Publicações Oficiais
              </h1>
            </div>
            <p className="text-white/90 max-w-2xl">
              Acesse leis, decretos, portarias e demais atos normativos do Município de Ipubi.
            </p>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="container mx-auto px-4 mt-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-muted-foreground">
              Este espaço destina-se à publicação oficial de atos administrativos do Município, 
              em atendimento aos princípios da publicidade e da Lei de Acesso à Informação (Lei nº 12.527/2011).
            </AlertDescription>
          </Alert>
        </div>

        {/* Filters Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Filtrar Publicações</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, ementa ou número..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Ano */}
              <Select value={selectedAno || "__all__"} onValueChange={(v) => setSelectedAno(v === "__all__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos os anos</SelectItem>
                  {anos?.map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tipo */}
              <Select value={selectedTipo || "__all__"} onValueChange={(v) => setSelectedTipo(v === "__all__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos os tipos</SelectItem>
                  {Object.entries(tipoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Situação */}
              <Select value={selectedSituacao || "__all__"} onValueChange={(v) => setSelectedSituacao(v === "__all__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas</SelectItem>
                  {Object.entries(situacaoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Secretaria filter + Clear */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1 md:max-w-xs">
                <Select value={selectedSecretaria || "__all__"} onValueChange={(v) => setSelectedSecretaria(v === "__all__" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Secretaria / Órgão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todas as secretarias</SelectItem>
                    {secretarias?.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publicacoes && publicacoes.length > 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">
                {publicacoes.length} publicação(ões) encontrada(s)
              </p>

              {publicacoes.map((pub) => (
                <Card key={pub.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary">
                            {tipoLabels[pub.tipo]}
                          </Badge>
                          <Badge className={situacaoColors[pub.situacao]}>
                            {situacaoLabels[pub.situacao]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Nº {pub.numero}/{pub.ano}
                          </span>
                        </div>

                        <Link
                          to={`/publicacao/${pub.id}`}
                          className="block group"
                        >
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {pub.titulo}
                          </h3>
                        </Link>

                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {pub.ementa}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(pub.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </span>
                          {pub.secretaria_nome && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {pub.secretaria_nome}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/publicacao/${pub.id}`}>
                            Ver detalhes
                          </Link>
                        </Button>
                        {pub.texto_completo_url && (
                          <Button variant="default" size="sm" asChild>
                            <a
                              href={pub.texto_completo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma publicação encontrada</h3>
                <p className="text-muted-foreground">
                  {hasFilters
                    ? "Tente ajustar os filtros de busca."
                    : "Não há publicações cadastradas no momento."}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
