import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Search, Clock, MapPin, Phone, Mail, ExternalLink, FileText, Filter, CheckCircle, AlertCircle } from "lucide-react";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Footer } from "@/components/portal/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartaServicos, useCartaServicoCategorias } from "@/hooks/useCartaServicos";

const formaPrestacaoLabels: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Presencial e Online",
};

export default function CartaServicosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all");
  const [formaPrestacaoFilter, setFormaPrestacaoFilter] = useState<string>("all");

  const { data: servicos, isLoading } = useCartaServicos();
  const { data: categorias } = useCartaServicoCategorias();

  const filteredServicos = useMemo(() => {
    if (!servicos) return [];

    return servicos.filter((servico) => {
      const matchesSearch =
        searchTerm === "" ||
        servico.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.categoria.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategoria =
        categoriaFilter === "all" || servico.categoria === categoriaFilter;

      const matchesFormaPrestacao =
        formaPrestacaoFilter === "all" || servico.forma_prestacao === formaPrestacaoFilter;

      return matchesSearch && matchesCategoria && matchesFormaPrestacao;
    });
  }, [servicos, searchTerm, categoriaFilter, formaPrestacaoFilter]);

  const servicosPorCategoria = useMemo(() => {
    const grouped: Record<string, typeof filteredServicos> = {};
    filteredServicos.forEach((servico) => {
      if (!grouped[servico.categoria]) {
        grouped[servico.categoria] = [];
      }
      grouped[servico.categoria].push(servico);
    });
    return grouped;
  }, [filteredServicos]);

  const breadcrumbItems = [{ label: "Carta de Serviços" }];

  return (
    <>
      <Helmet>
        <title>Carta de Serviços ao Cidadão - Prefeitura de Ipubi</title>
        <meta
          name="description"
          content="Conheça os serviços oferecidos pela Prefeitura de Ipubi, requisitos, prazos e canais de atendimento conforme Lei 13.460/2017."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <Breadcrumbs items={breadcrumbItems} />

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Carta de Serviços ao Cidadão</h1>
            </div>
            <p className="text-lg opacity-90 max-w-3xl">
              A Carta de Serviços é um documento que informa aos cidadãos os serviços prestados
              pelo município, como acessá-los e quais são os compromissos e padrões de qualidade
              do atendimento, conforme estabelecido pela Lei Federal nº 13.460/2017.
            </p>
          </div>

          {/* Informações sobre a Lei */}
          <Card className="mb-8 border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">Sobre a Lei 13.460/2017</h2>
                  <p className="text-muted-foreground">
                    Esta lei estabelece normas básicas para participação, proteção e defesa dos
                    direitos do usuário dos serviços públicos prestados direta ou indiretamente
                    pela administração pública. A Carta de Serviços é um instrumento de
                    transparência e cidadania que garante ao usuário o direito de conhecer os
                    serviços públicos disponíveis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtros */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Filtrar Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar serviço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categorias?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={formaPrestacaoFilter} onValueChange={setFormaPrestacaoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Forma de prestação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as formas</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hibrido">Presencial e Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Serviços */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-96" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-32 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredServicos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou a busca para encontrar serviços.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(servicosPorCategoria)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([categoria, servicosCategoria]) => (
                  <section key={categoria}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full" />
                      {categoria}
                      <Badge variant="secondary" className="ml-2">
                        {servicosCategoria.length} serviço(s)
                      </Badge>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {servicosCategoria.map((servico) => (
                        <Link key={servico.id} to={`/carta-de-servicos/${servico.slug}`}>
                          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                                  {servico.titulo}
                                </CardTitle>
                                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <Badge
                                  variant={servico.gratuito ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {servico.gratuito ? "Gratuito" : "Pago"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {formaPrestacaoLabels[servico.forma_prestacao] || servico.forma_prestacao}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <CardDescription className="line-clamp-3 mb-3">
                                {servico.descricao}
                              </CardDescription>

                              <div className="space-y-1 text-xs text-muted-foreground">
                                {servico.prazo_maximo && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Prazo: {servico.prazo_maximo}</span>
                                  </div>
                                )}
                                {servico.local_atendimento && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="line-clamp-1">{servico.local_atendimento}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          )}

          {/* Informações de Contato e Manifestação */}
          <Card className="mt-12 bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Seus Direitos
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Atendimento adequado e em tempo razoável</li>
                    <li>• Informação clara sobre os serviços</li>
                    <li>• Proteção de seus dados pessoais</li>
                    <li>• Acompanhamento de suas solicitações</li>
                    <li>• Apresentar manifestações (sugestões, reclamações, elogios)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Canais de Manifestação
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Link to="/transparencia/e-sic" className="text-primary hover:underline">
                        e-SIC - Sistema de Informação ao Cidadão
                      </Link>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ouvidoria Municipal - Prefeitura de Ipubi
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      (87) 3881-1156
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}
