import { useState, useEffect, useCallback } from "react";
import { Moon, BookOpen, Accessibility } from "lucide-react";
import { toast } from "sonner";

const skipLinks = [
  { label: "Ir para Menu", shortcut: "1", href: "#menu-principal" },
  { label: "Ir para Buscador", shortcut: "2", href: "#buscador" },
  { label: "Ir para Rodapé", shortcut: "3", href: "#rodape" },
];

export function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("accessibility-font-size");
    return saved ? parseInt(saved) : 100;
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("accessibility-high-contrast") === "true";
  });
  const [readingMode, setReadingMode] = useState(() => {
    return localStorage.getItem("accessibility-reading-mode") === "true";
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("accessibility-font-size", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    localStorage.setItem("accessibility-high-contrast", highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    if (readingMode) {
      document.documentElement.classList.add("reading-mode");
    } else {
      document.documentElement.classList.remove("reading-mode");
    }
    localStorage.setItem("accessibility-reading-mode", readingMode.toString());
  }, [readingMode]);

  // Keyboard shortcuts handler
  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    // Only trigger with Alt key
    if (!event.altKey) return;

    const shortcut = skipLinks.find(link => link.shortcut === event.key);
    if (shortcut) {
      event.preventDefault();
      const element = document.querySelector(shortcut.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Focus the element if it's focusable
        if (element instanceof HTMLElement) {
          element.focus();
        }
        toast.info(`Navegando para: ${shortcut.label.replace("Ir para ", "")}`);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  const toggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const toggleReadingMode = () => {
    setReadingMode((prev) => !prev);
  };

  return (
    <div className="bg-[#0a1628] text-white">
      <div className="container flex items-center justify-between py-1.5 text-xs">
        {/* Skip Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Links de navegação rápida">
          {skipLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
              title={`Atalho: Alt + ${link.shortcut}`}
            >
              <span>{link.label}</span>
              <span className="inline-flex items-center justify-center px-1.5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded">
                Alt+{link.shortcut}
              </span>
            </a>
          ))}
        </nav>

        {/* Accessibility Controls */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Reading Mode */}
          <button
            onClick={toggleReadingMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              readingMode 
                ? "bg-accent text-accent-foreground" 
                : "hover:bg-white/10"
            }`}
            aria-label="Alternar modo de leitura simplificada"
            aria-pressed={readingMode}
            title="Ativa layout simplificado com maior espaçamento e fonte mais legível"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">LEITURA</span>
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleContrast}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              highContrast 
                ? "bg-highlight text-highlight-foreground" 
                : "hover:bg-white/10"
            }`}
            aria-label="Alternar alto contraste"
            aria-pressed={highContrast}
          >
            <Moon className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">CONTRASTE</span>
          </button>

          {/* Font Size Controls */}
          <div className="flex items-center border-l border-white/20 pl-2 ml-1">
            <button
              onClick={increaseFontSize}
              className="px-2 py-1 rounded hover:bg-white/10 transition-colors font-bold text-sm"
              title="Aumentar fonte"
              aria-label="Aumentar tamanho da fonte"
            >
              A+
            </button>
            <button
              onClick={resetFontSize}
              className="px-2 py-1 rounded hover:bg-white/10 transition-colors font-bold text-sm"
              title="Tamanho normal"
              aria-label="Restaurar tamanho da fonte"
            >
              A
            </button>
            <button
              onClick={decreaseFontSize}
              className="px-2 py-1 rounded hover:bg-white/10 transition-colors font-bold text-sm"
              title="Diminuir fonte"
              aria-label="Diminuir tamanho da fonte"
            >
              A-
            </button>
          </div>

          {/* Page Links */}
          <div className="flex items-center gap-1 border-l border-white/20 ml-1 pl-3">
            <a
              href="/mapa-do-site"
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Mapa do site"
            >
              <span className="hidden sm:inline">Mapa do Site</span>
              <span className="sm:hidden">Mapa</span>
            </a>
            <a
              href="/acessibilidade"
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Informações de acessibilidade"
            >
              <Accessibility className="w-4 h-4" />
              <span className="hidden sm:inline">Acessibilidade</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
