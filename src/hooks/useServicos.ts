import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  CreditCard,
  FileCheck,
  Building2,
  Users,
  Briefcase,
  Scale,
  Phone,
  Eye,
  Info,
  Radio,
  Newspaper,
  BookOpen,
  type LucideIcon
} from "lucide-react";

export interface Servico {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  href: string;
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  CreditCard,
  FileCheck,
  Building2,
  Users,
  Briefcase,
  Scale,
  Phone,
  Eye,
  Info,
  Radio,
  Newspaper,
  BookOpen,
};

const fallbackServicos: Servico[] = [
  {
    icon: Eye,
    title: "Portal da Transparência",
    description: "Acesse informações sobre receitas, despesas e licitações",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: Info,
    title: "Acesso à Informação (e-SIC)",
    description: "Solicite informações públicas",
    color: "bg-secondary",
    href: "#"
  },
  {
    icon: FileCheck,
    title: "Licitações e Contratos",
    description: "Consulte processos licitatórios e contratos",
    color: "bg-primary",
    href: "/licitacoes"
  },
  {
    icon: Newspaper,
    title: "Diário Oficial",
    description: "Publicações oficiais do município",
    color: "bg-secondary",
    href: "#"
  },
  {
    icon: Building2,
    title: "Saúde",
    description: "Serviços e informações de saúde",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: BookOpen,
    title: "Educação",
    description: "Serviços e informações educacionais",
    color: "bg-secondary",
    href: "#"
  },
  {
    icon: Phone,
    title: "Telefones Úteis",
    description: "Lista de contatos importantes",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: FileText,
    title: "Perguntas Frequentes",
    description: "Dúvidas comuns respondidas",
    color: "bg-secondary",
    href: "#"
  }
];

export function useServicos() {
  return useQuery({
    queryKey: ["servicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error || !data || data.length === 0) {
        return fallbackServicos;
      }
      
      return data.map(item => ({
        icon: iconMap[item.icone] || FileText,
        title: item.titulo,
        description: item.descricao,
        color: item.cor || "bg-primary",
        href: item.link || "#",
      })) as Servico[];
    },
  });
}
