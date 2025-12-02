import { Phone, Mail, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "Ouvidoria", href: "#ouvidoria" },
  { label: "Portal da Transparência", href: "#transparencia" },
  { label: "Licitações", href: "#licitacoes" },
  { label: "e-SIC", href: "#esic" },
];

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container flex flex-col md:flex-row items-center justify-between py-2 text-xs md:text-sm">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <a href="tel:+5500000000000" className="flex items-center gap-1 hover:text-highlight transition-colors">
            <Phone className="w-3 h-3" />
            <span>(00) 0000-0000</span>
          </a>
          <a href="mailto:contato@prefeitura.gov.br" className="flex items-center gap-1 hover:text-highlight transition-colors">
            <Mail className="w-3 h-3" />
            <span>contato@prefeitura.gov.br</span>
          </a>
        </div>
        <nav className="flex items-center gap-1 md:gap-4 flex-wrap justify-center">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-highlight hover:text-highlight-foreground transition-all duration-200 font-medium"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
