import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CartaServico {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  categoria: string;
  requisitos: string | null;
  documentos_necessarios: string | null;
  etapas_atendimento: string | null;
  prazo_maximo: string | null;
  prazo_medio: string | null;
  forma_prestacao: string;
  canal_acesso: string | null;
  local_atendimento: string | null;
  horario_atendimento: string | null;
  telefone: string | null;
  email: string | null;
  site_url: string | null;
  gratuito: boolean;
  custos_taxas: string | null;
  prioridades_atendimento: string | null;
  tempo_espera_estimado: string | null;
  mecanismo_consulta: string | null;
  procedimento_manifestacao: string | null;
  base_legal: string | null;
  orgao_responsavel: string | null;
  secretaria_id: string | null;
  publicado: boolean;
  destaque: boolean;
  ordem: number;
  created_at: string | null;
  updated_at: string | null;
}

export type CartaServicoInsert = {
  titulo: string;
  slug: string;
  descricao: string;
  categoria: string;
  forma_prestacao: string;
  gratuito: boolean;
  publicado: boolean;
  destaque: boolean;
  ordem: number;
  requisitos?: string | null;
  documentos_necessarios?: string | null;
  etapas_atendimento?: string | null;
  prazo_maximo?: string | null;
  prazo_medio?: string | null;
  canal_acesso?: string | null;
  local_atendimento?: string | null;
  horario_atendimento?: string | null;
  telefone?: string | null;
  email?: string | null;
  site_url?: string | null;
  custos_taxas?: string | null;
  prioridades_atendimento?: string | null;
  tempo_espera_estimado?: string | null;
  mecanismo_consulta?: string | null;
  procedimento_manifestacao?: string | null;
  base_legal?: string | null;
  orgao_responsavel?: string | null;
  secretaria_id?: string | null;
};
export type CartaServicoUpdate = Partial<CartaServicoInsert>;

export function useCartaServicos() {
  return useQuery({
    queryKey: ["carta-servicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .select("*")
        .eq("publicado", true)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as CartaServico[];
    },
  });
}

export function useCartaServicosAdmin() {
  return useQuery({
    queryKey: ["carta-servicos-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .select("*")
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as CartaServico[];
    },
  });
}

export function useCartaServico(slug: string) {
  return useQuery({
    queryKey: ["carta-servico", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .select("*")
        .eq("slug", slug)
        .eq("publicado", true)
        .maybeSingle();

      if (error) throw error;
      return data as CartaServico | null;
    },
    enabled: !!slug,
  });
}

export function useCartaServicoById(id: string) {
  return useQuery({
    queryKey: ["carta-servico-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as CartaServico | null;
    },
    enabled: !!id,
  });
}

export function useCartaServicosByCategoria(categoria: string) {
  return useQuery({
    queryKey: ["carta-servicos-categoria", categoria],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .select("*")
        .eq("categoria", categoria)
        .eq("publicado", true)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as CartaServico[];
    },
    enabled: !!categoria,
  });
}

export function useCartaServicoCategorias() {
  return useQuery({
    queryKey: ["carta-servico-categorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .select("categoria")
        .eq("publicado", true);

      if (error) throw error;
      
      const categorias = [...new Set(data.map(item => item.categoria))].sort();
      return categorias;
    },
  });
}

export function useCreateCartaServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (servico: CartaServicoInsert) => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .insert(servico)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carta-servicos"] });
      queryClient.invalidateQueries({ queryKey: ["carta-servicos-admin"] });
    },
  });
}

export function useUpdateCartaServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CartaServicoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("carta_servicos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carta-servicos"] });
      queryClient.invalidateQueries({ queryKey: ["carta-servicos-admin"] });
    },
  });
}

export function useDeleteCartaServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("carta_servicos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carta-servicos"] });
      queryClient.invalidateQueries({ queryKey: ["carta-servicos-admin"] });
    },
  });
}
