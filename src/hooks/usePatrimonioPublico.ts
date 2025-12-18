import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TipoBemPublico = 'imovel' | 'veiculo' | 'equipamento' | 'mobiliario' | 'outros';
export type SituacaoBem = 'bom' | 'regular' | 'ruim' | 'inservivel' | 'alienado';

export interface PatrimonioPublico {
  id: string;
  tipo: TipoBemPublico;
  descricao: string;
  numero_patrimonio: string | null;
  endereco: string | null;
  area_m2: number | null;
  matricula_cartorio: string | null;
  placa: string | null;
  marca_modelo: string | null;
  ano_fabricacao: number | null;
  chassi: string | null;
  renavam: string | null;
  valor_aquisicao: number | null;
  data_aquisicao: string | null;
  valor_atual: number | null;
  situacao: SituacaoBem | null;
  secretaria_responsavel: string | null;
  localizacao_atual: string | null;
  observacoes: string | null;
  foto_url: string | null;
  publicado: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const tipoBemPublicoLabels: Record<TipoBemPublico, string> = {
  imovel: 'Imóvel',
  veiculo: 'Veículo',
  equipamento: 'Equipamento',
  mobiliario: 'Mobiliário',
  outros: 'Outros',
};

export const situacaoBemLabels: Record<SituacaoBem, string> = {
  bom: 'Bom',
  regular: 'Regular',
  ruim: 'Ruim',
  inservivel: 'Inservível',
  alienado: 'Alienado',
};

export function usePatrimonioPublico(tipo?: TipoBemPublico, includeUnpublished = false) {
  return useQuery({
    queryKey: ['patrimonio_publico', tipo, includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('patrimonio_publico')
        .select('*')
        .order('tipo', { ascending: true })
        .order('descricao', { ascending: true });

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (!includeUnpublished) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PatrimonioPublico[];
    },
  });
}

export function useCreatePatrimonioPublico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<PatrimonioPublico, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('patrimonio_publico')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio_publico'] });
    },
  });
}

export function useUpdatePatrimonioPublico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<PatrimonioPublico> & { id: string }) => {
      const { data, error } = await supabase
        .from('patrimonio_publico')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio_publico'] });
    },
  });
}

export function useDeletePatrimonioPublico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('patrimonio_publico').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio_publico'] });
    },
  });
}
