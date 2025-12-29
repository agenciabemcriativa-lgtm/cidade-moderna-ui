import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type CategoriaFolha = 'prefeitura' | 'educacao';

export const categoriasLabels: Record<CategoriaFolha, string> = {
  prefeitura: 'Prefeitura',
  educacao: 'Educação',
};

export interface FolhaPagamento {
  id: string;
  titulo: string;
  mes_referencia: number;
  ano_referencia: number;
  arquivo_url: string;
  arquivo_nome: string;
  categoria: string;
  data_postagem: string;
  descricao: string | null;
  observacoes: string | null;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FolhaPagamentoInput {
  titulo: string;
  mes_referencia: number;
  ano_referencia: number;
  arquivo_url: string;
  arquivo_nome: string;
  categoria: CategoriaFolha;
  data_postagem: string;
  descricao?: string | null;
  observacoes?: string | null;
  publicado?: boolean;
}

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

export function useFolhaPagamento(ano?: number, includeUnpublished = false) {
  return useQuery({
    queryKey: ['folha-pagamento', ano, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('folha_pagamento')
        .select('*')
        .order('ano_referencia', { ascending: false })
        .order('mes_referencia', { ascending: false });

      if (ano) {
        query = query.eq('ano_referencia', ano);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FolhaPagamento[];
    },
  });
}

export function useCreateFolhaPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FolhaPagamentoInput) => {
      const { data, error } = await supabase
        .from('folha_pagamento')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha-pagamento'] });
    },
  });
}

export function useUpdateFolhaPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: FolhaPagamentoInput & { id: string }) => {
      const { data, error } = await supabase
        .from('folha_pagamento')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha-pagamento'] });
    },
  });
}

export function useDeleteFolhaPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('folha_pagamento')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha-pagamento'] });
    },
  });
}
