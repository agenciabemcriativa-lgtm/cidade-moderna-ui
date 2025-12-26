import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { noticiasData as fallbackNoticias } from "@/data/noticias";

export interface Noticia {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  categoryColor: string;
  image: string;
  date: string;
  rawDate: string | null;
}

export function useNoticias() {
  return useQuery({
    queryKey: ["noticias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("publicado", true)
        .order("data_publicacao", { ascending: false });
      
      if (error || !data || data.length === 0) {
        // Fallback to static data
        return fallbackNoticias;
      }
      
      return data.map(item => ({
        id: item.id,
        slug: item.slug,
        title: item.titulo,
        summary: item.resumo,
        content: item.conteudo,
        category: item.categoria,
        categoryColor: item.categoria_cor,
        image: item.imagem_url || "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800",
        date: new Date(item.data_publicacao || item.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }),
        rawDate: item.updated_at || item.data_publicacao || item.created_at,
      })) as Noticia[];
    },
  });
}

export function useNoticia(slug: string) {
  return useQuery({
    queryKey: ["noticia", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      
      if (error || !data) {
        // Fallback to static data
        const fallback = fallbackNoticias.find(n => n.slug === slug);
        return fallback || null;
      }
      
      return {
        id: data.id,
        slug: data.slug,
        title: data.titulo,
        summary: data.resumo,
        content: data.conteudo,
        category: data.categoria,
        categoryColor: data.categoria_cor,
        image: data.imagem_url || "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800",
        date: new Date(data.data_publicacao || data.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }),
      } as Noticia;
    },
    enabled: !!slug,
  });
}
