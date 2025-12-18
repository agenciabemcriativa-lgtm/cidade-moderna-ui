import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TipoDocumentoLegislacao = 
  | 'lei_organica'
  | 'ppa'
  | 'ldo'
  | 'loa'
  | 'emenda_lei_organica'
  | 'outro';

export interface DocumentoLegislacao {
  id: string;
  titulo: string;
  tipo: TipoDocumentoLegislacao;
  ano: number;
  descricao: string | null;
  arquivo_url: string;
  arquivo_nome: string;
  vigente: boolean;
  data_publicacao: string;
  observacoes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const tipoDocumentoLabels: Record<TipoDocumentoLegislacao, string> = {
  lei_organica: 'Lei Orgânica',
  ppa: 'PPA - Plano Plurianual',
  ldo: 'LDO - Lei de Diretrizes Orçamentárias',
  loa: 'LOA - Lei Orçamentária Anual',
  emenda_lei_organica: 'Emenda à Lei Orgânica',
  outro: 'Outro',
};

interface UseDocumentosParams {
  tipo?: TipoDocumentoLegislacao;
  ano?: number;
  vigente?: boolean;
}

export function useDocumentosLegislacao(params: UseDocumentosParams = {}) {
  const { tipo, ano, vigente } = params;

  return useQuery({
    queryKey: ['documentos-legislacao', params],
    queryFn: async () => {
      let query = supabase
        .from('documentos_legislacao')
        .select('*')
        .order('ano', { ascending: false })
        .order('data_publicacao', { ascending: false });

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (ano) {
        query = query.eq('ano', ano);
      }

      if (vigente !== undefined) {
        query = query.eq('vigente', vigente);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as DocumentoLegislacao[];
    },
  });
}

export function useDocumentoLegislacao(id: string) {
  return useQuery({
    queryKey: ['documento-legislacao', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentos_legislacao')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as DocumentoLegislacao | null;
    },
    enabled: !!id,
  });
}

export function useCreateDocumentoLegislacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documento: Omit<DocumentoLegislacao, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('documentos_legislacao')
        .insert({
          ...documento,
          created_by: user?.id,
          updated_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-legislacao'] });
    },
  });
}

export function useUpdateDocumentoLegislacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...documento }: Partial<DocumentoLegislacao> & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('documentos_legislacao')
        .update({
          ...documento,
          updated_by: user?.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-legislacao'] });
    },
  });
}

export function useDeleteDocumentoLegislacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documentos_legislacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-legislacao'] });
    },
  });
}
