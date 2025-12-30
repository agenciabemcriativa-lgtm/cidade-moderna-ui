import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Clock
} from 'lucide-react';
import brasaoIpubi from '@/assets/brasao-ipubi.png';
import { AccessibilityBar } from '@/components/portal/AccessibilityBar';

interface TransparenciaLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const quickLinks: { label: string; url: string; icon: typeof Search; internal: boolean }[] = [];

export function TransparenciaLayout({ children, title, description }: TransparenciaLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accessibility Bar */}
      <AccessibilityBar />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 text-xs text-gray-600 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-primary transition-colors">
                ← Voltar ao Portal Institucional
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Atualizado em: {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img 
                  src={brasaoIpubi} 
                  alt="Brasão de Ipubi" 
                  className="h-12 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link to="/transparencia">
                <h1 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">Portal da Transparência</h1>
                <p className="text-xs text-gray-600">Prefeitura Municipal de Ipubi - PE</p>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {quickLinks.map((link) => (
                link.internal ? (
                  <Link
                    key={link.label}
                    to={link.url}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <img 
                src={brasaoIpubi} 
                alt="Brasão de Ipubi" 
                className="h-8 w-auto brightness-0 invert"
              />
              <div>
                <p className="font-medium text-white">Portal da Transparência</p>
                <p>Prefeitura Municipal de Ipubi - PE</p>
              </div>
            </div>
            <p className="text-xs text-center md:text-right">
              As informações detalhadas são disponibilizadas pelos sistemas oficiais de gestão do Município.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}