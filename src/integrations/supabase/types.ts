export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      atendimento_itens: {
        Row: {
          ativo: boolean | null
          categoria: string
          conteudo: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          horario: string | null
          id: string
          ordem: number | null
          responsavel_cargo: string | null
          responsavel_nome: string | null
          slug: string
          subcategoria: string | null
          telefone: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          conteudo?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          horario?: string | null
          id?: string
          ordem?: number | null
          responsavel_cargo?: string | null
          responsavel_nome?: string | null
          slug: string
          subcategoria?: string | null
          telefone?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          conteudo?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          horario?: string | null
          id?: string
          ordem?: number | null
          responsavel_cargo?: string | null
          responsavel_nome?: string | null
          slug?: string
          subcategoria?: string | null
          telefone?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      banner_slides: {
        Row: {
          ativo: boolean | null
          bg_class: string | null
          bg_color: string | null
          bg_image_opacity: number | null
          bg_image_position: string | null
          bg_image_url: string | null
          created_at: string | null
          cta_link: string | null
          cta_nova_aba: boolean | null
          cta_texto: string | null
          descricao: string | null
          display_duration: number | null
          id: string
          ordem: number | null
          subtitulo: string | null
          titulo: string
          transition_duration: number | null
          transition_effect: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          bg_class?: string | null
          bg_color?: string | null
          bg_image_opacity?: number | null
          bg_image_position?: string | null
          bg_image_url?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_nova_aba?: boolean | null
          cta_texto?: string | null
          descricao?: string | null
          display_duration?: number | null
          id?: string
          ordem?: number | null
          subtitulo?: string | null
          titulo: string
          transition_duration?: number | null
          transition_effect?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          bg_class?: string | null
          bg_color?: string | null
          bg_image_opacity?: number | null
          bg_image_position?: string | null
          bg_image_url?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_nova_aba?: boolean | null
          cta_texto?: string | null
          descricao?: string | null
          display_duration?: number | null
          id?: string
          ordem?: number | null
          subtitulo?: string | null
          titulo?: string
          transition_duration?: number | null
          transition_effect?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          id: string
          updated_at: string | null
          valor: Json
        }
        Insert: {
          chave: string
          id?: string
          updated_at?: string | null
          valor?: Json
        }
        Update: {
          chave?: string
          id?: string
          updated_at?: string | null
          valor?: Json
        }
        Relationships: []
      }
      dados_abertos: {
        Row: {
          arquivo_nome: string
          arquivo_url: string
          categoria: Database["public"]["Enums"]["categoria_dados_abertos"]
          created_at: string | null
          data_referencia: string | null
          descricao: string | null
          fonte: string | null
          formato: Database["public"]["Enums"]["formato_arquivo"]
          id: string
          link_sistema_origem: string | null
          observacoes: string | null
          ordem: number | null
          periodicidade: string | null
          publicado: boolean | null
          quantidade_registros: number | null
          tamanho_bytes: number | null
          titulo: string
          ultima_atualizacao: string
          updated_at: string | null
        }
        Insert: {
          arquivo_nome: string
          arquivo_url: string
          categoria: Database["public"]["Enums"]["categoria_dados_abertos"]
          created_at?: string | null
          data_referencia?: string | null
          descricao?: string | null
          fonte?: string | null
          formato: Database["public"]["Enums"]["formato_arquivo"]
          id?: string
          link_sistema_origem?: string | null
          observacoes?: string | null
          ordem?: number | null
          periodicidade?: string | null
          publicado?: boolean | null
          quantidade_registros?: number | null
          tamanho_bytes?: number | null
          titulo: string
          ultima_atualizacao?: string
          updated_at?: string | null
        }
        Update: {
          arquivo_nome?: string
          arquivo_url?: string
          categoria?: Database["public"]["Enums"]["categoria_dados_abertos"]
          created_at?: string | null
          data_referencia?: string | null
          descricao?: string | null
          fonte?: string | null
          formato?: Database["public"]["Enums"]["formato_arquivo"]
          id?: string
          link_sistema_origem?: string | null
          observacoes?: string | null
          ordem?: number | null
          periodicidade?: string | null
          publicado?: boolean | null
          quantidade_registros?: number | null
          tamanho_bytes?: number | null
          titulo?: string
          ultima_atualizacao?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      diarias_passagens: {
        Row: {
          ano_referencia: number
          beneficiario_cargo: string | null
          beneficiario_matricula: string | null
          beneficiario_nome: string
          created_at: string | null
          data_fim: string
          data_inicio: string
          destino: string
          finalidade: string
          id: string
          link_sistema_oficial: string | null
          mes_referencia: number
          numero_portaria: string | null
          observacoes: string | null
          publicado: boolean | null
          quantidade_dias: number | null
          secretaria: string | null
          tipo: string
          updated_at: string | null
          valor_total: number
          valor_unitario: number | null
        }
        Insert: {
          ano_referencia: number
          beneficiario_cargo?: string | null
          beneficiario_matricula?: string | null
          beneficiario_nome: string
          created_at?: string | null
          data_fim: string
          data_inicio: string
          destino: string
          finalidade: string
          id?: string
          link_sistema_oficial?: string | null
          mes_referencia: number
          numero_portaria?: string | null
          observacoes?: string | null
          publicado?: boolean | null
          quantidade_dias?: number | null
          secretaria?: string | null
          tipo: string
          updated_at?: string | null
          valor_total: number
          valor_unitario?: number | null
        }
        Update: {
          ano_referencia?: number
          beneficiario_cargo?: string | null
          beneficiario_matricula?: string | null
          beneficiario_nome?: string
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          destino?: string
          finalidade?: string
          id?: string
          link_sistema_oficial?: string | null
          mes_referencia?: number
          numero_portaria?: string | null
          observacoes?: string | null
          publicado?: boolean | null
          quantidade_dias?: number | null
          secretaria?: string | null
          tipo?: string
          updated_at?: string | null
          valor_total?: number
          valor_unitario?: number | null
        }
        Relationships: []
      }
      documentos_legislacao: {
        Row: {
          ano: number
          arquivo_nome: string
          arquivo_url: string
          created_at: string | null
          created_by: string | null
          data_publicacao: string
          descricao: string | null
          id: string
          observacoes: string | null
          tipo: Database["public"]["Enums"]["tipo_documento_legislacao"]
          titulo: string
          updated_at: string | null
          updated_by: string | null
          vigente: boolean | null
        }
        Insert: {
          ano: number
          arquivo_nome: string
          arquivo_url: string
          created_at?: string | null
          created_by?: string | null
          data_publicacao: string
          descricao?: string | null
          id?: string
          observacoes?: string | null
          tipo: Database["public"]["Enums"]["tipo_documento_legislacao"]
          titulo: string
          updated_at?: string | null
          updated_by?: string | null
          vigente?: boolean | null
        }
        Update: {
          ano?: number
          arquivo_nome?: string
          arquivo_url?: string
          created_at?: string | null
          created_by?: string | null
          data_publicacao?: string
          descricao?: string | null
          id?: string
          observacoes?: string | null
          tipo?: Database["public"]["Enums"]["tipo_documento_legislacao"]
          titulo?: string
          updated_at?: string | null
          updated_by?: string | null
          vigente?: boolean | null
        }
        Relationships: []
      }
      documentos_licitacao: {
        Row: {
          created_at: string
          data_publicacao: string
          descricao: string | null
          id: string
          licitacao_id: string
          ordem: number | null
          tipo: Database["public"]["Enums"]["tipo_documento_licitacao"]
          titulo: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          licitacao_id: string
          ordem?: number | null
          tipo: Database["public"]["Enums"]["tipo_documento_licitacao"]
          titulo: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          licitacao_id?: string
          ordem?: number | null
          tipo?: Database["public"]["Enums"]["tipo_documento_licitacao"]
          titulo?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_licitacao_licitacao_id_fkey"
            columns: ["licitacao_id"]
            isOneToOne: false
            referencedRelation: "licitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      esic_anexos: {
        Row: {
          created_at: string
          id: string
          nome_arquivo: string
          recurso_id: string | null
          resposta_id: string | null
          solicitacao_id: string | null
          tamanho_bytes: number | null
          tipo_mime: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome_arquivo: string
          recurso_id?: string | null
          resposta_id?: string | null
          solicitacao_id?: string | null
          tamanho_bytes?: number | null
          tipo_mime?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          nome_arquivo?: string
          recurso_id?: string | null
          resposta_id?: string | null
          solicitacao_id?: string | null
          tamanho_bytes?: number | null
          tipo_mime?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "esic_anexos_recurso_id_fkey"
            columns: ["recurso_id"]
            isOneToOne: false
            referencedRelation: "esic_recursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esic_anexos_resposta_id_fkey"
            columns: ["resposta_id"]
            isOneToOne: false
            referencedRelation: "esic_respostas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esic_anexos_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "esic_solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      esic_historico: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          descricao: string | null
          id: string
          ip_address: string | null
          solicitacao_id: string
          usuario_id: string | null
          usuario_nome: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          id?: string
          ip_address?: string | null
          solicitacao_id: string
          usuario_id?: string | null
          usuario_nome?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          id?: string
          ip_address?: string | null
          solicitacao_id?: string
          usuario_id?: string | null
          usuario_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esic_historico_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "esic_solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      esic_recursos: {
        Row: {
          created_at: string
          data_decisao: string | null
          data_limite: string
          data_recurso: string
          decidido_por: string | null
          decisao: string | null
          fundamentacao: string | null
          id: string
          instancia: Database["public"]["Enums"]["instancia_recurso_esic"]
          motivo: string
          solicitacao_id: string
        }
        Insert: {
          created_at?: string
          data_decisao?: string | null
          data_limite: string
          data_recurso?: string
          decidido_por?: string | null
          decisao?: string | null
          fundamentacao?: string | null
          id?: string
          instancia: Database["public"]["Enums"]["instancia_recurso_esic"]
          motivo: string
          solicitacao_id: string
        }
        Update: {
          created_at?: string
          data_decisao?: string | null
          data_limite?: string
          data_recurso?: string
          decidido_por?: string | null
          decisao?: string | null
          fundamentacao?: string | null
          id?: string
          instancia?: Database["public"]["Enums"]["instancia_recurso_esic"]
          motivo?: string
          solicitacao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "esic_recursos_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "esic_solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      esic_respostas: {
        Row: {
          conteudo: string
          created_at: string
          data_resposta: string
          fundamentacao_legal: string | null
          id: string
          respondido_por: string | null
          respondido_por_nome: string | null
          solicitacao_id: string
          tipo: Database["public"]["Enums"]["tipo_resposta_esic"]
        }
        Insert: {
          conteudo: string
          created_at?: string
          data_resposta?: string
          fundamentacao_legal?: string | null
          id?: string
          respondido_por?: string | null
          respondido_por_nome?: string | null
          solicitacao_id: string
          tipo: Database["public"]["Enums"]["tipo_resposta_esic"]
        }
        Update: {
          conteudo?: string
          created_at?: string
          data_resposta?: string
          fundamentacao_legal?: string | null
          id?: string
          respondido_por?: string | null
          respondido_por_nome?: string | null
          solicitacao_id?: string
          tipo?: Database["public"]["Enums"]["tipo_resposta_esic"]
        }
        Relationships: [
          {
            foreignKeyName: "esic_respostas_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "esic_solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      esic_solicitacoes: {
        Row: {
          assunto: string
          created_at: string
          data_limite: string
          data_prorrogacao: string | null
          data_resposta: string | null
          data_solicitacao: string
          descricao: string
          forma_recebimento: string | null
          id: string
          ip_solicitante: string | null
          prioridade: number | null
          protocolo: string
          responsavel_id: string | null
          setor_responsavel: string | null
          solicitante_documento: string | null
          solicitante_email: string
          solicitante_nome: string
          solicitante_telefone: string | null
          solicitante_user_id: string | null
          status: Database["public"]["Enums"]["status_esic"]
          updated_at: string
        }
        Insert: {
          assunto: string
          created_at?: string
          data_limite: string
          data_prorrogacao?: string | null
          data_resposta?: string | null
          data_solicitacao?: string
          descricao: string
          forma_recebimento?: string | null
          id?: string
          ip_solicitante?: string | null
          prioridade?: number | null
          protocolo: string
          responsavel_id?: string | null
          setor_responsavel?: string | null
          solicitante_documento?: string | null
          solicitante_email: string
          solicitante_nome: string
          solicitante_telefone?: string | null
          solicitante_user_id?: string | null
          status?: Database["public"]["Enums"]["status_esic"]
          updated_at?: string
        }
        Update: {
          assunto?: string
          created_at?: string
          data_limite?: string
          data_prorrogacao?: string | null
          data_resposta?: string | null
          data_solicitacao?: string
          descricao?: string
          forma_recebimento?: string | null
          id?: string
          ip_solicitante?: string | null
          prioridade?: number | null
          protocolo?: string
          responsavel_id?: string | null
          setor_responsavel?: string | null
          solicitante_documento?: string | null
          solicitante_email?: string
          solicitante_nome?: string
          solicitante_telefone?: string | null
          solicitante_user_id?: string | null
          status?: Database["public"]["Enums"]["status_esic"]
          updated_at?: string
        }
        Relationships: []
      }
      governo_itens: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          conteudo: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          nome_autoridade: string | null
          ordem: number | null
          slug: string
          telefone: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          conteudo?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome_autoridade?: string | null
          ordem?: number | null
          slug: string
          telefone?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          conteudo?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome_autoridade?: string | null
          ordem?: number | null
          slug?: string
          telefone?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      licitacoes: {
        Row: {
          ano: number
          created_at: string
          created_by: string | null
          data_abertura: string
          data_abertura_processo: string | null
          data_encerramento: string | null
          id: string
          link_sistema_oficial: string | null
          modalidade: Database["public"]["Enums"]["modalidade_licitacao"]
          numero_processo: string
          objeto: string
          observacoes: string | null
          publicado: boolean | null
          secretaria_id: string | null
          secretaria_nome: string | null
          status: Database["public"]["Enums"]["status_licitacao"]
          updated_at: string
          updated_by: string | null
          valor_estimado: number | null
        }
        Insert: {
          ano: number
          created_at?: string
          created_by?: string | null
          data_abertura: string
          data_abertura_processo?: string | null
          data_encerramento?: string | null
          id?: string
          link_sistema_oficial?: string | null
          modalidade: Database["public"]["Enums"]["modalidade_licitacao"]
          numero_processo: string
          objeto: string
          observacoes?: string | null
          publicado?: boolean | null
          secretaria_id?: string | null
          secretaria_nome?: string | null
          status?: Database["public"]["Enums"]["status_licitacao"]
          updated_at?: string
          updated_by?: string | null
          valor_estimado?: number | null
        }
        Update: {
          ano?: number
          created_at?: string
          created_by?: string | null
          data_abertura?: string
          data_abertura_processo?: string | null
          data_encerramento?: string | null
          id?: string
          link_sistema_oficial?: string | null
          modalidade?: Database["public"]["Enums"]["modalidade_licitacao"]
          numero_processo?: string
          objeto?: string
          observacoes?: string | null
          publicado?: boolean | null
          secretaria_id?: string | null
          secretaria_nome?: string | null
          status?: Database["public"]["Enums"]["status_licitacao"]
          updated_at?: string
          updated_by?: string | null
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "licitacoes_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      municipio_itens: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          conteudo: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          nome_autoridade: string | null
          ordem: number | null
          slug: string
          telefone: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          conteudo?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome_autoridade?: string | null
          ordem?: number | null
          slug: string
          telefone?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          conteudo?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome_autoridade?: string | null
          ordem?: number | null
          slug?: string
          telefone?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      noticias: {
        Row: {
          categoria: string
          categoria_cor: string
          conteudo: string
          created_at: string | null
          data_publicacao: string | null
          id: string
          imagem_url: string | null
          publicado: boolean | null
          resumo: string
          slug: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          categoria?: string
          categoria_cor?: string
          conteudo: string
          created_at?: string | null
          data_publicacao?: string | null
          id?: string
          imagem_url?: string | null
          publicado?: boolean | null
          resumo: string
          slug: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          categoria?: string
          categoria_cor?: string
          conteudo?: string
          created_at?: string | null
          data_publicacao?: string | null
          id?: string
          imagem_url?: string | null
          publicado?: boolean | null
          resumo?: string
          slug?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      obras_publicas: {
        Row: {
          cnpj_empresa: string | null
          created_at: string | null
          created_by: string | null
          data_conclusao: string | null
          data_inicio: string | null
          data_previsao_termino: string | null
          descricao: string | null
          empresa_executora: string | null
          fiscal_obra: string | null
          fonte_recurso:
            | Database["public"]["Enums"]["fonte_recurso_obra"]
            | null
          fonte_recurso_descricao: string | null
          foto_url: string | null
          id: string
          link_sistema_oficial: string | null
          localizacao: string | null
          numero_contrato: string | null
          objeto: string
          observacoes: string | null
          percentual_execucao: number | null
          prazo_execucao_dias: number | null
          publicado: boolean | null
          secretaria_responsavel: string | null
          status: Database["public"]["Enums"]["status_obra"] | null
          titulo: string
          updated_at: string | null
          updated_by: string | null
          valor_contratado: number | null
          valor_executado: number | null
        }
        Insert: {
          cnpj_empresa?: string | null
          created_at?: string | null
          created_by?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_previsao_termino?: string | null
          descricao?: string | null
          empresa_executora?: string | null
          fiscal_obra?: string | null
          fonte_recurso?:
            | Database["public"]["Enums"]["fonte_recurso_obra"]
            | null
          fonte_recurso_descricao?: string | null
          foto_url?: string | null
          id?: string
          link_sistema_oficial?: string | null
          localizacao?: string | null
          numero_contrato?: string | null
          objeto: string
          observacoes?: string | null
          percentual_execucao?: number | null
          prazo_execucao_dias?: number | null
          publicado?: boolean | null
          secretaria_responsavel?: string | null
          status?: Database["public"]["Enums"]["status_obra"] | null
          titulo: string
          updated_at?: string | null
          updated_by?: string | null
          valor_contratado?: number | null
          valor_executado?: number | null
        }
        Update: {
          cnpj_empresa?: string | null
          created_at?: string | null
          created_by?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_previsao_termino?: string | null
          descricao?: string | null
          empresa_executora?: string | null
          fiscal_obra?: string | null
          fonte_recurso?:
            | Database["public"]["Enums"]["fonte_recurso_obra"]
            | null
          fonte_recurso_descricao?: string | null
          foto_url?: string | null
          id?: string
          link_sistema_oficial?: string | null
          localizacao?: string | null
          numero_contrato?: string | null
          objeto?: string
          observacoes?: string | null
          percentual_execucao?: number | null
          prazo_execucao_dias?: number | null
          publicado?: boolean | null
          secretaria_responsavel?: string | null
          status?: Database["public"]["Enums"]["status_obra"] | null
          titulo?: string
          updated_at?: string | null
          updated_by?: string | null
          valor_contratado?: number | null
          valor_executado?: number | null
        }
        Relationships: []
      }
      orgaos_administracao: {
        Row: {
          ativo: boolean | null
          base_legal: string | null
          competencia: string | null
          contato: string | null
          created_at: string | null
          email: string | null
          icone: string
          id: string
          nome: string
          ordem: number | null
          responsavel: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          base_legal?: string | null
          competencia?: string | null
          contato?: string | null
          created_at?: string | null
          email?: string | null
          icone?: string
          id?: string
          nome: string
          ordem?: number | null
          responsavel?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          base_legal?: string | null
          competencia?: string | null
          contato?: string | null
          created_at?: string | null
          email?: string | null
          icone?: string
          id?: string
          nome?: string
          ordem?: number | null
          responsavel?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patrimonio_publico: {
        Row: {
          ano_fabricacao: number | null
          area_m2: number | null
          chassi: string | null
          created_at: string | null
          data_aquisicao: string | null
          descricao: string
          endereco: string | null
          foto_url: string | null
          id: string
          localizacao_atual: string | null
          marca_modelo: string | null
          matricula_cartorio: string | null
          numero_patrimonio: string | null
          observacoes: string | null
          placa: string | null
          publicado: boolean | null
          renavam: string | null
          secretaria_responsavel: string | null
          situacao: Database["public"]["Enums"]["situacao_bem"] | null
          tipo: Database["public"]["Enums"]["tipo_bem_publico"]
          updated_at: string | null
          valor_aquisicao: number | null
          valor_atual: number | null
        }
        Insert: {
          ano_fabricacao?: number | null
          area_m2?: number | null
          chassi?: string | null
          created_at?: string | null
          data_aquisicao?: string | null
          descricao: string
          endereco?: string | null
          foto_url?: string | null
          id?: string
          localizacao_atual?: string | null
          marca_modelo?: string | null
          matricula_cartorio?: string | null
          numero_patrimonio?: string | null
          observacoes?: string | null
          placa?: string | null
          publicado?: boolean | null
          renavam?: string | null
          secretaria_responsavel?: string | null
          situacao?: Database["public"]["Enums"]["situacao_bem"] | null
          tipo: Database["public"]["Enums"]["tipo_bem_publico"]
          updated_at?: string | null
          valor_aquisicao?: number | null
          valor_atual?: number | null
        }
        Update: {
          ano_fabricacao?: number | null
          area_m2?: number | null
          chassi?: string | null
          created_at?: string | null
          data_aquisicao?: string | null
          descricao?: string
          endereco?: string | null
          foto_url?: string | null
          id?: string
          localizacao_atual?: string | null
          marca_modelo?: string | null
          matricula_cartorio?: string | null
          numero_patrimonio?: string | null
          observacoes?: string | null
          placa?: string | null
          publicado?: boolean | null
          renavam?: string | null
          secretaria_responsavel?: string | null
          situacao?: Database["public"]["Enums"]["situacao_bem"] | null
          tipo?: Database["public"]["Enums"]["tipo_bem_publico"]
          updated_at?: string | null
          valor_aquisicao?: number | null
          valor_atual?: number | null
        }
        Relationships: []
      }
      publicacoes_historico: {
        Row: {
          alterado_em: string
          alterado_por: string | null
          campo_alterado: string
          id: string
          publicacao_id: string
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          alterado_em?: string
          alterado_por?: string | null
          campo_alterado: string
          id?: string
          publicacao_id: string
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          alterado_em?: string
          alterado_por?: string | null
          campo_alterado?: string
          id?: string
          publicacao_id?: string
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publicacoes_historico_publicacao_id_fkey"
            columns: ["publicacao_id"]
            isOneToOne: false
            referencedRelation: "publicacoes_oficiais"
            referencedColumns: ["id"]
          },
        ]
      }
      publicacoes_oficiais: {
        Row: {
          ano: number
          created_at: string
          created_by: string | null
          data_publicacao: string
          ementa: string
          id: string
          numero: string
          observacoes: string | null
          publicacao_relacionada_id: string | null
          publicado: boolean
          secretaria_id: string | null
          secretaria_nome: string | null
          situacao: Database["public"]["Enums"]["situacao_publicacao"]
          texto_completo_url: string | null
          tipo: Database["public"]["Enums"]["tipo_publicacao"]
          titulo: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ano: number
          created_at?: string
          created_by?: string | null
          data_publicacao: string
          ementa: string
          id?: string
          numero: string
          observacoes?: string | null
          publicacao_relacionada_id?: string | null
          publicado?: boolean
          secretaria_id?: string | null
          secretaria_nome?: string | null
          situacao?: Database["public"]["Enums"]["situacao_publicacao"]
          texto_completo_url?: string | null
          tipo: Database["public"]["Enums"]["tipo_publicacao"]
          titulo: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ano?: number
          created_at?: string
          created_by?: string | null
          data_publicacao?: string
          ementa?: string
          id?: string
          numero?: string
          observacoes?: string | null
          publicacao_relacionada_id?: string | null
          publicado?: boolean
          secretaria_id?: string | null
          secretaria_nome?: string | null
          situacao?: Database["public"]["Enums"]["situacao_publicacao"]
          texto_completo_url?: string | null
          tipo?: Database["public"]["Enums"]["tipo_publicacao"]
          titulo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publicacoes_oficiais_publicacao_relacionada_id_fkey"
            columns: ["publicacao_relacionada_id"]
            isOneToOne: false
            referencedRelation: "publicacoes_oficiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicacoes_oficiais_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas_categorias: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          ordem: number | null
          titulo: string
          updated_at: string | null
          url: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          ordem?: number | null
          titulo: string
          updated_at?: string | null
          url: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      relatorios_fiscais: {
        Row: {
          ano: number
          arquivo_nome: string
          arquivo_url: string
          bimestre: number | null
          created_at: string | null
          created_by: string | null
          data_publicacao: string
          descricao: string | null
          exercicio: string | null
          id: string
          observacoes: string | null
          publicado: boolean | null
          quadrimestre: number | null
          tipo: Database["public"]["Enums"]["tipo_relatorio_fiscal"]
          titulo: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          ano: number
          arquivo_nome: string
          arquivo_url: string
          bimestre?: number | null
          created_at?: string | null
          created_by?: string | null
          data_publicacao?: string
          descricao?: string | null
          exercicio?: string | null
          id?: string
          observacoes?: string | null
          publicado?: boolean | null
          quadrimestre?: number | null
          tipo: Database["public"]["Enums"]["tipo_relatorio_fiscal"]
          titulo: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          ano?: number
          arquivo_nome?: string
          arquivo_url?: string
          bimestre?: number | null
          created_at?: string | null
          created_by?: string | null
          data_publicacao?: string
          descricao?: string | null
          exercicio?: string | null
          id?: string
          observacoes?: string | null
          publicado?: boolean | null
          quadrimestre?: number | null
          tipo?: Database["public"]["Enums"]["tipo_relatorio_fiscal"]
          titulo?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      remuneracao_agentes: {
        Row: {
          ano_referencia: number
          ativo: boolean | null
          cargo: Database["public"]["Enums"]["cargo_agente_politico"]
          cargo_descricao: string | null
          created_at: string | null
          foto_url: string | null
          id: string
          mes_referencia: number
          nome: string
          observacoes: string | null
          ordem: number | null
          outros_valores: number | null
          publicado: boolean | null
          secretaria: string | null
          subsidio_mensal: number
          total_bruto: number | null
          updated_at: string | null
          verba_representacao: number | null
        }
        Insert: {
          ano_referencia: number
          ativo?: boolean | null
          cargo: Database["public"]["Enums"]["cargo_agente_politico"]
          cargo_descricao?: string | null
          created_at?: string | null
          foto_url?: string | null
          id?: string
          mes_referencia: number
          nome: string
          observacoes?: string | null
          ordem?: number | null
          outros_valores?: number | null
          publicado?: boolean | null
          secretaria?: string | null
          subsidio_mensal: number
          total_bruto?: number | null
          updated_at?: string | null
          verba_representacao?: number | null
        }
        Update: {
          ano_referencia?: number
          ativo?: boolean | null
          cargo?: Database["public"]["Enums"]["cargo_agente_politico"]
          cargo_descricao?: string | null
          created_at?: string | null
          foto_url?: string | null
          id?: string
          mes_referencia?: number
          nome?: string
          observacoes?: string | null
          ordem?: number | null
          outros_valores?: number | null
          publicado?: boolean | null
          secretaria?: string | null
          subsidio_mensal?: number
          total_bruto?: number | null
          updated_at?: string | null
          verba_representacao?: number | null
        }
        Relationships: []
      }
      secretarias: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string | null
          endereco: string | null
          horario: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          secretario_biografia: string | null
          secretario_foto: string | null
          secretario_nome: string | null
          slug: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          horario?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          secretario_biografia?: string | null
          secretario_foto?: string | null
          secretario_nome?: string | null
          slug: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          horario?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          secretario_biografia?: string | null
          secretario_foto?: string | null
          secretario_nome?: string | null
          slug?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          descricao: string
          icone: string
          id: string
          link: string | null
          ordem: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao: string
          icone?: string
          id?: string
          link?: string | null
          ordem?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string
          icone?: string
          id?: string
          link?: string | null
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transparencia_categorias: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          ordem: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          ordem?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transparencia_itens: {
        Row: {
          ativo: boolean | null
          categoria_id: string
          created_at: string | null
          externo: boolean | null
          id: string
          ordem: number | null
          titulo: string
          updated_at: string | null
          url: string
        }
        Insert: {
          ativo?: boolean | null
          categoria_id: string
          created_at?: string | null
          externo?: boolean | null
          id?: string
          ordem?: number | null
          titulo: string
          updated_at?: string | null
          url: string
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string
          created_at?: string | null
          externo?: boolean | null
          id?: string
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "transparencia_itens_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "transparencia_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      transparencia_links_rapidos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          icone: string | null
          id: string
          ordem: number | null
          titulo: string
          updated_at: string | null
          url: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          icone?: string | null
          id?: string
          ordem?: number | null
          titulo: string
          updated_at?: string | null
          url: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          icone?: string | null
          id?: string
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      unidades_vinculadas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          icone: string
          id: string
          ordem: number | null
          secretaria: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          icone?: string
          id?: string
          ordem?: number | null
          secretaria: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          icone?: string
          id?: string
          ordem?: number | null
          secretaria?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      unidades_vinculadas_itens: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nome: string
          ordem: number | null
          unidade_vinculada_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome: string
          ordem?: number | null
          unidade_vinculada_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          unidade_vinculada_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_vinculadas_itens_unidade_vinculada_id_fkey"
            columns: ["unidade_vinculada_id"]
            isOneToOne: false
            referencedRelation: "unidades_vinculadas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_first_admin: { Args: never; Returns: boolean }
      gerar_protocolo_esic: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      cargo_agente_politico:
        | "prefeito"
        | "vice_prefeito"
        | "secretario"
        | "outros"
      categoria_dados_abertos:
        | "receitas"
        | "despesas"
        | "licitacoes"
        | "contratos"
        | "servidores"
        | "obras"
        | "patrimonio"
        | "outros"
      fonte_recurso_obra:
        | "proprio"
        | "federal"
        | "estadual"
        | "convenio"
        | "financiamento"
        | "outros"
      formato_arquivo:
        | "csv"
        | "xls"
        | "xlsx"
        | "pdf"
        | "json"
        | "xml"
        | "outros"
      instancia_recurso_esic: "primeira" | "segunda" | "terceira"
      modalidade_licitacao:
        | "pregao_eletronico"
        | "pregao_presencial"
        | "concorrencia"
        | "tomada_de_precos"
        | "convite"
        | "concurso"
        | "leilao"
        | "dialogo_competitivo"
        | "dispensa"
        | "inexigibilidade"
        | "chamada_publica"
      situacao_bem: "bom" | "regular" | "ruim" | "inservivel" | "alienado"
      situacao_publicacao: "vigente" | "revogado" | "alterado"
      status_esic:
        | "pendente"
        | "em_andamento"
        | "respondida"
        | "prorrogada"
        | "recurso"
        | "arquivada"
        | "cancelada"
      status_licitacao:
        | "aberta"
        | "em_andamento"
        | "encerrada"
        | "cancelada"
        | "suspensa"
        | "deserta"
        | "fracassada"
      status_obra: "em_andamento" | "concluida" | "paralisada" | "planejada"
      tipo_bem_publico:
        | "imovel"
        | "veiculo"
        | "equipamento"
        | "mobiliario"
        | "outros"
      tipo_documento_legislacao:
        | "lei_organica"
        | "ppa"
        | "ldo"
        | "loa"
        | "emenda_lei_organica"
        | "outro"
      tipo_documento_licitacao:
        | "edital"
        | "termo_referencia"
        | "projeto_basico"
        | "aviso"
        | "ata"
        | "resultado"
        | "homologacao"
        | "contrato"
        | "aditivo"
        | "impugnacao"
        | "esclarecimento"
        | "outros"
      tipo_publicacao:
        | "lei"
        | "decreto"
        | "portaria"
        | "resolucao"
        | "instrucao_normativa"
        | "ato_administrativo"
        | "edital"
        | "comunicado"
        | "outros"
      tipo_relatorio_fiscal: "rreo" | "rgf" | "parecer_tce" | "prestacao_contas"
      tipo_resposta_esic:
        | "deferido"
        | "deferido_parcial"
        | "indeferido"
        | "nao_possui"
        | "encaminhado"
        | "prorrogacao"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      cargo_agente_politico: [
        "prefeito",
        "vice_prefeito",
        "secretario",
        "outros",
      ],
      categoria_dados_abertos: [
        "receitas",
        "despesas",
        "licitacoes",
        "contratos",
        "servidores",
        "obras",
        "patrimonio",
        "outros",
      ],
      fonte_recurso_obra: [
        "proprio",
        "federal",
        "estadual",
        "convenio",
        "financiamento",
        "outros",
      ],
      formato_arquivo: ["csv", "xls", "xlsx", "pdf", "json", "xml", "outros"],
      instancia_recurso_esic: ["primeira", "segunda", "terceira"],
      modalidade_licitacao: [
        "pregao_eletronico",
        "pregao_presencial",
        "concorrencia",
        "tomada_de_precos",
        "convite",
        "concurso",
        "leilao",
        "dialogo_competitivo",
        "dispensa",
        "inexigibilidade",
        "chamada_publica",
      ],
      situacao_bem: ["bom", "regular", "ruim", "inservivel", "alienado"],
      situacao_publicacao: ["vigente", "revogado", "alterado"],
      status_esic: [
        "pendente",
        "em_andamento",
        "respondida",
        "prorrogada",
        "recurso",
        "arquivada",
        "cancelada",
      ],
      status_licitacao: [
        "aberta",
        "em_andamento",
        "encerrada",
        "cancelada",
        "suspensa",
        "deserta",
        "fracassada",
      ],
      status_obra: ["em_andamento", "concluida", "paralisada", "planejada"],
      tipo_bem_publico: [
        "imovel",
        "veiculo",
        "equipamento",
        "mobiliario",
        "outros",
      ],
      tipo_documento_legislacao: [
        "lei_organica",
        "ppa",
        "ldo",
        "loa",
        "emenda_lei_organica",
        "outro",
      ],
      tipo_documento_licitacao: [
        "edital",
        "termo_referencia",
        "projeto_basico",
        "aviso",
        "ata",
        "resultado",
        "homologacao",
        "contrato",
        "aditivo",
        "impugnacao",
        "esclarecimento",
        "outros",
      ],
      tipo_publicacao: [
        "lei",
        "decreto",
        "portaria",
        "resolucao",
        "instrucao_normativa",
        "ato_administrativo",
        "edital",
        "comunicado",
        "outros",
      ],
      tipo_relatorio_fiscal: ["rreo", "rgf", "parecer_tce", "prestacao_contas"],
      tipo_resposta_esic: [
        "deferido",
        "deferido_parcial",
        "indeferido",
        "nao_possui",
        "encaminhado",
        "prorrogacao",
      ],
    },
  },
} as const
