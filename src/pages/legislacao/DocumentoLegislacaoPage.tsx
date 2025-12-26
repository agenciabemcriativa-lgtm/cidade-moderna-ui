import { Link, useParams } from "react-router-dom";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { ExportMetadataButtons } from "@/components/portal/ExportMetadataButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText,
  Download,
  ChevronRight,
  Calendar,
  Target,
  TrendingUp,
  Wallet,
  BookOpen,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDocumentoLegislacao, tipoDocumentoLabels } from "@/hooks/useDocumentosLegislacao";

const tipoIcons: Record<string, React.ReactNode> = {
  ppa: <Target className="h-6 w-6" />,
  ldo: <TrendingUp className="h-6 w-6" />,
  loa: <Wallet className="h-6 w-6" />,
  lei_organica: <BookOpen className="h-6 w-6" />,
  emenda_lei_organica: <BookOpen className="h-6 w-6" />,
  outro: <FileText className="h-6 w-6" />,
};

const tipoColors: Record<string, string> = {
  ppa: "from-blue-600 via-blue-500 to-indigo-500",
  ldo: "from-emerald-600 via-emerald-500 to-teal-500",
  loa: "from-rose-600 via-rose-500 to-pink-500",
  lei_organica: "from-purple-600 via-purple-500 to-violet-500",
  emenda_lei_organica: "from-purple-600 via-purple-500 to-violet-500",
  outro: "from-gray-600 via-gray-500 to-slate-500",
};

export default function DocumentoLegislacaoPage() {
  const { id } = useParams<{ id: string }>();
  const { data: documento, isLoading } = useDocumentoLegislacao(id || "");

  const breadcrumbItems = [
    { label: "Legislação", href: "/legislacao" },
    { label: "Planejamento e Orçamento", href: "/legislacao/planejamento-orcamento" },
    { label: documento?.titulo || "Documento" },
  ];

  const exportData = documento ? {
    titulo: documento.titulo,
    tipo: tipoDocumentoLabels[documento.tipo],
    ano: documento.ano,
    data_publicacao: documento.data_publicacao,
    vigente: documento.vigente ? 'Sim' : 'Não',
    descricao: documento.descricao || '',
    observacoes: documento.observacoes || '',
    arquivo_nome: documento.arquivo_nome,
    arquivo_url: documento.arquivo_url,
  } : {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Documento não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O documento solicitado não existe ou foi removido.
              </p>
              <Link to="/legislacao/planejamento-orcamento">
                <Button>Voltar para Planejamento e Orçamento</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const bgColor = tipoColors[documento.tipo] || tipoColors.outro;
  const icon = tipoIcons[documento.tipo] || tipoIcons.outro;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className={`bg-gradient-to-br ${bgColor} py-12 md:py-16`}>
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-lg text-white">
                {icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-white/20 text-white border-0">
                    {tipoDocumentoLabels[documento.tipo]}
                  </Badge>
                  <Badge className={documento.vigente ? "bg-green-500 text-white border-0" : "bg-white/20 text-white border-0"}>
                    {documento.vigente ? "Vigente" : "Não vigente"}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {documento.titulo}
                </h1>
                {documento.descricao && (
                  <p className="text-white/80 text-lg">
                    {documento.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Informações do Documento */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Informações do Documento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <p className="font-medium">{tipoDocumentoLabels[documento.tipo]}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Ano</p>
                    <p className="font-medium">{documento.ano}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Data de Publicação</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(documento.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={documento.vigente ? "default" : "secondary"}>
                      {documento.vigente ? "Vigente" : "Não vigente"}
                    </Badge>
                  </div>
                </div>

                {documento.observacoes && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm">{documento.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Download Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Arquivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <FileText className="h-12 w-12 mx-auto text-primary mb-3" />
                  <p className="text-sm font-medium mb-1">{documento.arquivo_nome}</p>
                  <p className="text-xs text-muted-foreground">Documento PDF</p>
                </div>
                <a 
                  href={documento.arquivo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                </a>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Exportar metadados em:</p>
                  <ExportMetadataButtons 
                    data={exportData} 
                    filename={documento.titulo} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Voltar */}
          <div className="mt-8">
            <Link 
              to="/legislacao/planejamento-orcamento" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Voltar para Planejamento e Orçamento
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
