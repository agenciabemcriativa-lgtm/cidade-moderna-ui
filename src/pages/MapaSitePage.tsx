import { Link } from "react-router-dom";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { 
  Home, 
  Building2, 
  Users, 
  Newspaper, 
  FileText, 
  Phone, 
  Search,
  ChevronRight,
  ExternalLink,
  MapIcon
} from "lucide-react";
import { useSecretarias } from "@/hooks/useSecretarias";
import { useGovernoItens } from "@/hooks/useGovernoItens";
import { useMunicipioItens } from "@/hooks/useMunicipioItens";
import { useAtendimentoItens } from "@/hooks/useAtendimentoItens";

interface SitemapSection {
  title: string;
  icon: React.ReactNode;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
    children?: Array<{ label: string; href: string; external?: boolean }>;
  }>;
}

export default function MapaSitePage() {
  const { data: secretarias = [] } = useSecretarias();
  const { data: governoItens = [] } = useGovernoItens();
  const { data: municipioItens = [] } = useMunicipioItens();
  const { data: atendimentoItens = [] } = useAtendimentoItens();

  const sections: SitemapSection[] = [
    {
      title: "Principal",
      icon: <Home className="w-5 h-5" />,
      links: [
        { label: "Página Inicial", href: "/" },
        { label: "Busca", href: "/busca" },
        { label: "Contato", href: "/contato" },
        { label: "Acessibilidade", href: "/acessibilidade" },
        { label: "Mapa do Site", href: "/mapa-do-site" },
      ],
    },
    {
      title: "O Governo",
      icon: <Building2 className="w-5 h-5" />,
      links: governoItens.map((item) => ({
        label: item.titulo,
        href: item.slug === "estrutura-organizacional" 
          ? "/governo/estrutura-organizacional"
          : item.slug === "organograma"
          ? "/governo/organograma"
          : `/governo/${item.slug}`,
      })),
    },
    {
      title: "Município",
      icon: <MapIcon className="w-5 h-5" />,
      links: municipioItens.map((item) => ({
        label: item.titulo,
        href: `/municipio/${item.slug}`,
      })),
    },
    {
      title: "Secretarias",
      icon: <Users className="w-5 h-5" />,
      links: [
        { label: "Todas as Secretarias", href: "/secretarias" },
        ...secretarias.map((sec) => ({
          label: sec.nome,
          href: `/secretaria/${sec.slug}`,
        })),
      ],
    },
    {
      title: "Notícias",
      icon: <Newspaper className="w-5 h-5" />,
      links: [
        { label: "Todas as Notícias", href: "/noticias" },
      ],
    },
    {
      title: "Licitações",
      icon: <FileText className="w-5 h-5" />,
      links: [
        { label: "Licitações", href: "/licitacoes" },
      ],
    },
    {
      title: "Atendimento",
      icon: <Phone className="w-5 h-5" />,
      links: [
        { label: "Canais de Atendimento", href: "/atendimento" },
        ...atendimentoItens.map((item) => ({
          label: item.titulo,
          href: `/atendimento/${item.slug}`,
        })),
      ],
    },
    {
      title: "Serviços Online",
      icon: <ExternalLink className="w-5 h-5" />,
      links: [
        { label: "Portal da Transparência", href: "https://www.ipubi.pe.gov.br/portaldatransparencia/", external: true },
        { label: "Contra-Cheque Online", href: "https://mdinfor.com.br/espelhorh/contracheque/index.php", external: true },
        { label: "Nota Fiscal Eletrônica", href: "http://45.163.4.114:5661/issweb/paginas/login", external: true },
        { label: "e-SIC", href: "/transparencia/esic", external: false },
        { label: "Publicações Oficiais", href: "https://www.ipubi.pe.gov.br/publicacoes-oficiais/", external: true },
      ],
    },
  ];

  const renderLink = (link: { label: string; href: string; external?: boolean }) => {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1"
        >
          <ChevronRight className="w-4 h-4 text-primary/50" />
          {link.label}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    }
    return (
      <Link
        to={link.href}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1"
      >
        <ChevronRight className="w-4 h-4 text-primary/50" />
        {link.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gradient-to-r from-primary to-primary/90">
          <div className="container">
            <Breadcrumbs items={[{ label: "Mapa do Site" }]} variant="light" />
          </div>
        </div>

        {/* Hero Section */}
        <section className="gov-gradient text-primary-foreground py-12">
          <div className="container">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Mapa do Site</h1>
                <p className="text-primary-foreground/80 mt-2">
                  Navegue por todas as páginas e seções do portal
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sitemap Grid */}
        <section className="container py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div 
                key={section.title}
                className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-1">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      {renderLink(link)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
