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
      banner_slides: {
        Row: {
          ativo: boolean | null
          bg_class: string | null
          created_at: string | null
          cta_link: string | null
          cta_texto: string | null
          descricao: string | null
          id: string
          ordem: number | null
          subtitulo: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          bg_class?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_texto?: string | null
          descricao?: string | null
          id?: string
          ordem?: number | null
          subtitulo?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          bg_class?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_texto?: string | null
          descricao?: string | null
          id?: string
          ordem?: number | null
          subtitulo?: string | null
          titulo?: string
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
      licitacoes: {
        Row: {
          ano: number
          created_at: string
          created_by: string | null
          data_abertura: string
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
      status_licitacao:
        | "aberta"
        | "em_andamento"
        | "encerrada"
        | "cancelada"
        | "suspensa"
        | "deserta"
        | "fracassada"
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
    },
  },
} as const
