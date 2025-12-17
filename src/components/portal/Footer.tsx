import { 
  Facebook, 
  Instagram, 
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import brasaoIpubiBranco from "@/assets/brasao-ipubi-branco.png";
import { useSecretarias } from "@/hooks/useSecretarias";
import { useGovernoItens } from "@/hooks/useGovernoItens";
import { useMunicipioItens } from "@/hooks/useMunicipioItens";

const servicosLinks = [
  { label: "Portal da Transparência", href: "https://www.ipubi.pe.gov.br/portaldatransparencia/", external: true },
  { label: "Licitações", href: "/licitacoes", external: false },
  { label: "Contra-Cheque Online", href: "https://mdinfor.com.br/espelhorh/contracheque/index.php", external: true },
  { label: "Nota Fiscal Eletrônica", href: "http://45.163.4.114:5661/issweb/paginas/login;jsessionid=q6hYi6fhOMbbSmqWX4Em7sP9.undefined", external: true },
  { label: "e-SIC", href: "https://www.ipubi.pe.gov.br/esic/", external: true },
];

const quickLinks = [
  { label: "Notícias", href: "/noticias", external: false },
  { label: "Legislação", href: "/legislacao", external: false },
  { label: "Publicações", href: "https://www.ipubi.pe.gov.br/publicacoes-oficiais/", external: true },
  { label: "Contato", href: "/contato", external: false },
  { label: "Acessibilidade", href: "/acessibilidade", external: false },
  { label: "Mapa do Site", href: "/mapa-do-site", external: false },
];

const socialLinks = [
  { icon: Facebook, href: "#facebook", label: "Facebook" },
  { icon: Instagram, href: "#instagram", label: "Instagram" },
];

interface FooterProps {
  id?: string;
}

export function Footer({ id }: FooterProps) {
  const { data: secretarias = [] } = useSecretarias();
  const { data: governoItens = [] } = useGovernoItens();
  const { data: municipioItens = [] } = useMunicipioItens();

  const renderLink = (link: { label: string; href: string; external?: boolean }) => {
    if (link.external) {
      return (
        <a 
          href={link.href} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:text-highlight transition-colors flex items-center gap-1"
        >
          {link.label}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    }
    return (
      <Link to={link.href} className="text-sm hover:text-highlight transition-colors">
        {link.label}
      </Link>
    );
  };

  return (
    <footer id={id} className="gov-gradient text-primary-foreground">
      {/* Contact Info Bar */}
      <div className="bg-primary/80">
        <div className="container py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm">
                  Praça Professor Agamanon Magalhães, 56, Centro,<br />
                  Ipubi-PE - CEP: 56.260-000
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm">
                  Horário de Atendimento de Segunda a sexta-feira, das 8h às 12h e das 14h às 17h
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm">Telefone:</p>
                <p className="text-xl font-bold">(87) 3881-1156</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* O Governo */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">O Governo</h4>
            <ul className="space-y-2">
              {governoItens.map((item) => (
                <li key={item.slug}>
                  <Link 
                    to={`/governo/${item.slug}`} 
                    className="text-sm hover:text-highlight transition-colors"
                  >
                    {item.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Município */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Município</h4>
            <ul className="space-y-2">
              {municipioItens.map((item) => (
                <li key={item.slug}>
                  <Link 
                    to={`/municipio/${item.slug}`} 
                    className="text-sm hover:text-highlight transition-colors"
                  >
                    {item.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secretarias */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Secretarias</h4>
            <ul className="space-y-2">
              {secretarias.slice(0, 6).map((item) => (
                <li key={item.slug}>
                  <Link 
                    to={`/secretaria/${item.slug}`} 
                    className="text-sm hover:text-highlight transition-colors"
                  >
                    {item.nome}
                  </Link>
                </li>
              ))}
              {secretarias.length > 6 && (
                <li>
                  <Link 
                    to="/secretarias" 
                    className="text-sm hover:text-highlight transition-colors font-semibold"
                  >
                    Ver todas →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Serviços ao Cidadão */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Serviços</h4>
            <ul className="space-y-2">
              {servicosLinks.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Logo & Social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={brasaoIpubiBranco} 
                alt="Brasão de Ipubi" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-highlight hover:text-highlight-foreground flex items-center justify-center transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            {/* Webmail */}
            <a
              href="https://webmail.ipubi.pe.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-4 text-sm hover:text-highlight transition-colors"
              aria-label="Webmail"
            >
              <div className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-highlight hover:text-highlight-foreground flex items-center justify-center transition-all duration-200">
                <Mail className="w-4 h-4" />
              </div>
              <span>Webmail</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-foreground/20">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/80">
            <p>© 2025 Prefeitura Municipal de Ipubi. Todos os direitos reservados.</p>
            <p>Desenvolvido com transparência e compromisso público.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
