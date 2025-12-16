import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ModalidadeLicitacao = 
  | 'pregao_eletronico'
  | 'pregao_presencial'
  | 'concorrencia'
  | 'tomada_de_precos'
  | 'convite'
  | 'concurso'
  | 'leilao'
  | 'dialogo_competitivo'
  | 'dispensa'
  | 'inexigibilidade';

export type StatusLicitacao = 
  | 'aberta'
  | 'em_andamento'
  | 'encerrada'
  | 'cancelada'
  | 'suspensa'
  | 'deserta'
  | 'fracassada';

export type TipoDocumentoLicitacao = 
  | 'edital'
  | 'termo_referencia'
  | 'projeto_basico'
  | 'aviso'
  | 'ata'
  | 'resultado'
  | 'homologacao'
  | 'contrato'
  | 'aditivo'
  | 'impugnacao'
  | 'esclarecimento'
  | 'outros';

export interface Licitacao {
  id: string;
  numero_processo: string;
  modalidade: ModalidadeLicitacao;
  objeto: string;
  secretaria_id: string | null;
  secretaria_nome: string | null;
  data_abertura: string;
  data_encerramento: string | null;
  ano: number;
  status: StatusLicitacao;
  valor_estimado: number | null;
  observacoes: string | null;
  link_sistema_oficial: string | null;
  publicado: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentoLicitacao {
  id: string;
  licitacao_id: string;
  tipo: TipoDocumentoLicitacao;
  titulo: string;
  descricao: string | null;
  url: string;
  data_publicacao: string;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface LicitacaoComDocumentos extends Licitacao {
  documentos_licitacao: DocumentoLicitacao[];
}

export const modalidadeLabels: Record<ModalidadeLicitacao, string> = {
  pregao_eletronico: 'Pregão Eletrônico',
  pregao_presencial: 'Pregão Presencial',
  concorrencia: 'Concorrência',
  tomada_de_precos: 'Tomada de Preços',
  convite: 'Convite',
  concurso: 'Concurso',
  leilao: 'Leilão',
  dialogo_competitivo: 'Diálogo Competitivo',
  dispensa: 'Dispensa de Licitação',
  inexigibilidade: 'Inexigibilidade',
};

export const statusLabels: Record<StatusLicitacao, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  encerrada: 'Encerrada',
  cancelada: 'Cancelada',
  suspensa: 'Suspensa',
  deserta: 'Deserta',
  fracassada: 'Fracassada',
};

export const statusColors: Record<StatusLicitacao, string> = {
  aberta: 'bg-green-500',
  em_andamento: 'bg-blue-500',
  encerrada: 'bg-gray-500',
  cancelada: 'bg-red-500',
  suspensa: 'bg-yellow-500',
  deserta: 'bg-orange-500',
  fracassada: 'bg-red-700',
};

export const tipoDocumentoLabels: Record<TipoDocumentoLicitacao, string> = {
  edital: 'Edital',
  termo_referencia: 'Termo de Referência',
  projeto_basico: 'Projeto Básico',
  aviso: 'Aviso',
  ata: 'Ata',
  resultado: 'Resultado',
  homologacao: 'Homologação',
  contrato: 'Contrato',
  aditivo: 'Aditivo',
  impugnacao: 'Impugnação',
  esclarecimento: 'Esclarecimento',
  outros: 'Outros',
};

interface FetchLicitacoesParams {
  ano?: number;
  modalidade?: ModalidadeLicitacao;
  status?: StatusLicitacao;
  busca?: string;
  publicadoOnly?: boolean;
}

export function useLicitacoes(params: FetchLicitacoesParams = {}) {
  const { ano, modalidade, status, busca, publicadoOnly = true } = params;

  return useQuery({
    queryKey: ['licitacoes', { ano, modalidade, status, busca, publicadoOnly }],
    queryFn: async () => {
      let query = supabase
        .from('licitacoes')
        .select('*')
        .order('data_abertura', { ascending: false });

      if (publicadoOnly) {
        query = query.eq('publicado', true);
      }

      if (ano) {
        query = query.eq('ano', ano);
      }

      if (modalidade) {
        query = query.eq('modalidade', modalidade);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (busca) {
        query = query.or(`numero_processo.ilike.%${busca}%,objeto.ilike.%${busca}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Licitacao[];
    },
  });
}

export function useLicitacao(id: string) {
  return useQuery({
    queryKey: ['licitacao', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licitacoes')
        .select(`
          *,
          documentos_licitacao (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as LicitacaoComDocumentos | null;
    },
    enabled: !!id,
  });
}

export function useAnosLicitacoes() {
  return useQuery({
    queryKey: ['licitacoes-anos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licitacoes')
        .select('ano')
        .eq('publicado', true)
        .order('ano', { ascending: false });

      if (error) throw error;
      
      const anos = [...new Set(data?.map(item => item.ano) || [])];
      return anos;
    },
  });
}

// Admin mutations
export function useCreateLicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (licitacao: Omit<Licitacao, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('licitacoes')
        .insert(licitacao as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['licitacoes-anos'] });
    },
  });
}

export function useUpdateLicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...licitacao }: Partial<Licitacao> & { id: string }) => {
      const { data, error } = await supabase
        .from('licitacoes')
        .update(licitacao as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['licitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['licitacao', variables.id] });
    },
  });
}

export function useDeleteLicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('licitacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['licitacoes-anos'] });
    },
  });
}

// Documento mutations
export function useCreateDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documento: Omit<DocumentoLicitacao, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('documentos_licitacao')
        .insert(documento as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['licitacao', variables.licitacao_id] });
    },
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, licitacaoId }: { id: string; licitacaoId: string }) => {
      const { error } = await supabase
        .from('documentos_licitacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return licitacaoId;
    },
    onSuccess: (licitacaoId) => {
      queryClient.invalidateQueries({ queryKey: ['licitacao', licitacaoId] });
    },
  });
}
