import { useState, useRef, useEffect } from "react";
import { Phone, Mail, ExternalLink, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Portal da Transparência", href: "/transparencia", external: false },
  { label: "Licitações", href: "/licitacoes", external: false },
  { label: "Legislação", href: "/legislacao", external: false },
  { label: "e-SIC", href: "/transparencia/esic", external: false },
];

const tiposPublicacao = [
  { label: "Todas as Publicações", value: "", href: "/publicacoes-oficiais" },
  { label: "Leis", value: "lei", href: "/publicacoes-oficiais?tipo=lei" },
  { label: "Decretos", value: "decreto", href: "/publicacoes-oficiais?tipo=decreto" },
  { label: "Portarias", value: "portaria", href: "/publicacoes-oficiais?tipo=portaria" },
  { label: "Resoluções", value: "resolucao", href: "/publicacoes-oficiais?tipo=resolucao" },
  { label: "Instruções Normativas", value: "instrucao_normativa", href: "/publicacoes-oficiais?tipo=instrucao_normativa" },
  { label: "Atos Administrativos", value: "ato_administrativo", href: "/publicacoes-oficiais?tipo=ato_administrativo" },
  { label: "Editais", value: "edital", href: "/publicacoes-oficiais?tipo=edital" },
  { label: "Comunicados", value: "comunicado", href: "/publicacoes-oficiais?tipo=comunicado" },
];

export function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container flex flex-col md:flex-row items-center justify-between py-2 text-xs md:text-sm">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <a href="tel:+558738811156" className="flex items-center gap-1.5 hover:text-highlight transition-colors">
            <Phone className="w-3 h-3" />
            <span>(87) 3881-1156</span>
          </a>
          <a href="mailto:contato@ipubi.pe.gov.br" className="flex items-center gap-1.5 hover:text-highlight transition-colors">
            <Mail className="w-3 h-3" />
            <span>contato@ipubi.pe.gov.br</span>
          </a>
        </div>
        <nav className="flex items-center flex-wrap justify-center gap-1">
          {quickLinks.map((link, index) => (
            <div key={link.label} className="flex items-center">
              {index > 0 && (
                <span className="text-primary-foreground/40 mx-1 hidden md:inline">|</span>
              )}
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-primary-foreground/10 transition-all duration-200 font-medium whitespace-nowrap"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-primary-foreground/10 transition-all duration-200 font-medium whitespace-nowrap"
                >
                  <span>{link.label}</span>
                </Link>
              )}
            </div>
          ))}
          
          {/* Separador */}
          <span className="text-primary-foreground/40 mx-1 hidden md:inline">|</span>
          
          {/* Publicações Oficiais Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-primary-foreground/10 transition-all duration-200 font-medium whitespace-nowrap"
            >
              <span>Publicações Oficiais</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-card text-card-foreground rounded-lg shadow-lg border border-border z-[200] py-1 animate-fade-in">
                {tiposPublicacao.map((tipo) => (
                  <Link
                    key={tipo.value}
                    to={tipo.href}
                    className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {tipo.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
