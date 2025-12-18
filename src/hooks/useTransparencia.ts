import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransparenciaCategoria {
  id: string;
  titulo: string;
  descricao: string | null;
  icone: string | null;
  cor: string | null;
  ordem: number | null;
  ativo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransparenciaItem {
  id: string;
  categoria_id: string;
  titulo: string;
  url: string;
  externo: boolean | null;
  ordem: number | null;
  ativo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransparenciaLinkRapido {
  id: string;
  titulo: string;
  url: string;
  icone: string | null;
  ordem: number | null;
  ativo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CategoriaComItens extends TransparenciaCategoria {
  itens: TransparenciaItem[];
}

// Fetch all categories with items
export function useTransparenciaCategorias(includeInactive = false) {
  return useQuery({
    queryKey: ['transparencia-categorias', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('transparencia_categorias')
        .select('*')
        .order('ordem', { ascending: true });

      if (!includeInactive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TransparenciaCategoria[];
    },
  });
}

// Fetch items for a category
export function useTransparenciaItens(categoriaId?: string, includeInactive = false) {
  return useQuery({
    queryKey: ['transparencia-itens', categoriaId, includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('transparencia_itens')
        .select('*')
        .order('ordem', { ascending: true });

      if (categoriaId) {
        query = query.eq('categoria_id', categoriaId);
      }

      if (!includeInactive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TransparenciaItem[];
    },
    enabled: categoriaId !== undefined || !categoriaId,
  });
}

// Fetch categories with their items
export function useTransparenciaCategoriasComItens(includeInactive = false) {
  return useQuery({
    queryKey: ['transparencia-categorias-com-itens', includeInactive],
    queryFn: async () => {
      // Fetch categories
      let categoriasQuery = supabase
        .from('transparencia_categorias')
        .select('*')
        .order('ordem', { ascending: true });

      if (!includeInactive) {
        categoriasQuery = categoriasQuery.eq('ativo', true);
      }

      const { data: categorias, error: categoriasError } = await categoriasQuery;
      if (categoriasError) throw categoriasError;

      // Fetch all items
      let itensQuery = supabase
        .from('transparencia_itens')
        .select('*')
        .order('ordem', { ascending: true });

      if (!includeInactive) {
        itensQuery = itensQuery.eq('ativo', true);
      }

      const { data: itens, error: itensError } = await itensQuery;
      if (itensError) throw itensError;

      // Combine categories with their items
      const categoriasComItens: CategoriaComItens[] = (categorias || []).map(cat => ({
        ...cat,
        itens: (itens || []).filter(item => item.categoria_id === cat.id)
      }));

      return categoriasComItens;
    },
  });
}

// Fetch quick access links
export function useTransparenciaLinksRapidos(includeInactive = false) {
  return useQuery({
    queryKey: ['transparencia-links-rapidos', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('transparencia_links_rapidos')
        .select('*')
        .order('ordem', { ascending: true });

      if (!includeInactive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TransparenciaLinkRapido[];
    },
  });
}

// Category mutations
export function useCreateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoria: Omit<TransparenciaCategoria, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transparencia_categorias')
        .insert(categoria)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias'] });
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias-com-itens'] });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...categoria }: Partial<TransparenciaCategoria> & { id: string }) => {
      const { data, error } = await supabase
        .from('transparencia_categorias')
        .update({ ...categoria, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias'] });
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias-com-itens'] });
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transparencia_categorias')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias'] });
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias-com-itens'] });
    },
  });
}

// Item mutations
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<TransparenciaItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transparencia_itens')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-itens'] });
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias-com-itens'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<TransparenciaItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('transparencia_itens')
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-itens'] });
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias-com-itens'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transparencia_itens')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-itens'] });
      queryClient.invalidateQueries({ queryKey: ['transparencia-categorias-com-itens'] });
    },
  });
}

// Quick link mutations
export function useCreateLinkRapido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: Omit<TransparenciaLinkRapido, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transparencia_links_rapidos')
        .insert(link)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-links-rapidos'] });
    },
  });
}

export function useUpdateLinkRapido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...link }: Partial<TransparenciaLinkRapido> & { id: string }) => {
      const { data, error } = await supabase
        .from('transparencia_links_rapidos')
        .update({ ...link, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-links-rapidos'] });
    },
  });
}

export function useDeleteLinkRapido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transparencia_links_rapidos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia-links-rapidos'] });
    },
  });
}
