import { useState, useEffect } from "react";
import { Phone, Mail, ExternalLink, ZoomIn, ZoomOut, Contrast } from "lucide-react";

const quickLinks = [
  { label: "Portal da Transparência", href: "https://www.ipubi.pe.gov.br/portaldatransparencia/" },
  { label: "e-SIC", href: "https://www.ipubi.pe.gov.br/esic/" },
];

export function TopBar() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  const toggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

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
        <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
          {/* Accessibility Controls */}
          <div className="flex items-center gap-1 border-r border-primary-foreground/30 pr-2 md:pr-4">
            <button
              onClick={decreaseFontSize}
              className="p-1.5 rounded hover:bg-primary-foreground/20 transition-colors"
              title="Diminuir fonte"
              aria-label="Diminuir tamanho da fonte"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={increaseFontSize}
              className="p-1.5 rounded hover:bg-primary-foreground/20 transition-colors"
              title="Aumentar fonte"
              aria-label="Aumentar tamanho da fonte"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={toggleContrast}
              className={`p-1.5 rounded transition-colors ${
                highContrast ? "bg-highlight text-highlight-foreground" : "hover:bg-primary-foreground/20"
              }`}
              title="Alto contraste"
              aria-label="Alternar alto contraste"
            >
              <Contrast className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Links */}
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
    </div>
  );
}
