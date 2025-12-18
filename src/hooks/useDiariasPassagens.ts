import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TipoDiariaPassagem = 'diaria' | 'passagem' | 'diaria_passagem';

export interface DiariaPassagem {
  id: string;
  beneficiario_nome: string;
  beneficiario_cargo: string | null;
  beneficiario_matricula: string | null;
  secretaria: string | null;
  tipo: TipoDiariaPassagem;
  destino: string;
  finalidade: string;
  data_inicio: string;
  data_fim: string;
  quantidade_dias: number | null;
  valor_unitario: number | null;
  valor_total: number;
  numero_portaria: string | null;
  link_sistema_oficial: string | null;
  observacoes: string | null;
  mes_referencia: number;
  ano_referencia: number;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const tipoDiariaPassagemLabels: Record<TipoDiariaPassagem, string> = {
  diaria: 'Diária',
  passagem: 'Passagem',
  diaria_passagem: 'Diária e Passagem',
};

export function useDiariasPassagens(ano?: number, mes?: number, tipo?: TipoDiariaPassagem, includeUnpublished = false) {
  return useQuery({
    queryKey: ['diarias_passagens', ano, mes, tipo, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('diarias_passagens')
        .select('*')
        .order('data_inicio', { ascending: false });

      if (ano) {
        query = query.eq('ano_referencia', ano);
      }

      if (mes) {
        query = query.eq('mes_referencia', mes);
      }

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DiariaPassagem[];
    },
  });
}

export function useCreateDiariaPassagem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<DiariaPassagem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('diarias_passagens')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diarias_passagens'] });
    },
  });
}

export function useUpdateDiariaPassagem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<DiariaPassagem> & { id: string }) => {
      const { data, error } = await supabase
        .from('diarias_passagens')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diarias_passagens'] });
    },
  });
}

export function useDeleteDiariaPassagem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('diarias_passagens').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diarias_passagens'] });
    },
  });
}
