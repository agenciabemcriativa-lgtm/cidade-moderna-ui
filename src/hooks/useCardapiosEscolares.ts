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

export interface CardapiosAgrupados {
  recomendacoes: CardapioEscolar[]; // Documentos avulsos (Cardápios e Recomendações)
  porMes: CardapioAgrupado[]; // Cardápios agrupados por mês
}

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const CATEGORIA_RECOMENDACOES = "Cardápios e Recomendações";

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
      
      const recomendacoes: CardapioEscolar[] = [];
      const porMesMap: Record<string, CardapioAgrupado> = {};
      
      (data as CardapioEscolar[]).forEach((item) => {
        // Se for "Cardápios e Recomendações", vai pro bloco avulso
        if (item.categoria === CATEGORIA_RECOMENDACOES) {
          recomendacoes.push(item);
          return;
        }
        
        // Outros vão agrupados por mês/ano
        const mesKey = `${item.ano_referencia}-${item.mes_referencia}`;
        
        if (!porMesMap[mesKey]) {
          porMesMap[mesKey] = {
            mes: item.mes_referencia,
            ano: item.ano_referencia,
            label: `Cardápio ${mesesNomes[item.mes_referencia - 1]} ${item.ano_referencia}`,
            itens: [],
          };
        }
        porMesMap[mesKey].itens.push(item);
      });
      
      const resultado: CardapiosAgrupados = {
        recomendacoes,
        porMes: Object.values(porMesMap),
      };
      
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
