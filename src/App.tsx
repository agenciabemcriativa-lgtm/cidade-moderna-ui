import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SecretariaPage from "./pages/SecretariaPage";
import SecretariasPage from "./pages/SecretariasPage";
import NoticiaPage from "./pages/NoticiaPage";
import NoticiasPage from "./pages/NoticiasPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminSecretarias from "./pages/admin/AdminSecretarias";
import AdminBanner from "./pages/admin/AdminBanner";
import AdminServicos from "./pages/admin/AdminServicos";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/secretarias" element={<SecretariasPage />} />
            <Route path="/secretaria/:slug" element={<SecretariaPage />} />
            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/noticia/:slug" element={<NoticiaPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/noticias" element={<AdminNoticias />} />
            <Route path="/admin/secretarias" element={<AdminSecretarias />} />
            <Route path="/admin/banner" element={<AdminBanner />} />
            <Route path="/admin/servicos" element={<AdminServicos />} />
            <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
