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
  isAvulsa: boolean; // Se true, não agrupa por mês
  meses: CardapioAgrupado[];
  itensAvulsos: CardapioEscolar[]; // Itens para categorias avulsas
}

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const CATEGORIA_AVULSA = "Cardápios e Recomendações";

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
      
      // Separar itens avulsos e itens por mês
      const itensAvulsos: CardapioEscolar[] = [];
      const porCategoria: Record<string, Record<string, CardapioAgrupado>> = {};
      
      (data as CardapioEscolar[]).forEach((item) => {
        const categoria = item.categoria || CATEGORIA_AVULSA;
        
        // Se for categoria avulsa, adiciona diretamente
        if (categoria === CATEGORIA_AVULSA) {
          itensAvulsos.push(item);
          return;
        }
        
        // Para outras categorias, agrupa por mês/ano
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
      
      // Montar resultado final
      const resultado: CardapioPorCategoria[] = [];
      
      // Adicionar categoria avulsa primeiro (se tiver itens)
      if (itensAvulsos.length > 0) {
        resultado.push({
          categoria: CATEGORIA_AVULSA,
          isAvulsa: true,
          meses: [],
          itensAvulsos: itensAvulsos,
        });
      }
      
      // Adicionar outras categorias ordenadas
      Object.entries(porCategoria)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([categoria, meses]) => {
          resultado.push({
            categoria,
            isAvulsa: false,
            meses: Object.values(meses),
            itensAvulsos: [],
          });
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
