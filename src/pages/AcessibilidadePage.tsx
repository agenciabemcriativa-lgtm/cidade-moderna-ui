import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accessibility, 
  ZoomIn, 
  Contrast, 
  Keyboard, 
  MousePointer2,
  Volume2,
  Eye,
  FileText,
  ExternalLink,
  Info
} from "lucide-react";

const recursos = [
  {
    icon: ZoomIn,
    titulo: "Aumentar/Diminuir Fonte",
    descricao: "Utilize os botões A+ e A- na barra de acessibilidade para ajustar o tamanho do texto conforme sua necessidade."
  },
  {
    icon: Contrast,
    titulo: "Alto Contraste",
    descricao: "Ative o modo de alto contraste para melhorar a visibilidade do conteúdo, especialmente útil para pessoas com baixa visão."
  },
  {
    icon: Keyboard,
    titulo: "Navegação por Teclado",
    descricao: "Todo o site pode ser navegado usando apenas o teclado. Use Tab para avançar entre elementos e Enter para ativar links e botões."
  },
  {
    icon: MousePointer2,
    titulo: "Links Descritivos",
    descricao: "Todos os links possuem textos descritivos que indicam claramente o destino ou ação a ser executada."
  },
  {
    icon: Eye,
    titulo: "Textos Alternativos",
    descricao: "Imagens possuem descrições alternativas (alt text) para que leitores de tela possam descrever o conteúdo visual."
  },
  {
    icon: FileText,
    titulo: "Estrutura Semântica",
    descricao: "O site utiliza HTML semântico com cabeçalhos hierárquicos, facilitando a navegação por leitores de tela."
  }
];

const atalhosTeclado = [
  { tecla: "Tab", acao: "Navegar para o próximo elemento interativo" },
  { tecla: "Shift + Tab", acao: "Navegar para o elemento interativo anterior" },
  { tecla: "Enter", acao: "Ativar links e botões" },
  { tecla: "Espaço", acao: "Ativar checkboxes e botões" },
  { tecla: "Setas", acao: "Navegar em menus e listas" },
  { tecla: "Esc", acao: "Fechar menus e modais" },
  { tecla: "Ctrl + (+)", acao: "Aumentar zoom da página" },
  { tecla: "Ctrl + (-)", acao: "Diminuir zoom da página" },
  { tecla: "Ctrl + 0", acao: "Restaurar zoom padrão" },
];

const linksUteis = [
  {
    titulo: "eMAG - Modelo de Acessibilidade em Governo Eletrônico",
    url: "https://emag.governoeletronico.gov.br/",
    descricao: "Diretrizes de acessibilidade para sites do governo brasileiro"
  },
  {
    titulo: "WCAG - Web Content Accessibility Guidelines",
    url: "https://www.w3.org/WAI/WCAG21/quickref/",
    descricao: "Diretrizes internacionais de acessibilidade web"
  },
  {
    titulo: "VLibras",
    url: "https://www.vlibras.gov.br/",
    descricao: "Ferramenta de tradução automática para Língua Brasileira de Sinais"
  }
];

export default function AcessibilidadePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs items={[{ label: "Acessibilidade" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="gov-gradient text-primary-foreground py-12">
          <div className="container">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Accessibility className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Acessibilidade</h1>
                <p className="text-primary-foreground/80 mt-2">
                  Nosso compromisso com a inclusão digital
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introdução */}
        <section className="container py-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Compromisso com a Acessibilidade
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A Prefeitura Municipal de Ipubi está comprometida em tornar seu portal acessível 
                    a todas as pessoas, incluindo aquelas com deficiência. Este site foi desenvolvido 
                    seguindo as diretrizes do <strong>eMAG</strong> (Modelo de Acessibilidade em Governo Eletrônico) 
                    e as recomendações da <strong>WCAG 2.1</strong> (Web Content Accessibility Guidelines), 
                    em conformidade com a <strong>Lei nº 13.146/2015</strong> (Lei Brasileira de Inclusão) 
                    e o <strong>Decreto nº 5.296/2004</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recursos de Acessibilidade */}
        <section className="bg-muted/30 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" />
              Recursos de Acessibilidade
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recursos.map((recurso, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <recurso.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {recurso.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {recurso.descricao}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Atalhos de Teclado */}
        <section className="container py-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-primary" />
            Atalhos de Teclado
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Tecla(s)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {atalhosTeclado.map((atalho, index) => (
                      <tr key={index} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <kbd className="px-3 py-1.5 bg-muted rounded-md text-sm font-mono font-semibold text-foreground">
                            {atalho.tecla}
                          </kbd>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {atalho.acao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Links Úteis */}
        <section className="bg-muted/30 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <ExternalLink className="w-6 h-6 text-primary" />
              Links Úteis sobre Acessibilidade
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {linksUteis.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.titulo}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {link.descricao}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contato para Acessibilidade */}
        <section className="container py-12">
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Dúvidas ou Sugestões?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Se você encontrar alguma barreira de acessibilidade neste portal ou tiver 
                    sugestões para melhorar a experiência de navegação, entre em contato conosco. 
                    Sua opinião é fundamental para continuarmos melhorando.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Telefone:</strong> (87) 3881-1156
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">E-mail:</strong> contato@ipubi.pe.gov.br
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
