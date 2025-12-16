import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MunicipioItem {
  id: string;
  titulo: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}

const fallbackData: MunicipioItem[] = [
  { id: "1", titulo: "Cultura", slug: "cultura", ordem: 1, ativo: true },
  { id: "2", titulo: "História", slug: "historia", ordem: 2, ativo: true },
  { id: "3", titulo: "Símbolos Oficiais", slug: "simbolos-oficiais", ordem: 3, ativo: true },
  { id: "4", titulo: "Dados Demográficos", slug: "dados-demograficos", ordem: 4, ativo: true },
];

export function useMunicipioItens() {
  return useQuery({
    queryKey: ["municipio-itens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("municipio_itens")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error || !data || data.length === 0) {
        return fallbackData;
      }
      
      return data as MunicipioItem[];
    },
  });
}

export function useMunicipioItensAdmin() {
  return useQuery({
    queryKey: ["municipio-itens-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("municipio_itens")
        .select("*")
        .order("ordem");
      
      if (error) throw error;
      return data as MunicipioItem[];
    },
  });
}
