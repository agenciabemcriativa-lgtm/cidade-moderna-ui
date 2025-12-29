import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EmendaParlamentar {
  id: string;
  titulo: string;
  descricao?: string;
  arquivo_url: string;
  arquivo_nome: string;
  data_referencia: string;
  data_postagem: string;
  ano_referencia: number;
  observacoes?: string;
  publicado: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export type EmendaParlamentarInsert = Omit<EmendaParlamentar, 'id' | 'created_at' | 'updated_at'>;
export type EmendaParlamentarUpdate = Partial<EmendaParlamentarInsert>;

export function useEmendasParlamentares(includeUnpublished = false) {
  return useQuery({
    queryKey: ['emendas-parlamentares', includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('emendas_parlamentares')
        .select('*')
        .order('ano_referencia', { ascending: false })
        .order('data_referencia', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EmendaParlamentar[];
    },
  });
}

export function useCreateEmenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emenda: EmendaParlamentarInsert) => {
      const { data, error } = await supabase
        .from('emendas_parlamentares')
        .insert(emenda)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emendas-parlamentares'] });
    },
  });
}

export function useUpdateEmenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: EmendaParlamentarUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('emendas_parlamentares')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emendas-parlamentares'] });
    },
  });
}

export function useDeleteEmenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('emendas_parlamentares')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emendas-parlamentares'] });
    },
  });
}
