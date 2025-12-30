import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CardapioEscolar {
  id: string;
  titulo: string;
  mes_referencia: number;
  ano_referencia: number;
  arquivo_nome: string;
  arquivo_url: string;
  ordem: number | null;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  categoria: string;
}

export interface CardapioAgrupado {
  mes: number;
  ano: number;
  label: string;
  itens: CardapioEscolar[];
}

export interface CardapioPorCategoria {
  categoria: string;
  meses: CardapioAgrupado[];
}

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const CATEGORIA_PRIORITARIA = "Cardápios e Recomendações";

export function useCardapiosEscolares() {
  return useQuery({
    queryKey: ["cardapios-escolares"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cardapios_escolares")
        .select("*")
        .eq("publicado", true)
        .order("ano_referencia", { ascending: false })
        .order("mes_referencia", { ascending: false })
        .order("ordem", { ascending: true });
      
      if (error) throw error;
      
      // Agrupar por categoria e depois por mês/ano
      const porCategoria: Record<string, Record<string, CardapioAgrupado>> = {};
      
      (data as CardapioEscolar[]).forEach((item) => {
        const categoria = item.categoria || CATEGORIA_PRIORITARIA;
        const mesKey = `${item.ano_referencia}-${item.mes_referencia}`;
        
        if (!porCategoria[categoria]) {
          porCategoria[categoria] = {};
        }
        
        if (!porCategoria[categoria][mesKey]) {
          porCategoria[categoria][mesKey] = {
            mes: item.mes_referencia,
            ano: item.ano_referencia,
            label: `Cardápio ${mesesNomes[item.mes_referencia - 1]} ${item.ano_referencia}`,
            itens: [],
          };
        }
        porCategoria[categoria][mesKey].itens.push(item);
      });
      
      // Converter para array e ordenar categorias (prioritária primeiro)
      const resultado: CardapioPorCategoria[] = Object.entries(porCategoria)
        .map(([categoria, meses]) => ({
          categoria,
          meses: Object.values(meses),
        }))
        .sort((a, b) => {
          if (a.categoria === CATEGORIA_PRIORITARIA) return -1;
          if (b.categoria === CATEGORIA_PRIORITARIA) return 1;
          return a.categoria.localeCompare(b.categoria);
        });
      
      return resultado;
    },
  });
}

export function useCardapiosEscolaresAdmin() {
  return useQuery({
    queryKey: ["cardapios-escolares-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cardapios_escolares")
        .select("*")
        .order("ano_referencia", { ascending: false })
        .order("mes_referencia", { ascending: false })
        .order("ordem", { ascending: true });
      
      if (error) throw error;
      return data as CardapioEscolar[];
    },
  });
}
