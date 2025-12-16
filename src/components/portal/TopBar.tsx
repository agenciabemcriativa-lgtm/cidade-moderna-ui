import { Phone, Mail, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "Portal da Transparência", href: "https://www.ipubi.pe.gov.br/portaldatransparencia/" },
  { label: "e-SIC", href: "https://www.ipubi.pe.gov.br/esic/" },
];

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container flex flex-col md:flex-row items-center justify-between py-2 text-xs md:text-sm">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <a href="tel:+558738811156" className="flex items-center gap-1 hover:text-highlight transition-colors">
            <Phone className="w-3 h-3" />
            <span>(87) 3881-1156</span>
          </a>
          <a href="mailto:contato@ipubi.pe.gov.br" className="flex items-center gap-1 hover:text-highlight transition-colors">
            <Mail className="w-3 h-3" />
            <span>contato@ipubi.pe.gov.br</span>
          </a>
        </div>
        <nav className="flex items-center gap-1 md:gap-2">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
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
