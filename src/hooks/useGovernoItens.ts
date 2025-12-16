import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GovernoItem {
  id: string;
  titulo: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}

const fallbackData: GovernoItem[] = [
  { id: "1", titulo: "Prefeito", slug: "prefeito", ordem: 1, ativo: true },
  { id: "2", titulo: "Vice-Prefeito", slug: "vice-prefeito", ordem: 2, ativo: true },
  { id: "3", titulo: "Estrutura Organizacional", slug: "estrutura-organizacional", ordem: 3, ativo: true },
  { id: "4", titulo: "Organograma", slug: "organograma", ordem: 4, ativo: true },
];

export function useGovernoItens() {
  return useQuery({
    queryKey: ["governo-itens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("governo_itens")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error || !data || data.length === 0) {
        return fallbackData;
      }
      
      return data as GovernoItem[];
    },
  });
}

export function useGovernoItensAdmin() {
  return useQuery({
    queryKey: ["governo-itens-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("governo_itens")
        .select("*")
        .order("ordem");
      
      if (error) throw error;
      return data as GovernoItem[];
    },
  });
}
