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
    icon: FileText,
    title: "Portal da Transparência",
    description: "Acesse informações sobre receitas, despesas e licitações do município",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: CreditCard,
    title: "IPTU e Tributos",
    description: "Emita guias, consulte débitos e negocie pendências",
    color: "bg-secondary",
    href: "#"
  },
  {
    icon: FileCheck,
    title: "Nota Fiscal",
    description: "Emita notas fiscais de serviços eletrônicas",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: Building2,
    title: "Alvará e Licenças",
    description: "Solicite alvarás de funcionamento e construção",
    color: "bg-secondary",
    href: "#"
  },
  {
    icon: Users,
    title: "Concursos",
    description: "Acompanhe editais e resultados de concursos públicos",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: Briefcase,
    title: "Licitações",
    description: "Consulte processos licitatórios e contratos",
    color: "bg-secondary",
    href: "#"
  },
  {
    icon: Scale,
    title: "Legislação",
    description: "Consulte leis, decretos e atos normativos",
    color: "bg-primary",
    href: "#"
  },
  {
    icon: Phone,
    title: "Ouvidoria",
    description: "Faça denúncias, sugestões ou elogios",
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
