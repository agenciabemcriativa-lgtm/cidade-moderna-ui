import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type CategoriaDadosAbertos = 'receitas' | 'despesas' | 'licitacoes' | 'contratos' | 'servidores' | 'obras' | 'patrimonio' | 'outros';
export type FormatoArquivo = 'csv' | 'xls' | 'xlsx' | 'pdf' | 'json' | 'xml' | 'outros';

export interface DadosAbertos {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: CategoriaDadosAbertos;
  formato: FormatoArquivo;
  arquivo_url: string;
  arquivo_nome: string;
  tamanho_bytes: number | null;
  data_referencia: string | null;
  periodicidade: string | null;
  fonte: string | null;
  ultima_atualizacao: string;
  quantidade_registros: number | null;
  link_sistema_origem: string | null;
  observacoes: string | null;
  publicado: boolean | null;
  ordem: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export const categoriaDadosAbertosLabels: Record<CategoriaDadosAbertos, string> = {
  receitas: 'Receitas',
  despesas: 'Despesas',
  licitacoes: 'Licitações',
  contratos: 'Contratos',
  servidores: 'Servidores',
  obras: 'Obras',
  patrimonio: 'Patrimônio',
  outros: 'Outros',
};

export const formatoArquivoLabels: Record<FormatoArquivo, string> = {
  csv: 'CSV',
  xls: 'XLS',
  xlsx: 'XLSX',
  pdf: 'PDF',
  json: 'JSON',
  xml: 'XML',
  outros: 'Outros',
};

export function useDadosAbertos(categoria?: CategoriaDadosAbertos, includeUnpublished = false) {
  return useQuery({
    queryKey: ['dados_abertos', categoria, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('dados_abertos')
        .select('*')
        .order('categoria', { ascending: true })
        .order('ordem', { ascending: true });

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DadosAbertos[];
    },
  });
}

export function useCreateDadosAbertos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<DadosAbertos, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('dados_abertos')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dados_abertos'] });
    },
  });
}

export function useUpdateDadosAbertos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<DadosAbertos> & { id: string }) => {
      const { data, error } = await supabase
        .from('dados_abertos')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dados_abertos'] });
    },
  });
}

export function useDeleteDadosAbertos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dados_abertos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dados_abertos'] });
    },
  });
}
