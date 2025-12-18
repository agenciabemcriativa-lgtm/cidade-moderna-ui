import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type StatusObra = 'em_andamento' | 'concluida' | 'paralisada' | 'planejada';
export type FonteRecursoObra = 'proprio' | 'federal' | 'estadual' | 'convenio' | 'financiamento' | 'outros';

export interface ObraPublica {
  id: string;
  titulo: string;
  objeto: string;
  descricao: string | null;
  valor_contratado: number | null;
  valor_executado: number | null;
  empresa_executora: string | null;
  cnpj_empresa: string | null;
  data_inicio: string | null;
  data_previsao_termino: string | null;
  data_conclusao: string | null;
  prazo_execucao_dias: number | null;
  fonte_recurso: FonteRecursoObra | null;
  fonte_recurso_descricao: string | null;
  localizacao: string | null;
  secretaria_responsavel: string | null;
  fiscal_obra: string | null;
  status: StatusObra | null;
  percentual_execucao: number | null;
  numero_contrato: string | null;
  link_sistema_oficial: string | null;
  foto_url: string | null;
  observacoes: string | null;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const statusObraLabels: Record<StatusObra, string> = {
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  paralisada: 'Paralisada',
  planejada: 'Planejada',
};

export const fonteRecursoLabels: Record<FonteRecursoObra, string> = {
  proprio: 'Recurso Próprio',
  federal: 'Federal',
  estadual: 'Estadual',
  convenio: 'Convênio',
  financiamento: 'Financiamento',
  outros: 'Outros',
};

export function useObrasPublicas(status?: StatusObra, includeUnpublished = false) {
  return useQuery({
    queryKey: ['obras_publicas', status, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('obras_publicas')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ObraPublica[];
    },
  });
}

export function useObraPublica(id: string) {
  return useQuery({
    queryKey: ['obra_publica', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('obras_publicas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as ObraPublica;
    },
    enabled: !!id,
  });
}

export function useCreateObraPublica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (obra: Omit<ObraPublica, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('obras_publicas')
        .insert(obra)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras_publicas'] });
    },
  });
}

export function useUpdateObraPublica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...obra }: Partial<ObraPublica> & { id: string }) => {
      const { data, error } = await supabase
        .from('obras_publicas')
        .update(obra)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras_publicas'] });
    },
  });
}

export function useDeleteObraPublica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('obras_publicas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras_publicas'] });
    },
  });
}
