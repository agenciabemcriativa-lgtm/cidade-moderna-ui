import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Printer,
  Share2,
  Building2,
  DollarSign,
  Users,
  ClipboardList,
  Scale,
  MessageSquare,
  Timer,
  Search,
} from "lucide-react";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Footer } from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartaServico } from "@/hooks/useCartaServicos";
import { toast } from "sonner";

const formaPrestacaoLabels: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Presencial e Online",
};

export default function CartaServicoDetalhePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: servico, isLoading } = useCartaServico(slug || "");

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: servico?.titulo,
          text: servico?.descricao,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!servico) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Serviço não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O serviço que você procura não existe ou não está disponível.
              </p>
              <Button onClick={() => navigate("/carta-de-servicos")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Carta de Serviços
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Carta de Serviços", href: "/carta-de-servicos" },
    { label: servico.titulo },
  ];

  return (
    <>
      <Helmet>
        <title>{servico.titulo} - Carta de Serviços - Prefeitura de Ipubi</title>
        <meta name="description" content={servico.descricao} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background print:bg-white">
        <div className="print:hidden">
          <AccessibilityBar />
          <TopBar />
          <Header />
          <div className="bg-gradient-to-r from-primary to-primary/90">
            <div className="container">
              <Breadcrumbs items={breadcrumbItems} variant="light" />
            </div>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Header do Serviço */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 print:hidden">
                <Button variant="ghost" size="sm" onClick={() => navigate("/carta-de-servicos")}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline">{servico.categoria}</Badge>
                <Badge variant={servico.gratuito ? "default" : "secondary"}>
                  {servico.gratuito ? "Gratuito" : "Serviço Pago"}
                </Badge>
                <Badge variant="outline">
                  {formaPrestacaoLabels[servico.forma_prestacao] || servico.forma_prestacao}
                </Badge>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold mb-3">{servico.titulo}</h1>
              <p className="text-muted-foreground text-lg">{servico.descricao}</p>
            </div>

            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Requisitos e Documentos */}
              {(servico.requisitos || servico.documentos_necessarios) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Requisitos e Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {servico.requisitos && (
                      <div>
                        <h4 className="font-semibold mb-2">Requisitos</h4>
                        <div className="text-muted-foreground whitespace-pre-wrap">
                          {servico.requisitos}
                        </div>
                      </div>
                    )}
                    {servico.documentos_necessarios && (
                      <div>
                        <h4 className="font-semibold mb-2">Documentos Necessários</h4>
                        <div className="text-muted-foreground whitespace-pre-wrap">
                          {servico.documentos_necessarios}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Etapas do Atendimento */}
              {servico.etapas_atendimento && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Etapas do Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.etapas_atendimento}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Canal de Acesso */}
              {servico.canal_acesso && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Como Acessar o Serviço
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.canal_acesso}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Custos e Taxas */}
              {!servico.gratuito && servico.custos_taxas && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Custos e Taxas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.custos_taxas}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prioridades de Atendimento */}
              {servico.prioridades_atendimento && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Prioridades de Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.prioridades_atendimento}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Consulta de Andamento */}
              {servico.mecanismo_consulta && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Como Consultar Andamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.mecanismo_consulta}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Manifestações */}
              {servico.procedimento_manifestacao && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Como Fazer Manifestações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.procedimento_manifestacao}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Base Legal */}
              {servico.base_legal && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      Base Legal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {servico.base_legal}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-6">
              {/* Prazos */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Prazos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servico.prazo_maximo && (
                    <div>
                      <span className="text-sm text-muted-foreground">Prazo máximo:</span>
                      <p className="font-semibold">{servico.prazo_maximo}</p>
                    </div>
                  )}
                  {servico.prazo_medio && (
                    <div>
                      <span className="text-sm text-muted-foreground">Prazo médio:</span>
                      <p className="font-semibold">{servico.prazo_medio}</p>
                    </div>
                  )}
                  {servico.tempo_espera_estimado && (
                    <div>
                      <span className="text-sm text-muted-foreground">Tempo de espera:</span>
                      <p className="font-semibold">{servico.tempo_espera_estimado}</p>
                    </div>
                  )}
                  {!servico.prazo_maximo && !servico.prazo_medio && !servico.tempo_espera_estimado && (
                    <p className="text-muted-foreground text-sm">
                      Consulte o órgão responsável para informações sobre prazos.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Local e Horário */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Onde e Quando
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {servico.local_atendimento && (
                    <div>
                      <span className="text-sm text-muted-foreground">Local:</span>
                      <p className="text-sm">{servico.local_atendimento}</p>
                    </div>
                  )}
                  {servico.horario_atendimento && (
                    <div>
                      <span className="text-sm text-muted-foreground">Horário:</span>
                      <p className="text-sm">{servico.horario_atendimento}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servico.orgao_responsavel && (
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{servico.orgao_responsavel}</span>
                    </div>
                  )}
                  {servico.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${servico.telefone}`} className="text-sm text-primary hover:underline">
                        {servico.telefone}
                      </a>
                    </div>
                  )}
                  {servico.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${servico.email}`} className="text-sm text-primary hover:underline">
                        {servico.email}
                      </a>
                    </div>
                  )}
                  {servico.site_url && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={servico.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Acessar site
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Link para e-SIC */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Tem dúvidas ou sugestões?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Utilize nosso Sistema de Informação ao Cidadão
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/transparencia/e-sic">Acessar e-SIC</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Última atualização */}
          {servico.updated_at && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Última atualização:{" "}
              {new Date(servico.updated_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
        </main>

        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </>
  );
}
