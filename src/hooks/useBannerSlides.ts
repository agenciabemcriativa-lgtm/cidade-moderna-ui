import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BannerSlide {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  bgClass: string;
  bgImageUrl?: string;
  bgImageOpacity?: number;
  bgImagePosition?: string;
}

const fallbackSlides: BannerSlide[] = [
  {
    title: "Bem-vindo ao Portal de Ipubi",
    subtitle: "Prefeitura Municipal",
    description: "Acesse serviços, notícias e informações sobre nossa cidade. Transparência e eficiência a serviço do cidadão.",
    cta: "Conheça Nossos Serviços",
    ctaLink: "#servicos",
    bgClass: "bg-gradient-to-br from-primary via-primary/90 to-secondary"
  },
  {
    title: "Portal da Transparência",
    subtitle: "Gestão Pública",
    description: "Acompanhe as contas públicas, licitações e contratos. Acesso à informação é um direito do cidadão.",
    cta: "Acessar Portal",
    ctaLink: "#transparencia",
    bgClass: "bg-gradient-to-br from-secondary via-secondary/90 to-primary"
  },
  {
    title: "Serviços Online",
    subtitle: "Atendimento Digital",
    description: "Solicite documentos, agende atendimentos e acompanhe processos sem sair de casa.",
    cta: "Ver Serviços",
    ctaLink: "#servicos",
    bgClass: "bg-gradient-to-br from-primary/80 via-secondary/70 to-primary"
  }
];

export function useBannerSlides() {
  return useQuery({
    queryKey: ["banner-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banner_slides")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error || !data || data.length === 0) {
        return fallbackSlides;
      }
      
      return data.map(item => ({
        title: item.titulo,
        subtitle: item.subtitulo || "",
        description: item.descricao || "",
        cta: item.cta_texto || "Saiba Mais",
        ctaLink: item.cta_link || "#",
        bgClass: item.bg_class || "bg-gradient-to-br from-primary via-primary/90 to-secondary",
        bgImageUrl: item.bg_image_url || undefined,
        bgImageOpacity: item.bg_image_opacity ? Number(item.bg_image_opacity) : 1,
        bgImagePosition: item.bg_image_position || "center",
      })) as BannerSlide[];
    },
  });
}
