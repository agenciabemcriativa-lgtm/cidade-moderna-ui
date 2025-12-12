import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import brasaoIpubi from "@/assets/brasao-ipubi.png";

const secretarias = [
  { label: "Administração", slug: "administracao" },
  { label: "Controle Interno", slug: "controle-interno" },
  { label: "Cultura", slug: "cultura" },
  { label: "Desenvolvimento Rural", slug: "desenvolvimento-rural" },
  { label: "Desenvolvimento Social", slug: "desenvolvimento-social" },
  { label: "Educação", slug: "educacao" },
  { label: "Esporte", slug: "esporte" },
  { label: "Finanças", slug: "financas" },
  { label: "Obras e Urbanismo", slug: "obras-urbanismo" },
  { label: "Saúde", slug: "saude" },
];

const servicosCidadao = [
  { label: "Portal da Transparência", href: "#transparencia" },
  { label: "Licitações", href: "#licitacoes" },
  { label: "Contra-Cheque Online", href: "#contracheque" },
  { label: "Nota Fiscal Eletrônica", href: "#nfe" },
  { label: "e-SIC", href: "#esic" },
  { label: "Ouvidoria", href: "#ouvidoria" },
];

const menuItems = [
  { label: "Institucional", href: "#institucional", hasDropdown: false, isLink: false },
  { label: "Notícias", href: "/noticias", hasDropdown: false, isLink: true },
  { label: "Secretarias", href: "/secretarias", hasDropdown: true, type: "secretarias", isLink: true },
  { label: "Serviços ao Cidadão", href: "#servicos", hasDropdown: true, type: "servicos", isLink: false },
  { label: "Publicações", href: "#publicacoes", hasDropdown: false, isLink: false },
  { label: "Contato", href: "#contato", hasDropdown: false, isLink: false },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);

  const renderDropdownContent = (type: string) => {
    if (type === "secretarias") {
      return secretarias.map((item) => (
        <DropdownMenuItem key={item.slug} asChild>
          <Link
            to={`/secretaria/${item.slug}`}
            className="w-full cursor-pointer"
          >
            {item.label}
          </Link>
        </DropdownMenuItem>
      ));
    }
    if (type === "servicos") {
      return servicosCidadao.map((item) => (
        <DropdownMenuItem key={item.href} asChild>
          <a href={item.href} className="w-full cursor-pointer">
            {item.label}
          </a>
        </DropdownMenuItem>
      ));
    }
    return null;
  };

  const getMobileSubItems = (type: string) => {
    if (type === "secretarias") return secretarias;
    if (type === "servicos") return servicosCidadao;
    return [];
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={brasaoIpubi} 
            alt="Brasão de Ipubi" 
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) =>
            item.hasDropdown ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide flex items-center gap-1">
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 bg-card border border-border shadow-lg z-[100]"
                >
                  {renderDropdownContent(item.type!)}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.isLink ? (
              <Link
                key={item.label}
                to={item.href}
                className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide"
              >
                {item.label}
              </a>
            )
          )}
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
            {menuItems.map((item, index) =>
              item.hasDropdown ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileSubMenu(mobileSubMenu === item.type ? null : item.type!)
                    }
                    className="w-full px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide flex items-center justify-between"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileSubMenu === item.type ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileSubMenu === item.type && (
                    <div className="ml-4 mt-2 flex flex-col gap-1 animate-fade-in">
                      {getMobileSubItems(item.type!).map((subItem) => (
                        <Link
                          key={"slug" in subItem ? subItem.slug : subItem.href}
                          to={
                            "slug" in subItem
                              ? `/secretaria/${subItem.slug}`
                              : subItem.href
                          }
                          className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.isLink ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 uppercase tracking-wide"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
