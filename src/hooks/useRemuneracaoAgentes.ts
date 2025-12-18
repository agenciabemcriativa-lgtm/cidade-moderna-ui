import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type CargoAgentePolitico = 'prefeito' | 'vice_prefeito' | 'secretario' | 'outros';

export interface RemuneracaoAgente {
  id: string;
  nome: string;
  cargo: CargoAgentePolitico;
  cargo_descricao: string | null;
  secretaria: string | null;
  subsidio_mensal: number;
  verba_representacao: number | null;
  outros_valores: number | null;
  total_bruto: number | null;
  mes_referencia: number;
  ano_referencia: number;
  observacoes: string | null;
  foto_url: string | null;
  ativo: boolean | null;
  publicado: boolean | null;
  ordem: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export const cargoAgentePoliticoLabels: Record<CargoAgentePolitico, string> = {
  prefeito: 'Prefeito',
  vice_prefeito: 'Vice-Prefeito',
  secretario: 'Secretário(a)',
  outros: 'Outros',
};

export const mesesLabels: Record<number, string> = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro',
};

export function useRemuneracaoAgentes(ano?: number, mes?: number, includeUnpublished = false) {
  return useQuery({
    queryKey: ['remuneracao_agentes', ano, mes, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('remuneracao_agentes')
        .select('*')
        .order('ordem', { ascending: true })
        .order('cargo', { ascending: true });

      if (ano) {
        query = query.eq('ano_referencia', ano);
      }

      if (mes) {
        query = query.eq('mes_referencia', mes);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as RemuneracaoAgente[];
    },
  });
}

export function useCreateRemuneracaoAgente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agente: Omit<RemuneracaoAgente, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('remuneracao_agentes')
        .insert(agente)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remuneracao_agentes'] });
    },
  });
}

export function useUpdateRemuneracaoAgente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...agente }: Partial<RemuneracaoAgente> & { id: string }) => {
      const { data, error } = await supabase
        .from('remuneracao_agentes')
        .update(agente)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remuneracao_agentes'] });
    },
  });
}

export function useDeleteRemuneracaoAgente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('remuneracao_agentes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remuneracao_agentes'] });
    },
  });
}
