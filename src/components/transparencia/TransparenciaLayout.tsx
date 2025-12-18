import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users, 
  Calculator, 
  Handshake, 
  BarChart3, 
  MessageSquare,
  ExternalLink,
  Search,
  Clock,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import brasaoIpubi from '@/assets/brasao-ipubi.png';

interface TransparenciaLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const menuItems = [
  { label: 'Visão Geral', href: '/transparencia', icon: Home },
  { label: 'Despesas Públicas', href: '/transparencia/despesas', icon: DollarSign },
  { label: 'Receitas Públicas', href: '/transparencia/receitas', icon: TrendingUp },
  { label: 'Licitações e Contratos', href: '/licitacoes', icon: FileText },
  { label: 'Servidores e Pessoal', href: '/transparencia/servidores', icon: Users },
  { label: 'Planejamento e Orçamento', href: '/legislacao/planejamento-orcamento', icon: Calculator },
  { label: 'Convênios e Parcerias', href: '/transparencia/convenios', icon: Handshake },
  { label: 'Relatórios Fiscais', href: '/transparencia/relatorios', icon: BarChart3 },
  { label: 'Acesso à Informação', href: '/transparencia/acesso-informacao', icon: MessageSquare },
];

const quickLinks = [
  { label: 'Portal da Transparência (Sistema)', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', icon: ExternalLink },
  { label: 'e-SIC', url: 'https://www.ipubi.pe.gov.br/esic/', icon: Search },
];

export function TransparenciaLayout({ children, title, description }: TransparenciaLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Link to="/transparencia" className="flex items-center gap-3">
              <img 
                src={brasaoIpubi} 
                alt="Brasão de Ipubi" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Portal da Transparência</h1>
                <p className="text-xs text-gray-600">Prefeitura Municipal de Ipubi - PE</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {quickLinks.map((link) => (
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
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                    isActive 
                      ? "bg-white text-primary" 
                      : "text-white/90 hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

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
