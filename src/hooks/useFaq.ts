import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FaqCategoria {
  id: string;
  titulo: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqPergunta {
  id: string;
  categoria_id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqCategoriaWithPerguntas extends FaqCategoria {
  perguntas: FaqPergunta[];
}

export function useFaqCategorias() {
  return useQuery({
    queryKey: ["faq-categorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_categorias")
        .select("*")
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as FaqCategoria[];
    },
  });
}

export function useFaqPerguntas(categoriaId?: string) {
  return useQuery({
    queryKey: ["faq-perguntas", categoriaId],
    queryFn: async () => {
      let query = supabase
        .from("faq_perguntas")
        .select("*")
        .order("ordem", { ascending: true });

      if (categoriaId) {
        query = query.eq("categoria_id", categoriaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FaqPergunta[];
    },
  });
}

export function useFaqCategoriasWithPerguntas() {
  return useQuery({
    queryKey: ["faq-categorias-with-perguntas"],
    queryFn: async () => {
      const { data: categorias, error: catError } = await supabase
        .from("faq_categorias")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (catError) throw catError;

      const { data: perguntas, error: pergError } = await supabase
        .from("faq_perguntas")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (pergError) throw pergError;

      const result: FaqCategoriaWithPerguntas[] = (categorias || []).map((cat) => ({
        ...cat,
        perguntas: (perguntas || []).filter((p) => p.categoria_id === cat.id),
      }));

      return result.filter((cat) => cat.perguntas.length > 0);
    },
  });
}

// Mutations para Categorias
export function useCreateFaqCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<FaqCategoria, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("faq_categorias")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categorias"] });
      queryClient.invalidateQueries({ queryKey: ["faq-categorias-with-perguntas"] });
      toast({ title: "Categoria criada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar categoria", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateFaqCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<FaqCategoria> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("faq_categorias")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categorias"] });
      queryClient.invalidateQueries({ queryKey: ["faq-categorias-with-perguntas"] });
      toast({ title: "Categoria atualizada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar categoria", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteFaqCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faq_categorias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categorias"] });
      queryClient.invalidateQueries({ queryKey: ["faq-categorias-with-perguntas"] });
      toast({ title: "Categoria excluída com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir categoria", description: error.message, variant: "destructive" });
    },
  });
}

// Mutations para Perguntas
export function useCreateFaqPergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<FaqPergunta, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("faq_perguntas")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-perguntas"] });
      queryClient.invalidateQueries({ queryKey: ["faq-categorias-with-perguntas"] });
      toast({ title: "Pergunta criada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar pergunta", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateFaqPergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<FaqPergunta> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("faq_perguntas")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-perguntas"] });
      queryClient.invalidateQueries({ queryKey: ["faq-categorias-with-perguntas"] });
      toast({ title: "Pergunta atualizada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar pergunta", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteFaqPergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faq_perguntas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-perguntas"] });
      queryClient.invalidateQueries({ queryKey: ["faq-categorias-with-perguntas"] });
      toast({ title: "Pergunta excluída com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir pergunta", description: error.message, variant: "destructive" });
    },
  });
}
