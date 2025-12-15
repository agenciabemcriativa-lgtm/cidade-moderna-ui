import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secretariasData as fallbackSecretarias } from "@/data/secretarias";

export interface Secretaria {
  slug: string;
  nome: string;
  icone?: string;
  secretario: {
    nome: string;
    foto: string;
    biografia: string;
  };
  contato: {
    endereco: string;
    telefone: string;
    email: string;
    horario: string;
  };
}

export function useSecretarias() {
  return useQuery({
    queryKey: ["secretarias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("secretarias")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error || !data || data.length === 0) {
        return fallbackSecretarias;
      }
      
      return data.map(item => ({
        slug: item.slug,
        nome: item.nome,
        icone: item.icone,
        secretario: {
          nome: item.secretario_nome || "",
          foto: item.secretario_foto || "",
          biografia: item.secretario_biografia || "",
        },
        contato: {
          endereco: item.endereco || "",
          telefone: item.telefone || "",
          email: item.email || "",
          horario: item.horario || "Segunda a Sexta: 08h às 14h",
        },
      })) as Secretaria[];
    },
  });
}

export function useSecretaria(slug: string) {
  return useQuery({
    queryKey: ["secretaria", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("secretarias")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      
      if (error || !data) {
        const fallback = fallbackSecretarias.find(s => s.slug === slug);
        return fallback || null;
      }
      
      return {
        slug: data.slug,
        nome: data.nome,
        icone: data.icone,
        secretario: {
          nome: data.secretario_nome || "",
          foto: data.secretario_foto || "",
          biografia: data.secretario_biografia || "",
        },
        contato: {
          endereco: data.endereco || "",
          telefone: data.telefone || "",
          email: data.email || "",
          horario: data.horario || "Segunda a Sexta: 08h às 14h",
        },
      } as Secretaria;
    },
    enabled: !!slug,
  });
}
