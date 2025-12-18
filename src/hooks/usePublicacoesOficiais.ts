import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TipoPublicacao = 
  | 'lei'
  | 'decreto'
  | 'portaria'
  | 'resolucao'
  | 'instrucao_normativa'
  | 'ato_administrativo'
  | 'edital'
  | 'comunicado'
  | 'outros';

export type SituacaoPublicacao = 'vigente' | 'revogado' | 'alterado';

export interface PublicacaoOficial {
  id: string;
  titulo: string;
  tipo: TipoPublicacao;
  numero: string;
  ano: number;
  data_publicacao: string;
  secretaria_id: string | null;
  secretaria_nome: string | null;
  ementa: string;
  texto_completo_url: string | null;
  situacao: SituacaoPublicacao;
  publicacao_relacionada_id: string | null;
  observacoes: string | null;
  publicado: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const tipoLabels: Record<TipoPublicacao, string> = {
  lei: 'Lei',
  decreto: 'Decreto',
  portaria: 'Portaria',
  resolucao: 'Resolução',
  instrucao_normativa: 'Instrução Normativa',
  ato_administrativo: 'Ato Administrativo',
  edital: 'Edital',
  comunicado: 'Comunicado',
  outros: 'Outros',
};

export const situacaoLabels: Record<SituacaoPublicacao, string> = {
  vigente: 'Vigente',
  revogado: 'Revogado',
  alterado: 'Alterado',
};

export const situacaoColors: Record<SituacaoPublicacao, string> = {
  vigente: 'bg-green-100 text-green-800',
  revogado: 'bg-red-100 text-red-800',
  alterado: 'bg-yellow-100 text-yellow-800',
};

interface UsePublicacoesParams {
  ano?: number;
  tipo?: TipoPublicacao;
  situacao?: SituacaoPublicacao;
  secretariaId?: string;
  search?: string;
  publicado?: boolean;
}

export function usePublicacoesOficiais(params: UsePublicacoesParams = {}) {
  const { ano, tipo, situacao, secretariaId, search, publicado = true } = params;

  return useQuery({
    queryKey: ['publicacoes-oficiais', params],
    queryFn: async () => {
      let query = supabase
        .from('publicacoes_oficiais')
        .select('*')
        .order('data_publicacao', { ascending: false });

      if (publicado !== undefined) {
        query = query.eq('publicado', publicado);
      }

      if (ano) {
        query = query.eq('ano', ano);
      }

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (situacao) {
        query = query.eq('situacao', situacao);
      }

      if (secretariaId) {
        query = query.eq('secretaria_id', secretariaId);
      }

      if (search) {
        query = query.or(`titulo.ilike.%${search}%,ementa.ilike.%${search}%,numero.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PublicacaoOficial[];
    },
  });
}

export function usePublicacaoOficial(id: string) {
  return useQuery({
    queryKey: ['publicacao-oficial', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publicacoes_oficiais')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as PublicacaoOficial | null;
    },
    enabled: !!id,
  });
}

export function useAnosPublicacoes() {
  return useQuery({
    queryKey: ['anos-publicacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publicacoes_oficiais')
        .select('ano')
        .eq('publicado', true)
        .order('ano', { ascending: false });

      if (error) throw error;
      const anos = [...new Set(data?.map(d => d.ano) || [])];
      return anos;
    },
  });
}

export function useCreatePublicacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (publicacao: Omit<PublicacaoOficial, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('publicacoes_oficiais')
        .insert(publicacao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicacoes-oficiais'] });
      queryClient.invalidateQueries({ queryKey: ['anos-publicacoes'] });
    },
  });
}

export function useUpdatePublicacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...publicacao }: Partial<PublicacaoOficial> & { id: string }) => {
      const { data, error } = await supabase
        .from('publicacoes_oficiais')
        .update(publicacao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicacoes-oficiais'] });
      queryClient.invalidateQueries({ queryKey: ['publicacao-oficial'] });
    },
  });
}

export function useAddHistorico() {
  return useMutation({
    mutationFn: async (historico: {
      publicacao_id: string;
      campo_alterado: string;
      valor_anterior: string | null;
      valor_novo: string | null;
    }) => {
      const { data, error } = await supabase
        .from('publicacoes_historico')
        .insert(historico)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}
