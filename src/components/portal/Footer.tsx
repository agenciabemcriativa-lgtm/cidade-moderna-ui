import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import brasaoIpubiBranco from "@/assets/brasao-ipubi-branco.png";

const footerLinks = {
  institucional: [
    { label: "Sobre a Prefeitura", href: "#sobre", isLink: false },
    { label: "Prefeito e Vice", href: "#prefeito", isLink: false },
    { label: "Secretarias", href: "/secretarias", isLink: true },
    { label: "Notícias", href: "/noticias", isLink: true },
    { label: "Legislação Municipal", href: "#legislacao", isLink: false },
  ],
  servicos: [
    { label: "Portal da Transparência", href: "#transparencia" },
    { label: "Ouvidoria", href: "#ouvidoria" },
    { label: "e-SIC", href: "#esic" },
    { label: "Licitações", href: "#licitacoes" },
    { label: "Concursos", href: "#concursos" },
  ],
  cidadao: [
    { label: "IPTU e Tributos", href: "#tributos" },
    { label: "Alvará Online", href: "#alvara" },
    { label: "Nota Fiscal", href: "#nfe" },
    { label: "Agendamento", href: "#agendamento" },
    { label: "Certidões", href: "#certidoes" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#facebook", label: "Facebook" },
  { icon: Instagram, href: "#instagram", label: "Instagram" },
  { icon: Youtube, href: "#youtube", label: "YouTube" },
  { icon: Twitter, href: "#twitter", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="gov-gradient text-primary-foreground" id="contato">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={brasaoIpubiBranco} 
                alt="Brasão de Ipubi" 
                className="h-16 w-auto object-contain"
              />
              <div>
                <h3 className="text-lg font-bold">PREFEITURA MUNICIPAL</h3>
                <p className="text-sm text-primary-foreground/80">Ipubi - Pernambuco</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Praça Central, nº 100 - Centro<br />CEP: 00000-000</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>(00) 0000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>contato@prefeitura.gov.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>Segunda a Sexta: 08h às 17h</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Institucional</h4>
            <ul className="space-y-2">
              {footerLinks.institucional.map((link) => (
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

          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Serviços</h4>
            <ul className="space-y-2">
              {footerLinks.servicos.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-highlight">Cidadão</h4>
            <ul className="space-y-2">
              {footerLinks.cidadao.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-highlight transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Social & Gov Links */}
      <div className="border-t border-primary-foreground/20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Siga-nos:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-highlight hover:text-highlight-foreground flex items-center justify-center transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#acessibilidade" className="hover:text-highlight transition-colors">Acessibilidade</a>
              <a href="#lgpd" className="hover:text-highlight transition-colors">LGPD</a>
              <a href="#mapa-site" className="hover:text-highlight transition-colors">Mapa do Site</a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-foreground/20">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/80">
            <p>© 2024 Prefeitura Municipal de Cidade Exemplo. Todos os direitos reservados.</p>
            <p>Desenvolvido com transparência e compromisso público.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
