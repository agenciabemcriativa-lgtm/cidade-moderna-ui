import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TipoRelatorioFiscal = 'rreo' | 'rgf' | 'parecer_tce' | 'prestacao_contas';

export interface RelatorioFiscal {
  id: string;
  tipo: TipoRelatorioFiscal;
  titulo: string;
  descricao: string | null;
  ano: number;
  bimestre: number | null;
  quadrimestre: number | null;
  exercicio: string | null;
  data_publicacao: string;
  arquivo_url: string;
  arquivo_nome: string;
  observacoes: string | null;
  publicado: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export type RelatorioFiscalInsert = Omit<RelatorioFiscal, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>;
export type RelatorioFiscalUpdate = Partial<RelatorioFiscalInsert>;

export const tipoRelatorioLabels: Record<TipoRelatorioFiscal, string> = {
  rreo: 'RREO - Relatório Resumido',
  rgf: 'RGF - Relatório de Gestão Fiscal',
  parecer_tce: 'Pareceres do TCE',
  prestacao_contas: 'Prestação de Contas',
};

export const bimestreLabels: Record<number, string> = {
  1: '1º Bimestre',
  2: '2º Bimestre',
  3: '3º Bimestre',
  4: '4º Bimestre',
  5: '5º Bimestre',
  6: '6º Bimestre',
};

export const quadrimestreLabels: Record<number, string> = {
  1: '1º Quadrimestre',
  2: '2º Quadrimestre',
  3: '3º Quadrimestre',
};

export function useRelatoriosFiscais(
  tipo?: TipoRelatorioFiscal,
  ano?: number,
  includeUnpublished = false
) {
  return useQuery({
    queryKey: ['relatorios_fiscais', tipo, ano, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('relatorios_fiscais')
        .select('*')
        .order('ano', { ascending: false })
        .order('data_publicacao', { ascending: false });

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (ano) {
        query = query.eq('ano', ano);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as RelatorioFiscal[];
    },
  });
}

export function useRelatorioFiscal(id: string) {
  return useQuery({
    queryKey: ['relatorio_fiscal', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('relatorios_fiscais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as RelatorioFiscal;
    },
    enabled: !!id,
  });
}

export function useCreateRelatorioFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (relatorio: RelatorioFiscalInsert) => {
      const { data, error } = await supabase
        .from('relatorios_fiscais')
        .insert(relatorio)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios_fiscais'] });
    },
  });
}

export function useUpdateRelatorioFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...relatorio }: RelatorioFiscalUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('relatorios_fiscais')
        .update(relatorio)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios_fiscais'] });
    },
  });
}

export function useDeleteRelatorioFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('relatorios_fiscais')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios_fiscais'] });
    },
  });
}
