import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AtendimentoItem {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  subcategoria: string | null;
  conteudo: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  horario: string | null;
  responsavel_nome: string | null;
  responsavel_cargo: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
}

export function useAtendimentoItens() {
  return useQuery({
    queryKey: ["atendimento-itens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento_itens")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as AtendimentoItem[];
    },
  });
}

export function useAtendimentoItem(slug: string) {
  return useQuery({
    queryKey: ["atendimento-item", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento_itens")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as AtendimentoItem | null;
    },
    enabled: !!slug,
  });
}

export function useAtendimentoItensByCategoria(categoria: string) {
  return useQuery({
    queryKey: ["atendimento-itens", categoria],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento_itens")
        .select("*")
        .eq("categoria", categoria)
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as AtendimentoItem[];
    },
    enabled: !!categoria,
  });
}
