import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const COOKIE_CONSENT_KEY = "ipubi-cookie-consent";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid banner appearing immediately on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Este site utiliza cookies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Utilizamos cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar nosso tráfego. 
                  Ao clicar em "Aceitar todos", você concorda com o uso de cookies conforme nossa{" "}
                  <Link to="/politica-de-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Configurar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptNecessary}
              >
                Apenas necessários
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
              >
                Aceitar todos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Preferências de Cookies
            </DialogTitle>
            <DialogDescription>
              Gerencie suas preferências de cookies. Cookies necessários são essenciais para o funcionamento do site.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base font-medium">Cookies Necessários</Label>
                <p className="text-sm text-muted-foreground">
                  Essenciais para o funcionamento básico do site. Não podem ser desativados.
                </p>
              </div>
              <Switch checked={true} disabled className="ml-4" />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base font-medium">Cookies de Análise</Label>
                <p className="text-sm text-muted-foreground">
                  Nos ajudam a entender como os visitantes interagem com o site, coletando informações anônimas.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked }))
                }
                className="ml-4"
              />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base font-medium">Cookies Funcionais</Label>
                <p className="text-sm text-muted-foreground">
                  Permitem funcionalidades avançadas e personalização, como preferências de idioma e acessibilidade.
                </p>
              </div>
              <Switch
                checked={preferences.functional}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, functional: checked }))
                }
                className="ml-4"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleAcceptNecessary}
              className="flex-1"
            >
              Apenas necessários
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="flex-1"
            >
              Salvar preferências
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Para mais informações, consulte nossa{" "}
            <Link to="/politica-de-privacidade" className="text-primary hover:underline" onClick={() => setShowSettings(false)}>
              Política de Privacidade
            </Link>.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
