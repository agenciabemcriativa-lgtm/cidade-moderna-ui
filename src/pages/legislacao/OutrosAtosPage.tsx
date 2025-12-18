import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  ScrollText,
  ClipboardList,
  BookMarked,
  ChevronRight,
  Info
} from "lucide-react";

const breadcrumbItems = [
  { label: "Legislação", href: "/legislacao" },
  { label: "Outros Atos Normativos" },
];

const tiposAtos = [
  {
    titulo: "Decretos",
    descricao: "Atos normativos editados pelo Chefe do Poder Executivo para regulamentar leis",
    icone: ScrollText,
    link: "/publicacoes-oficiais?tipo=decreto",
    cor: "from-blue-500 to-blue-600"
  },
  {
    titulo: "Portarias",
    descricao: "Atos administrativos internos de autoridades públicas",
    icone: FileText,
    link: "/publicacoes-oficiais?tipo=portaria",
    cor: "from-emerald-500 to-emerald-600"
  },
  {
    titulo: "Resoluções",
    descricao: "Deliberações de órgãos colegiados sobre matérias de sua competência",
    icone: ClipboardList,
    link: "/publicacoes-oficiais?tipo=resolucao",
    cor: "from-amber-500 to-amber-600"
  },
  {
    titulo: "Instruções Normativas",
    descricao: "Orientações técnicas e procedimentais para execução de normas",
    icone: BookMarked,
    link: "/publicacoes-oficiais?tipo=instrucao_normativa",
    cor: "from-purple-500 to-purple-600"
  },
  {
    titulo: "Atos Administrativos",
    descricao: "Demais atos da administração pública municipal",
    icone: FileText,
    link: "/publicacoes-oficiais?tipo=ato_administrativo",
    cor: "from-rose-500 to-rose-600"
  },
  {
    titulo: "Editais",
    descricao: "Avisos públicos e convocações oficiais",
    icone: ScrollText,
    link: "/publicacoes-oficiais?tipo=edital",
    cor: "from-cyan-500 to-cyan-600"
  },
];

export default function OutrosAtosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Outros Atos Normativos
                </h1>
                <p className="text-white/80 mt-1">
                  Decretos, Resoluções, Regulamentos e Instruções Normativas
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Aviso Legal */}
          <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Aviso Legal:</strong> Este espaço organiza e facilita o acesso à legislação municipal. 
              Os atos oficiais têm validade conforme publicação nos meios legais competentes.
            </AlertDescription>
          </Alert>

          {/* Descrição */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Sobre os Atos Normativos
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Esta seção organiza o acesso aos diversos tipos de atos normativos produzidos pela Administração Municipal, 
              além das leis. Cada categoria direciona para as publicações oficiais correspondentes no sistema de 
              Publicações Oficiais do Município.
            </p>
          </div>

          {/* Grid de Tipos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiposAtos.map((tipo) => {
              const IconComponent = tipo.icone;
              return (
                <Link key={tipo.titulo} to={tipo.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-border">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tipo.cor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {tipo.titulo}
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {tipo.descricao}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Voltar */}
          <div className="mt-8">
            <Link 
              to="/legislacao" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Voltar para Legislação
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
