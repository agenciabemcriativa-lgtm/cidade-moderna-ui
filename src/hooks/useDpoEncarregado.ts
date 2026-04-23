import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DpoEncarregado {
  id: string;
  nome: string;
  cargo: string | null;
  email: string;
  telefone: string | null;
  portaria_nomeacao: string | null;
  data_nomeacao: string | null;
  observacoes: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type DpoEncarregadoInput = Omit<DpoEncarregado, "id" | "created_at" | "updated_at">;

export function useDpoEncarregado(includeInactive = false) {
  return useQuery({
    queryKey: ["dpo_encarregado", includeInactive],
    queryFn: async () => {
      let q = supabase.from("dpo_encarregado").select("*").order("created_at", { ascending: false });
      if (!includeInactive) q = q.eq("ativo", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DpoEncarregado[];
    },
  });
}

export function useDpoAtivo() {
  return useQuery({
    queryKey: ["dpo_encarregado_ativo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dpo_encarregado")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as DpoEncarregado | null;
    },
  });
}

export function useCreateDpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: DpoEncarregadoInput) => {
      const { data, error } = await supabase.from("dpo_encarregado").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dpo_encarregado"] });
      qc.invalidateQueries({ queryKey: ["dpo_encarregado_ativo"] });
      toast.success("Encarregado cadastrado com sucesso");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao cadastrar"),
  });
}

export function useUpdateDpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & Partial<DpoEncarregadoInput>) => {
      const { data, error } = await supabase.from("dpo_encarregado").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dpo_encarregado"] });
      qc.invalidateQueries({ queryKey: ["dpo_encarregado_ativo"] });
      toast.success("Encarregado atualizado");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao atualizar"),
  });
}

export function useDeleteDpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("dpo_encarregado").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dpo_encarregado"] });
      qc.invalidateQueries({ queryKey: ["dpo_encarregado_ativo"] });
      toast.success("Encarregado removido");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao excluir"),
  });
}
