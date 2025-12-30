import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TipoDocumentoPessoal = 'estagiarios' | 'remuneracao_cargo' | 'servidores' | 'lista_nominal_cargo' | 'terceirizados';

export interface DocumentoPessoal {
  id: string;
  tipo: TipoDocumentoPessoal;
  titulo: string;
  mes_referencia: number;
  ano_referencia: number;
  arquivo_nome: string;
  arquivo_url: string;
  descricao: string | null;
  observacoes: string | null;
  data_postagem: string;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DocumentoPessoalInput {
  tipo: TipoDocumentoPessoal;
  titulo: string;
  mes_referencia: number;
  ano_referencia: number;
  arquivo_nome: string;
  arquivo_url: string;
  descricao?: string;
  observacoes?: string;
  data_postagem?: string;
  publicado?: boolean;
}

export const tipoLabels: Record<TipoDocumentoPessoal, string> = {
  estagiarios: 'Lista de Estagiários',
  remuneracao_cargo: 'Remuneração de Cargo',
  servidores: 'Servidores',
  lista_nominal_cargo: 'Lista Nominal por Cargo',
  terceirizados: 'Lista de Terceirizados',
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

export function useDocumentosPessoal(tipo: TipoDocumentoPessoal, ano?: number, includeUnpublished = false) {
  return useQuery({
    queryKey: ['documentos-pessoal', tipo, ano, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('documentos_pessoal')
        .select('*')
        .eq('tipo', tipo)
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
      return data as DocumentoPessoal[];
    },
  });
}

export function useCreateDocumentoPessoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DocumentoPessoalInput) => {
      const { data, error } = await supabase
        .from('documentos_pessoal')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-pessoal'] });
    },
  });
}

export function useUpdateDocumentoPessoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: DocumentoPessoalInput & { id: string }) => {
      const { data, error } = await supabase
        .from('documentos_pessoal')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-pessoal'] });
    },
  });
}

export function useDeleteDocumentoPessoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documentos_pessoal')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-pessoal'] });
    },
  });
}
