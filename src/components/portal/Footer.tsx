import { 
  Facebook, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import brasaoIpubiBranco from "@/assets/brasao-ipubi-branco.png";

const footerLinks = {
  cidade: [
    { label: "Cultura", href: "#cultura" },
    { label: "História", href: "#historia" },
    { label: "Símbolos oficiais", href: "#simbolos" },
    { label: "Dados demográficos", href: "#dados" },
    { label: "Fotos", href: "#fotos" },
  ],
  governo: [
    { label: "Gabinete", href: "#gabinete" },
    { label: "O Prefeito", href: "#prefeito" },
    { label: "O Vice Prefeito", href: "#vice" },
    { label: "Obras e Ações", href: "#obras" },
    { label: "Expediente", href: "#expediente" },
    { label: "Perguntas Frequentes", href: "#faq" },
    { label: "Fale Conosco", href: "/contato", isLink: true },
  ],
  secretarias: [
    { label: "Administração", href: "/secretaria/administracao", isLink: true },
    { label: "Desenvolvimento Rural", href: "/secretaria/desenvolvimento-rural", isLink: true },
    { label: "Desenvolvimento Social", href: "/secretaria/desenvolvimento-social", isLink: true },
    { label: "Educação", href: "/secretaria/educacao", isLink: true },
    { label: "Obras e Urbanismo", href: "/secretaria/obras-urbanismo", isLink: true },
    { label: "Saúde", href: "/secretaria/saude", isLink: true },
  ],
  imprensa: [
    { label: "Notícias", href: "/noticias", isLink: true },
    { label: "Galerias de Fotos", href: "#galerias" },
  ],
  linksUteis: [
    { label: "Ouvidoria", href: "#ouvidoria" },
    { label: "LGPD", href: "#lgpd" },
    { label: "Política de Privacidade", href: "#privacidade" },
  ],
  servicos: [
    { label: "Portal da Transparência", href: "https://www.ipubi.pe.gov.br/portaldatransparencia/", external: true },
    { label: "Serviço de Informação ao Cidadão", href: "https://www.ipubi.pe.gov.br/esic/", external: true },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#facebook", label: "Facebook" },
  { icon: Instagram, href: "#instagram", label: "Instagram" },
  { icon: Youtube, href: "#youtube", label: "YouTube" },
];

interface FooterProps {
  id?: string;
}

export function Footer({ id }: FooterProps) {
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
          {/* Cidade */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Cidade</h4>
            <ul className="space-y-2">
              {footerLinks.cidade.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Governo */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Governo</h4>
            <ul className="space-y-2">
              {footerLinks.governo.map((link) => (
                <li key={link.label}>
                  {link.isLink ? (
                    <Link to={link.href} className="text-sm hover:text-highlight transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Secretarias */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Secretarias</h4>
            <ul className="space-y-2">
              {footerLinks.secretarias.map((link) => (
                <li key={link.label}>
                  {link.isLink ? (
                    <Link to={link.href} className="text-sm hover:text-highlight transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Imprensa */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Imprensa</h4>
            <ul className="space-y-2">
              {footerLinks.imprensa.map((link) => (
                <li key={link.label}>
                  {link.isLink ? (
                    <Link to={link.href} className="text-sm hover:text-highlight transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            
            <h4 className="font-bold uppercase tracking-wide mb-4 mt-6 text-highlight">Links Úteis</h4>
            <ul className="space-y-2">
              {footerLinks.linksUteis.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Serviços</h4>
            <ul className="space-y-2">
              {footerLinks.servicos.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm hover:text-highlight transition-colors"
                  >
                    {link.label}
                  </a>
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
