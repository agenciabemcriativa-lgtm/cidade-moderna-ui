import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Institucional", href: "#institucional" },
  { label: "Notícias", href: "#noticias" },
  { label: "Secretarias", href: "#secretarias" },
  { label: "Serviços ao Cidadão", href: "#servicos" },
  { label: "Publicações", href: "#publicacoes" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xl">PM</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-primary leading-tight">PREFEITURA MUNICIPAL</h1>
            <p className="text-xs text-muted-foreground font-medium">Cidade Exemplo - Estado</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-card border-t border-border animate-fade-in">
          <div className="container py-4 flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
