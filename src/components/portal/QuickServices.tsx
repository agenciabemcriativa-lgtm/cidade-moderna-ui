import { 
  FileSearch, 
  Printer, 
  ClipboardList, 
  Download, 
  HelpCircle,
  Phone,
  MapPin,
  Clock
} from "lucide-react";

const quickServices = [
  { icon: FileSearch, label: "Consulta de Processos", href: "#processos" },
  { icon: Printer, label: "2ª Via de Boletos", href: "#boletos" },
  { icon: ClipboardList, label: "Agendamento Online", href: "#agendamento" },
  { icon: Download, label: "Formulários e Requerimentos", href: "#formularios" },
  { icon: HelpCircle, label: "Perguntas Frequentes", href: "#faq" },
  { icon: Phone, label: "Telefones Úteis", href: "#telefones" },
  { icon: MapPin, label: "Localização dos Órgãos", href: "#localizacao" },
  { icon: Clock, label: "Horário de Atendimento", href: "#horarios" },
];

export function QuickServices() {
  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wide mb-6 text-center">
          Serviços Rápidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickServices.map((service, index) => (
            <a
              key={service.label}
              href={service.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary flex items-center justify-center transition-all duration-300">
                <service.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
              </div>
              <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {service.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
