import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrgaoAdministracao {
  id: string;
  nome: string;
  icone: string;
  competencia: string | null;
  responsavel: string | null;
  contato: string | null;
  email: string | null;
  base_legal: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnidadeVinculada {
  id: string;
  secretaria: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  itens?: UnidadeVinculadaItem[];
}

export interface UnidadeVinculadaItem {
  id: string;
  unidade_vinculada_id: string;
  nome: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

// Hooks para Órgãos de Administração
export function useOrgaosAdministracao() {
  return useQuery({
    queryKey: ["orgaos-administracao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orgaos_administracao")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;
      return data as OrgaoAdministracao[];
    },
  });
}

export function useOrgaosAdministracaoAdmin() {
  return useQuery({
    queryKey: ["orgaos-administracao-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orgaos_administracao")
        .select("*")
        .order("ordem");

      if (error) throw error;
      return data as OrgaoAdministracao[];
    },
  });
}

export function useCreateOrgao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orgao: Omit<OrgaoAdministracao, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("orgaos_administracao")
        .insert(orgao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgaos-administracao"] });
      queryClient.invalidateQueries({ queryKey: ["orgaos-administracao-admin"] });
    },
  });
}

export function useUpdateOrgao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...orgao }: Partial<OrgaoAdministracao> & { id: string }) => {
      const { data, error } = await supabase
        .from("orgaos_administracao")
        .update(orgao)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgaos-administracao"] });
      queryClient.invalidateQueries({ queryKey: ["orgaos-administracao-admin"] });
    },
  });
}

export function useDeleteOrgao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("orgaos_administracao")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgaos-administracao"] });
      queryClient.invalidateQueries({ queryKey: ["orgaos-administracao-admin"] });
    },
  });
}

// Hooks para Unidades Vinculadas
export function useUnidadesVinculadas() {
  return useQuery({
    queryKey: ["unidades-vinculadas"],
    queryFn: async () => {
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_vinculadas")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (unidadesError) throw unidadesError;

      const { data: itens, error: itensError } = await supabase
        .from("unidades_vinculadas_itens")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (itensError) throw itensError;

      // Combinar unidades com seus itens
      const unidadesComItens = unidades.map((unidade) => ({
        ...unidade,
        itens: itens.filter((item) => item.unidade_vinculada_id === unidade.id),
      }));

      return unidadesComItens as UnidadeVinculada[];
    },
  });
}

export function useUnidadesVinculadasAdmin() {
  return useQuery({
    queryKey: ["unidades-vinculadas-admin"],
    queryFn: async () => {
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_vinculadas")
        .select("*")
        .order("ordem");

      if (unidadesError) throw unidadesError;

      const { data: itens, error: itensError } = await supabase
        .from("unidades_vinculadas_itens")
        .select("*")
        .order("ordem");

      if (itensError) throw itensError;

      const unidadesComItens = unidades.map((unidade) => ({
        ...unidade,
        itens: itens.filter((item) => item.unidade_vinculada_id === unidade.id),
      }));

      return unidadesComItens as UnidadeVinculada[];
    },
  });
}

export function useCreateUnidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unidade: Omit<UnidadeVinculada, "id" | "created_at" | "updated_at" | "itens">) => {
      const { data, error } = await supabase
        .from("unidades_vinculadas")
        .insert(unidade)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas"] });
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas-admin"] });
    },
  });
}

export function useUpdateUnidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...unidade }: Partial<UnidadeVinculada> & { id: string }) => {
      const { itens, ...rest } = unidade as any;
      const { data, error } = await supabase
        .from("unidades_vinculadas")
        .update(rest)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas"] });
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas-admin"] });
    },
  });
}

export function useDeleteUnidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("unidades_vinculadas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas"] });
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas-admin"] });
    },
  });
}

// Hooks para Itens de Unidades
export function useCreateUnidadeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<UnidadeVinculadaItem, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("unidades_vinculadas_itens")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas"] });
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas-admin"] });
    },
  });
}

export function useUpdateUnidadeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<UnidadeVinculadaItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("unidades_vinculadas_itens")
        .update(item)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas"] });
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas-admin"] });
    },
  });
}

export function useDeleteUnidadeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("unidades_vinculadas_itens")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas"] });
      queryClient.invalidateQueries({ queryKey: ["unidades-vinculadas-admin"] });
    },
  });
}
