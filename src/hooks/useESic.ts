import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type StatusESic = 
  | 'pendente' 
  | 'em_andamento' 
  | 'respondida' 
  | 'prorrogada' 
  | 'recurso' 
  | 'arquivada' 
  | 'cancelada';

export type TipoRespostaESic = 
  | 'deferido' 
  | 'deferido_parcial' 
  | 'indeferido' 
  | 'nao_possui' 
  | 'encaminhado' 
  | 'prorrogacao';

export type InstanciaRecursoESic = 'primeira' | 'segunda' | 'terceira';

export interface ESicSolicitacao {
  id: string;
  protocolo: string;
  solicitante_nome: string;
  solicitante_email: string;
  solicitante_telefone?: string;
  solicitante_documento?: string;
  solicitante_user_id?: string;
  assunto: string;
  descricao: string;
  forma_recebimento: string;
  data_solicitacao: string;
  data_limite: string;
  data_prorrogacao?: string;
  data_resposta?: string;
  setor_responsavel?: string;
  responsavel_id?: string;
  status: StatusESic;
  prioridade: number;
  created_at: string;
  updated_at: string;
}

export interface ESicResposta {
  id: string;
  solicitacao_id: string;
  tipo: TipoRespostaESic;
  conteudo: string;
  fundamentacao_legal?: string;
  respondido_por?: string;
  respondido_por_nome?: string;
  data_resposta: string;
  created_at: string;
}

export interface ESicRecurso {
  id: string;
  solicitacao_id: string;
  instancia: InstanciaRecursoESic;
  motivo: string;
  data_recurso: string;
  data_limite: string;
  data_decisao?: string;
  decisao?: string;
  fundamentacao?: string;
  decidido_por?: string;
  created_at: string;
}

export interface NovaSolicitacao {
  solicitante_nome: string;
  solicitante_email: string;
  solicitante_telefone?: string;
  solicitante_documento?: string;
  assunto: string;
  descricao: string;
  forma_recebimento?: string;
}

export const statusLabels: Record<StatusESic, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  respondida: 'Respondida',
  prorrogada: 'Prorrogada',
  recurso: 'Em Recurso',
  arquivada: 'Arquivada',
  cancelada: 'Cancelada',
};

export const statusColors: Record<StatusESic, string> = {
  pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  em_andamento: 'bg-blue-100 text-blue-800 border-blue-200',
  respondida: 'bg-green-100 text-green-800 border-green-200',
  prorrogada: 'bg-orange-100 text-orange-800 border-orange-200',
  recurso: 'bg-purple-100 text-purple-800 border-purple-200',
  arquivada: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelada: 'bg-red-100 text-red-800 border-red-200',
};

export const tipoRespostaLabels: Record<TipoRespostaESic, string> = {
  deferido: 'Deferido',
  deferido_parcial: 'Parcialmente Deferido',
  indeferido: 'Indeferido',
  nao_possui: 'Órgão não Possui a Informação',
  encaminhado: 'Encaminhado a Outro Órgão',
  prorrogacao: 'Prorrogação de Prazo',
};

// Função para calcular data limite (20 dias úteis)
const calcularDataLimite = (dataInicio: Date): Date => {
  let diasUteis = 0;
  const dataLimite = new Date(dataInicio);
  
  while (diasUteis < 20) {
    dataLimite.setDate(dataLimite.getDate() + 1);
    const diaSemana = dataLimite.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }
  }
  
  return dataLimite;
};

// Gerar protocolo
const gerarProtocolo = async (): Promise<string> => {
  const { data, error } = await supabase.rpc('gerar_protocolo_esic');
  if (error) throw error;
  return data;
};

// Hook para criar nova solicitação
// Função para enviar email e-SIC
const enviarEmailESic = async (dados: {
  tipo: 'nova_solicitacao' | 'resposta' | 'prorrogacao' | 'recurso';
  destinatario_email: string;
  destinatario_nome: string;
  protocolo: string;
  assunto?: string;
  data_limite?: string;
  tipo_resposta?: string;
  conteudo_resposta?: string;
}) => {
  try {
    const { error } = await supabase.functions.invoke('send-esic-email', {
      body: dados,
    });
    if (error) {
      console.error('Erro ao enviar email e-SIC:', error);
    }
  } catch (err) {
    console.error('Erro ao enviar email e-SIC:', err);
  }
};

export function useCreateSolicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: NovaSolicitacao) => {
      const protocolo = await gerarProtocolo();
      const dataLimite = calcularDataLimite(new Date());

      const { data, error } = await supabase
        .from('esic_solicitacoes')
        .insert({
          protocolo,
          solicitante_nome: dados.solicitante_nome,
          solicitante_email: dados.solicitante_email,
          solicitante_telefone: dados.solicitante_telefone || null,
          solicitante_documento: dados.solicitante_documento || null,
          assunto: dados.assunto,
          descricao: dados.descricao,
          forma_recebimento: dados.forma_recebimento || 'email',
          data_limite: dataLimite.toISOString(),
          status: 'pendente' as StatusESic,
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar no histórico
      await supabase.from('esic_historico').insert({
        solicitacao_id: data.id,
        acao: 'criado',
        descricao: 'Solicitação registrada no sistema',
        dados_novos: data,
      });

      // Enviar email de confirmação
      await enviarEmailESic({
        tipo: 'nova_solicitacao',
        destinatario_email: dados.solicitante_email,
        destinatario_nome: dados.solicitante_nome,
        protocolo,
        assunto: dados.assunto,
        data_limite: dataLimite.toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacoes'] });
      toast.success('Solicitação registrada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar solicitação:', error);
      toast.error('Erro ao registrar solicitação');
    },
  });
}

// Hook para buscar solicitação por protocolo
export function useSolicitacaoByProtocolo(protocolo: string | undefined) {
  return useQuery({
    queryKey: ['esic-solicitacao', protocolo],
    queryFn: async () => {
      if (!protocolo) return null;

      const { data, error } = await supabase
        .from('esic_solicitacoes')
        .select('*')
        .eq('protocolo', protocolo.toUpperCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data as ESicSolicitacao;
    },
    enabled: !!protocolo,
  });
}

// Hook para buscar solicitação por ID
export function useSolicitacaoById(id: string | undefined) {
  return useQuery({
    queryKey: ['esic-solicitacao-id', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('esic_solicitacoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ESicSolicitacao;
    },
    enabled: !!id,
  });
}

// Hook para buscar respostas de uma solicitação
export function useRespostasBySolicitacao(solicitacaoId: string | undefined) {
  return useQuery({
    queryKey: ['esic-respostas', solicitacaoId],
    queryFn: async () => {
      if (!solicitacaoId) return [];

      const { data, error } = await supabase
        .from('esic_respostas')
        .select('*')
        .eq('solicitacao_id', solicitacaoId)
        .order('data_resposta', { ascending: true });

      if (error) throw error;
      return data as ESicResposta[];
    },
    enabled: !!solicitacaoId,
  });
}

// Hook para buscar recursos de uma solicitação
export function useRecursosBySolicitacao(solicitacaoId: string | undefined) {
  return useQuery({
    queryKey: ['esic-recursos', solicitacaoId],
    queryFn: async () => {
      if (!solicitacaoId) return [];

      const { data, error } = await supabase
        .from('esic_recursos')
        .select('*')
        .eq('solicitacao_id', solicitacaoId)
        .order('data_recurso', { ascending: true });

      if (error) throw error;
      return data as ESicRecurso[];
    },
    enabled: !!solicitacaoId,
  });
}

// Hook para listar todas as solicitações (admin)
export function useAllSolicitacoes(filters?: {
  status?: StatusESic;
  search?: string;
  dataInicio?: string;
  dataFim?: string;
}) {
  return useQuery({
    queryKey: ['esic-solicitacoes', filters],
    queryFn: async () => {
      let query = supabase
        .from('esic_solicitacoes')
        .select('*')
        .order('data_solicitacao', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `protocolo.ilike.%${filters.search}%,solicitante_nome.ilike.%${filters.search}%,assunto.ilike.%${filters.search}%`
        );
      }

      if (filters?.dataInicio) {
        query = query.gte('data_solicitacao', filters.dataInicio);
      }

      if (filters?.dataFim) {
        query = query.lte('data_solicitacao', filters.dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ESicSolicitacao[];
    },
  });
}

// Hook para responder solicitação (admin)
export function useResponderSolicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      solicitacaoId,
      tipo,
      conteudo,
      fundamentacao_legal,
    }: {
      solicitacaoId: string;
      tipo: TipoRespostaESic;
      conteudo: string;
      fundamentacao_legal?: string;
    }) => {
      // Buscar dados da solicitação para envio de email
      const { data: solicitacao } = await supabase
        .from('esic_solicitacoes')
        .select('*')
        .eq('id', solicitacaoId)
        .single();

      // Inserir resposta
      const { data: resposta, error: respostaError } = await supabase
        .from('esic_respostas')
        .insert({
          solicitacao_id: solicitacaoId,
          tipo,
          conteudo,
          fundamentacao_legal: fundamentacao_legal || null,
          data_resposta: new Date().toISOString(),
        })
        .select()
        .single();

      if (respostaError) throw respostaError;

      // Atualizar status da solicitação
      const novoStatus = tipo === 'prorrogacao' ? 'prorrogada' : 'respondida';
      const updates: Partial<ESicSolicitacao> = {
        status: novoStatus as StatusESic,
      };

      let novaDataLimite: string | undefined;

      if (tipo !== 'prorrogacao') {
        updates.data_resposta = new Date().toISOString();
      } else {
        // Calcular nova data limite (+10 dias úteis)
        if (solicitacao) {
          const dataAtual = new Date(solicitacao.data_limite);
          let diasUteis = 0;
          while (diasUteis < 10) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            const diaSemana = dataAtual.getDay();
            if (diaSemana !== 0 && diaSemana !== 6) {
              diasUteis++;
            }
          }
          novaDataLimite = dataAtual.toISOString();
          updates.data_prorrogacao = novaDataLimite;
        }
      }

      const { error: updateError } = await supabase
        .from('esic_solicitacoes')
        .update(updates)
        .eq('id', solicitacaoId);

      if (updateError) throw updateError;

      // Registrar no histórico
      await supabase.from('esic_historico').insert({
        solicitacao_id: solicitacaoId,
        acao: tipo === 'prorrogacao' ? 'prorrogado' : 'respondido',
        descricao: `Solicitação ${tipo === 'prorrogacao' ? 'prorrogada' : 'respondida'}: ${tipoRespostaLabels[tipo]}`,
        dados_novos: resposta,
      });

      // Enviar email de notificação ao solicitante
      if (solicitacao) {
        await enviarEmailESic({
          tipo: tipo === 'prorrogacao' ? 'prorrogacao' : 'resposta',
          destinatario_email: solicitacao.solicitante_email,
          destinatario_nome: solicitacao.solicitante_nome,
          protocolo: solicitacao.protocolo,
          tipo_resposta: tipoRespostaLabels[tipo],
          conteudo_resposta: conteudo,
          data_limite: novaDataLimite,
        });
      }

      return resposta;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacao-id', variables.solicitacaoId] });
      queryClient.invalidateQueries({ queryKey: ['esic-respostas', variables.solicitacaoId] });
      toast.success('Resposta registrada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao responder:', error);
      toast.error('Erro ao registrar resposta');
    },
  });
}

// Hook para atualizar status (admin)
export function useUpdateSolicitacaoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      setor_responsavel,
    }: {
      id: string;
      status: StatusESic;
      setor_responsavel?: string;
    }) => {
      const updates: Partial<ESicSolicitacao> = { status };
      if (setor_responsavel) {
        updates.setor_responsavel = setor_responsavel;
      }

      const { data, error } = await supabase
        .from('esic_solicitacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Registrar no histórico
      await supabase.from('esic_historico').insert({
        solicitacao_id: id,
        acao: 'status_atualizado',
        descricao: `Status alterado para: ${statusLabels[status]}`,
        dados_novos: data,
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacao-id', data.id] });
      toast.success('Status atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    },
  });
}

// Hook para estatísticas (admin)
export function useESicEstatisticas() {
  return useQuery({
    queryKey: ['esic-estatisticas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esic_solicitacoes')
        .select('status, data_solicitacao, data_resposta');

      if (error) throw error;

      const total = data.length;
      const porStatus = data.reduce((acc, sol) => {
        acc[sol.status] = (acc[sol.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calcular tempo médio de resposta
      const respondidas = data.filter(s => s.data_resposta);
      let tempoMedioHoras = 0;
      if (respondidas.length > 0) {
        const tempoTotal = respondidas.reduce((acc, s) => {
          const inicio = new Date(s.data_solicitacao).getTime();
          const fim = new Date(s.data_resposta!).getTime();
          return acc + (fim - inicio);
        }, 0);
        tempoMedioHoras = tempoTotal / respondidas.length / (1000 * 60 * 60);
      }

      // Solicitações pendentes que estão próximas do prazo (5 dias)
      const hoje = new Date();
      const proximasDoPrazo = data.filter(s => {
        if (s.status !== 'pendente' && s.status !== 'em_andamento') return false;
        const prazo = new Date(s.data_solicitacao);
        prazo.setDate(prazo.getDate() + 15); // 15 dias = próximo do prazo de 20
        return prazo <= hoje;
      }).length;

      return {
        total,
        porStatus,
        tempoMedioDias: Math.round(tempoMedioHoras / 24),
        proximasDoPrazo,
        respondidas: respondidas.length,
        taxaResposta: total > 0 ? Math.round((respondidas.length / total) * 100) : 0,
      };
    },
  });
}

// Hook para estatísticas públicas (visíveis para todos)
export function useESicEstatisticasPublicas() {
  return useQuery({
    queryKey: ['esic-estatisticas-publicas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esic_solicitacoes')
        .select('status, data_resposta');

      if (error) throw error;

      const total = data.length;
      const respondidas = data.filter(s => s.status === 'respondida' || s.data_resposta).length;
      const emAndamento = data.filter(s => s.status === 'pendente' || s.status === 'em_andamento' || s.status === 'prorrogada').length;
      const taxaResposta = total > 0 ? Math.round((respondidas / total) * 100) : 0;

      return {
        total,
        respondidas,
        emAndamento,
        taxaResposta,
      };
    },
  });
}

// Hook para criar recurso
export function useCreateRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      solicitacaoId,
      instancia,
      motivo,
    }: {
      solicitacaoId: string;
      instancia: InstanciaRecursoESic;
      motivo: string;
    }) => {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 5); // 5 dias para decisão

      const { data, error } = await supabase
        .from('esic_recursos')
        .insert({
          solicitacao_id: solicitacaoId,
          instancia,
          motivo,
          data_limite: dataLimite.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar status da solicitação
      await supabase
        .from('esic_solicitacoes')
        .update({ status: 'recurso' as StatusESic })
        .eq('id', solicitacaoId);

      // Registrar no histórico
      await supabase.from('esic_historico').insert({
        solicitacao_id: solicitacaoId,
        acao: 'recurso_criado',
        descricao: `Recurso em ${instancia} instância registrado`,
        dados_novos: data,
      });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['esic-solicitacao-id', variables.solicitacaoId] });
      queryClient.invalidateQueries({ queryKey: ['esic-recursos', variables.solicitacaoId] });
      toast.success('Recurso registrado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar recurso:', error);
      toast.error('Erro ao registrar recurso');
    },
  });
}
