import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SecretariaPage from "./pages/SecretariaPage";
import SecretariasPage from "./pages/SecretariasPage";
import NoticiaPage from "./pages/NoticiaPage";
import NoticiasPage from "./pages/NoticiasPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
