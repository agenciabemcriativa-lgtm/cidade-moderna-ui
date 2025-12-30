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
}

export interface CardapioAgrupado {
  mes: number;
  ano: number;
  label: string;
  itens: CardapioEscolar[];
}

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

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
      
      // Agrupar por mês/ano
      const agrupados: Record<string, CardapioAgrupado> = {};
      
      (data as CardapioEscolar[]).forEach((item) => {
        const key = `${item.ano_referencia}-${item.mes_referencia}`;
        if (!agrupados[key]) {
          agrupados[key] = {
            mes: item.mes_referencia,
            ano: item.ano_referencia,
            label: `Cardápio ${mesesNomes[item.mes_referencia - 1]} ${item.ano_referencia}`,
            itens: [],
          };
        }
        agrupados[key].itens.push(item);
      });
      
      return Object.values(agrupados);
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
