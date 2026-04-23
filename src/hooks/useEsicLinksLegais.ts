import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EsicLinkLegal {
  id: string;
  titulo: string;
  url: string;
  tipo: "externo" | "interno";
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type EsicLinkLegalInput = Omit<EsicLinkLegal, "id" | "created_at" | "updated_at">;

export function useEsicLinksLegais(includeInactive = false) {
  return useQuery({
    queryKey: ["esic_links_legais", includeInactive],
    queryFn: async () => {
      let q = supabase.from("esic_links_legais").select("*").order("ordem", { ascending: true });
      if (!includeInactive) q = q.eq("ativo", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as EsicLinkLegal[];
    },
  });
}

export function useCreateEsicLinkLegal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EsicLinkLegalInput) => {
      const { data, error } = await supabase.from("esic_links_legais").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["esic_links_legais"] });
      toast.success("Link criado com sucesso");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao criar link"),
  });
}

export function useUpdateEsicLinkLegal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & Partial<EsicLinkLegalInput>) => {
      const { data, error } = await supabase.from("esic_links_legais").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["esic_links_legais"] });
      toast.success("Link atualizado");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao atualizar"),
  });
}

export function useDeleteEsicLinkLegal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("esic_links_legais").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["esic_links_legais"] });
      toast.success("Link removido");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao excluir"),
  });
}
