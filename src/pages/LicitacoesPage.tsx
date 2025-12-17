import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Calendar, Building2, ExternalLink, Filter, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useLicitacoes,
  useAnosLicitacoes,
  modalidadeLabels,
  statusLabels,
  statusColors,
  ModalidadeLicitacao,
  StatusLicitacao,
} from "@/hooks/useLicitacoes";
import { Skeleton } from "@/components/ui/skeleton";

export default function LicitacoesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("busca") || "");
  const [ano, setAno] = useState<string>(searchParams.get("ano") || "");
  const [modalidade, setModalidade] = useState<string>(searchParams.get("modalidade") || "");
  const [status, setStatus] = useState<string>(searchParams.get("status") || "");

  const { data: anos, isLoading: anosLoading } = useAnosLicitacoes();
  const { data: licitacoes, isLoading } = useLicitacoes({
    ano: ano ? parseInt(ano) : undefined,
    modalidade: modalidade as ModalidadeLicitacao || undefined,
    status: status as StatusLicitacao || undefined,
    busca: searchTerm || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("busca", searchTerm);
    if (ano) params.set("ano", ano);
    if (modalidade) params.set("modalidade", modalidade);
    if (status) params.set("status", status);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAno("");
    setModalidade("");
    setStatus("");
    setSearchParams({});
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs items={[{ label: "Licitações" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Licitações Públicas</h1>
            <p className="text-primary-foreground/80 max-w-2xl">
              Acesse todas as informações sobre processos licitatórios do município. 
              Transparência e acesso à informação garantidos conforme Lei nº 14.133/2021.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-muted/50 py-6 border-b border-border">
          <div className="container">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por número do processo ou objeto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-background"
                  />
                </div>
                <Button type="submit" className="h-12 px-6">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                <Filter className="w-5 h-5 text-muted-foreground" />
                
                <Select value={ano} onValueChange={setAno}>
                  <SelectTrigger className="w-[140px] bg-background">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {anos?.map((a) => (
                      <SelectItem key={a} value={String(a)}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={modalidade} onValueChange={setModalidade}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue placeholder="Modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as modalidades</SelectItem>
                    {Object.entries(modalidadeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[160px] bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchTerm || ano || modalidade || status) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            {isLoading ? (
              <div className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/3 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : licitacoes && licitacoes.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-4">
                  {licitacoes.length} processo(s) encontrado(s)
                </p>
                <div className="grid gap-4">
                  {licitacoes.map((licitacao) => (
                    <Link key={licitacao.id} to={`/licitacao/${licitacao.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`${statusColors[licitacao.status]} text-white`}>
                                  {statusLabels[licitacao.status]}
                                </Badge>
                                <Badge variant="outline">
                                  {modalidadeLabels[licitacao.modalidade]}
                                </Badge>
                                <span className="text-sm font-mono text-muted-foreground">
                                  {licitacao.numero_processo}
                                </span>
                              </div>
                              
                              <h3 className="font-semibold text-lg line-clamp-2">
                                {licitacao.objeto}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(licitacao.data_abertura), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                                {licitacao.secretaria_nome && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {licitacao.secretaria_nome}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {licitacao.valor_estimado && (
                                <p className="font-semibold text-lg text-primary">
                                  {formatCurrency(licitacao.valor_estimado)}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                Ano: {licitacao.ano}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma licitação encontrada</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou realizar uma nova busca.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Legal Notice */}
        <section className="bg-muted/30 py-6 border-t border-border">
          <div className="container">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                As informações detalhadas dos processos licitatórios e financeiros são disponibilizadas 
                por meio do sistema oficial de gestão utilizado pelo Município, alimentado pelos setores responsáveis.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
