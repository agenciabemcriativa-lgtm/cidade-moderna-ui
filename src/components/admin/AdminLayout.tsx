import { ReactNode, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  Image,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Landmark,
  MapPin,
  Users,
  BookOpen,
  Shield
} from "lucide-react";
import { useState } from "react";
import brasaoIpubi from "@/assets/brasao-ipubi.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Newspaper, label: "Notícias", href: "/admin/noticias" },
  { icon: Building2, label: "Secretarias", href: "/admin/secretarias" },
  { icon: Landmark, label: "O Governo", href: "/admin/governo" },
  { icon: MapPin, label: "Município", href: "/admin/municipio" },
  { icon: Users, label: "Atendimento", href: "/admin/atendimento" },
  { icon: FileText, label: "Licitações", href: "/admin/licitacoes" },
  { icon: FileText, label: "Publicações Oficiais", href: "/admin/publicacoes-oficiais" },
  { icon: BookOpen, label: "Legislação", href: "/admin/legislacao" },
  { icon: Shield, label: "Transparência", href: "/admin/transparencia" },
  { icon: FileText, label: "Relatórios Fiscais", href: "/admin/relatorios-fiscais" },
  { icon: FileText, label: "Obras Públicas", href: "/admin/obras" },
  { icon: Users, label: "Remuneração Agentes", href: "/admin/remuneracao-agentes" },
  { icon: FileText, label: "Diárias e Passagens", href: "/admin/diarias-passagens" },
  { icon: Landmark, label: "Patrimônio Público", href: "/admin/patrimonio" },
  { icon: FileText, label: "Dados Abertos", href: "/admin/dados-abertos" },
  { icon: Image, label: "Banner", href: "/admin/banner" },
  { icon: Wrench, label: "Serviços", href: "/admin/servicos" },
  { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
        <img src={brasaoIpubi} alt="Brasão" className="h-10" />
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b hidden lg:block">
            <img src={brasaoIpubi} alt="Brasão de Ipubi" className="h-12 mx-auto" />
            <p className="text-center text-sm font-semibold mt-2">Painel Admin</p>
          </div>
          
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <p className="text-xs text-muted-foreground mb-2 truncate">{user.email}</p>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
