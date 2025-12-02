import { 
  Eye, 
  FileText, 
  MessageSquare, 
  Receipt, 
  Heart, 
  Users,
  Building2,
  GraduationCap
} from "lucide-react";

const services = [
  {
    icon: Eye,
    title: "Portal da Transparência",
    description: "Acesse receitas, despesas e contratos públicos",
    color: "bg-primary",
    href: "#transparencia",
  },
  {
    icon: FileText,
    title: "Diário Oficial",
    description: "Publicações oficiais do município",
    color: "bg-secondary",
    href: "#diario",
  },
  {
    icon: MessageSquare,
    title: "Ouvidoria",
    description: "Faça denúncias, reclamações ou sugestões",
    color: "bg-accent",
    href: "#ouvidoria",
  },
  {
    icon: Receipt,
    title: "IPTU e Tributos",
    description: "Emissão de guias e consulta de débitos",
    color: "bg-primary",
    href: "#tributos",
  },
  {
    icon: Heart,
    title: "Saúde",
    description: "Agendamentos, UBS e serviços de saúde",
    color: "bg-accent",
    href: "#saude",
  },
  {
    icon: Users,
    title: "Assistência Social",
    description: "Programas sociais e CRAS",
    color: "bg-secondary",
    href: "#assistencia",
  },
  {
    icon: Building2,
    title: "Obras e Urbanismo",
    description: "Alvarás, licenças e fiscalização",
    color: "bg-primary",
    href: "#obras",
  },
  {
    icon: GraduationCap,
    title: "Educação",
    description: "Matrículas, escolas e programas",
    color: "bg-accent",
    href: "#educacao",
  },
];

export function ServicesGrid() {
  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-highlight text-highlight-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Acesso Rápido
          </span>
          <h2 className="section-title text-foreground">Serviços Principais</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Encontre rapidamente os serviços mais utilizados pelos cidadãos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <a
              key={service.title}
              href={service.href}
              className="group bg-card rounded-2xl p-6 card-shadow hover:card-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
