import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type VinculoServidor = 'efetivo' | 'comissionado' | 'contratado' | 'temporario' | 'estagiario';

export interface FolhaPagamento {
  id: string;
  nome_servidor: string;
  matricula: string | null;
  cargo: string;
  secretaria: string | null;
  vinculo: string | null;
  carga_horaria: number | null;
  salario_base: number;
  gratificacoes: number | null;
  adicionais: number | null;
  outros_proventos: number | null;
  total_bruto: number | null;
  inss: number | null;
  irrf: number | null;
  outros_descontos: number | null;
  total_descontos: number | null;
  salario_liquido: number | null;
  mes_referencia: number;
  ano_referencia: number;
  observacoes: string | null;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const vinculoLabels: Record<string, string> = {
  efetivo: 'Efetivo',
  comissionado: 'Comissionado',
  contratado: 'Contratado',
  temporario: 'Temporário',
  estagiario: 'Estagiário',
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

export function useFolhaPagamento(ano?: number, mes?: number, includeUnpublished = false) {
  return useQuery({
    queryKey: ['folha_pagamento', ano, mes, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('folha_pagamento')
        .select('*')
        .order('nome_servidor', { ascending: true });

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
      return data as FolhaPagamento[];
    },
  });
}

export interface FolhaPagamentoInput {
  nome_servidor: string;
  matricula?: string | null;
  cargo: string;
  secretaria?: string | null;
  vinculo?: string | null;
  carga_horaria?: number | null;
  salario_base: number;
  gratificacoes?: number | null;
  adicionais?: number | null;
  outros_proventos?: number | null;
  inss?: number | null;
  irrf?: number | null;
  outros_descontos?: number | null;
  mes_referencia: number;
  ano_referencia: number;
  observacoes?: string | null;
  publicado?: boolean | null;
}

export function useCreateFolhaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: FolhaPagamentoInput) => {
      // Calcular totais
      const total_bruto = (item.salario_base || 0) + (item.gratificacoes || 0) + (item.adicionais || 0) + (item.outros_proventos || 0);
      const total_descontos = (item.inss || 0) + (item.irrf || 0) + (item.outros_descontos || 0);
      const salario_liquido = total_bruto - total_descontos;

      const { data, error } = await supabase
        .from('folha_pagamento')
        .insert({ ...item, total_bruto, total_descontos, salario_liquido })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha_pagamento'] });
    },
  });
}

export function useUpdateFolhaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<FolhaPagamento> & { id: string }) => {
      // Calcular totais se os valores estiverem presentes
      let updateData: any = { ...item };
      
      if (item.salario_base !== undefined) {
        const total_bruto = (item.salario_base || 0) + (item.gratificacoes || 0) + (item.adicionais || 0) + (item.outros_proventos || 0);
        const total_descontos = (item.inss || 0) + (item.irrf || 0) + (item.outros_descontos || 0);
        const salario_liquido = total_bruto - total_descontos;
        updateData = { ...updateData, total_bruto, total_descontos, salario_liquido };
      }

      const { data, error } = await supabase
        .from('folha_pagamento')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha_pagamento'] });
    },
  });
}

export function useDeleteFolhaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('folha_pagamento').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha_pagamento'] });
    },
  });
}
