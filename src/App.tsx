import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SecretariaPage from "./pages/SecretariaPage";
import SecretariasPage from "./pages/SecretariasPage";
import NoticiaPage from "./pages/NoticiaPage";
import NoticiasPage from "./pages/NoticiasPage";
import InstitucionalPage from "./pages/InstitucionalPage";
import ContatoPage from "./pages/ContatoPage";
import LicitacoesPage from "./pages/LicitacoesPage";
import LicitacaoPage from "./pages/LicitacaoPage";
import BuscaPage from "./pages/BuscaPage";
import GovernoPage from "./pages/GovernoPage";
import MunicipioPage from "./pages/MunicipioPage";
import AtendimentoPage from "./pages/AtendimentoPage";
import AtendimentosPage from "./pages/AtendimentosPage";
import EstruturaOrganizacionalPage from "./pages/EstruturaOrganizacionalPage";
import OrganogramaPage from "./pages/OrganogramaPage";
import MapaSitePage from "./pages/MapaSitePage";
import AcessibilidadePage from "./pages/AcessibilidadePage";
import PerguntasFrequentesPage from "./pages/PerguntasFrequentesPage";
import PoliticaPrivacidadePage from "./pages/PoliticaPrivacidadePage";
import PublicacoesOficiaisPage from "./pages/PublicacoesOficiaisPage";
import PublicacaoOficialPage from "./pages/PublicacaoOficialPage";
import LegislacaoPage from "./pages/LegislacaoPage";
import OutrosAtosPage from "./pages/legislacao/OutrosAtosPage";
import LeiAcessoInformacaoPage from "./pages/legislacao/LeiAcessoInformacaoPage";
import LeiOrganicaPage from "./pages/legislacao/LeiOrganicaPage";
import PlanejamentoOrcamentoPage from "./pages/legislacao/PlanejamentoOrcamentoPage";
import DocumentoLegislacaoPage from "./pages/legislacao/DocumentoLegislacaoPage";
import TransparenciaPage from "./pages/TransparenciaPage";
import DespesasPage from "./pages/transparencia/DespesasPage";
import ReceitasPage from "./pages/transparencia/ReceitasPage";
import ServidoresPage from "./pages/transparencia/ServidoresPage";
import ConveniosPage from "./pages/transparencia/ConveniosPage";
import RelatoriosPage from "./pages/transparencia/RelatoriosPage";
import AcessoInformacaoPage from "./pages/transparencia/AcessoInformacaoPage";
import ObrasPublicasPage from "./pages/transparencia/ObrasPublicasPage";
import RemuneracaoAgentesPage from "./pages/transparencia/RemuneracaoAgentesPage";
import DiariasPassagensPage from "./pages/transparencia/DiariasPassagensPage";
import PatrimonioPublicoPage from "./pages/transparencia/PatrimonioPublicoPage";
import DadosAbertosPage from "./pages/transparencia/DadosAbertosPage";
import ESicPage from "./pages/transparencia/ESicPage";
import ESicNovaSolicitacaoPage from "./pages/transparencia/ESicNovaSolicitacaoPage";
import ESicConsultarPage from "./pages/transparencia/ESicConsultarPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminSecretarias from "./pages/admin/AdminSecretarias";
import AdminBanner from "./pages/admin/AdminBanner";
import AdminServicos from "./pages/admin/AdminServicos";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";
import AdminLicitacoes from "./pages/admin/AdminLicitacoes";
import AdminGoverno from "./pages/admin/AdminGoverno";
import AdminMunicipio from "./pages/admin/AdminMunicipio";
import AdminAtendimento from "./pages/admin/AdminAtendimento";
import AdminPublicacoesOficiais from "./pages/admin/AdminPublicacoesOficiais";
import AdminLegislacao from "./pages/admin/AdminLegislacao";
import AdminTransparencia from "./pages/admin/AdminTransparencia";
import AdminRelatoriosFiscais from "./pages/admin/AdminRelatoriosFiscais";
import AdminObrasPublicas from "./pages/admin/AdminObrasPublicas";
import AdminRemuneracaoAgentes from "./pages/admin/AdminRemuneracaoAgentes";
import AdminDiariasPassagens from "./pages/admin/AdminDiariasPassagens";
import AdminPatrimonioPublico from "./pages/admin/AdminPatrimonioPublico";
import AdminDadosAbertos from "./pages/admin/AdminDadosAbertos";
import AdminESic from "./pages/admin/AdminESic";
import AdminESicDetalhe from "./pages/admin/AdminESicDetalhe";
import AdminReceitasCategorias from "./pages/admin/AdminReceitasCategorias";
import AdminEstruturaOrganizacional from "./pages/admin/AdminEstruturaOrganizacional";
import AdminFaq from "./pages/admin/AdminFaq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/secretarias" element={<SecretariasPage />} />
            <Route path="/secretaria/:slug" element={<SecretariaPage />} />
            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/noticia/:slug" element={<NoticiaPage />} />
            <Route path="/institucional" element={<InstitucionalPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/licitacoes" element={<LicitacoesPage />} />
            <Route path="/licitacao/:id" element={<LicitacaoPage />} />
            <Route path="/busca" element={<BuscaPage />} />
            <Route path="/governo/estrutura-organizacional" element={<EstruturaOrganizacionalPage />} />
            <Route path="/governo/organograma" element={<OrganogramaPage />} />
            <Route path="/governo/:slug" element={<GovernoPage />} />
            <Route path="/municipio/:slug" element={<MunicipioPage />} />
            <Route path="/atendimento" element={<AtendimentosPage />} />
            <Route path="/atendimento/:slug" element={<AtendimentoPage />} />
            <Route path="/publicacoes-oficiais" element={<PublicacoesOficiaisPage />} />
            <Route path="/publicacao/:id" element={<PublicacaoOficialPage />} />
            <Route path="/legislacao" element={<LegislacaoPage />} />
            <Route path="/legislacao/outros-atos" element={<OutrosAtosPage />} />
            <Route path="/legislacao/lei-acesso-informacao" element={<LeiAcessoInformacaoPage />} />
            <Route path="/legislacao/lei-organica" element={<LeiOrganicaPage />} />
            <Route path="/legislacao/planejamento-orcamento" element={<PlanejamentoOrcamentoPage />} />
            <Route path="/legislacao/documento/:id" element={<DocumentoLegislacaoPage />} />
            <Route path="/mapa-do-site" element={<MapaSitePage />} />
            <Route path="/acessibilidade" element={<AcessibilidadePage />} />
            <Route path="/perguntas-frequentes" element={<PerguntasFrequentesPage />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
            <Route path="/transparencia" element={<TransparenciaPage />} />
            <Route path="/transparencia/despesas" element={<DespesasPage />} />
            <Route path="/transparencia/receitas" element={<ReceitasPage />} />
            <Route path="/transparencia/servidores" element={<ServidoresPage />} />
            <Route path="/transparencia/convenios" element={<ConveniosPage />} />
            <Route path="/transparencia/relatorios" element={<RelatoriosPage />} />
            <Route path="/transparencia/acesso-informacao" element={<AcessoInformacaoPage />} />
            <Route path="/transparencia/obras" element={<ObrasPublicasPage />} />
            <Route path="/transparencia/remuneracao-agentes" element={<RemuneracaoAgentesPage />} />
            <Route path="/transparencia/diarias-passagens" element={<DiariasPassagensPage />} />
            <Route path="/transparencia/patrimonio" element={<PatrimonioPublicoPage />} />
            <Route path="/transparencia/dados-abertos" element={<DadosAbertosPage />} />
            <Route path="/transparencia/esic" element={<ESicPage />} />
            <Route path="/transparencia/esic/nova-solicitacao" element={<ESicNovaSolicitacaoPage />} />
            <Route path="/transparencia/esic/consultar" element={<ESicConsultarPage />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/noticias" element={<AdminNoticias />} />
            <Route path="/admin/secretarias" element={<AdminSecretarias />} />
            <Route path="/admin/banner" element={<AdminBanner />} />
            <Route path="/admin/servicos" element={<AdminServicos />} />
            <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
            <Route path="/admin/licitacoes" element={<AdminLicitacoes />} />
            <Route path="/admin/governo" element={<AdminGoverno />} />
            <Route path="/admin/municipio" element={<AdminMunicipio />} />
            <Route path="/admin/atendimento" element={<AdminAtendimento />} />
            <Route path="/admin/publicacoes-oficiais" element={<AdminPublicacoesOficiais />} />
            <Route path="/admin/legislacao" element={<AdminLegislacao />} />
            <Route path="/admin/transparencia" element={<AdminTransparencia />} />
            <Route path="/admin/relatorios-fiscais" element={<AdminRelatoriosFiscais />} />
            <Route path="/admin/obras" element={<AdminObrasPublicas />} />
            <Route path="/admin/remuneracao-agentes" element={<AdminRemuneracaoAgentes />} />
            <Route path="/admin/diarias-passagens" element={<AdminDiariasPassagens />} />
            <Route path="/admin/patrimonio" element={<AdminPatrimonioPublico />} />
            <Route path="/admin/dados-abertos" element={<AdminDadosAbertos />} />
            <Route path="/admin/esic" element={<AdminESic />} />
            <Route path="/admin/esic/:id" element={<AdminESicDetalhe />} />
            <Route path="/admin/receitas-categorias" element={<AdminReceitasCategorias />} />
            <Route path="/admin/estrutura-organizacional" element={<AdminEstruturaOrganizacional />} />
            <Route path="/admin/faq" element={<AdminFaq />} />
            
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
