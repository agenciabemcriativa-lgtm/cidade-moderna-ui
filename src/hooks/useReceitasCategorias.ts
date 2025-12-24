import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ReceitaCategoria {
  id: string;
  titulo: string;
  url: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Buscar categorias públicas (ativas)
export function useReceitasCategorias() {
  return useQuery({
    queryKey: ['receitas-categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receitas_categorias')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ReceitaCategoria[];
    },
  });
}

// Buscar todas as categorias (incluindo inativas) - para admin
export function useReceitasCategoriasAdmin() {
  return useQuery({
    queryKey: ['receitas-categorias-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receitas_categorias')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ReceitaCategoria[];
    },
  });
}

// Criar categoria
export function useCreateReceitaCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoria: Omit<ReceitaCategoria, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('receitas_categorias')
        .insert(categoria)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas-categorias'] });
      queryClient.invalidateQueries({ queryKey: ['receitas-categorias-admin'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar categoria: ' + error.message);
    },
  });
}

// Atualizar categoria
export function useUpdateReceitaCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ReceitaCategoria> & { id: string }) => {
      const { data, error } = await supabase
        .from('receitas_categorias')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas-categorias'] });
      queryClient.invalidateQueries({ queryKey: ['receitas-categorias-admin'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar categoria: ' + error.message);
    },
  });
}

// Deletar categoria
export function useDeleteReceitaCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('receitas_categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas-categorias'] });
      queryClient.invalidateQueries({ queryKey: ['receitas-categorias-admin'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir categoria: ' + error.message);
    },
  });
}
