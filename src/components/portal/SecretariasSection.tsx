import { 
  Building2, 
  GraduationCap, 
  Heart, 
  Leaf, 
  Scale, 
  Wallet,
  Users,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const secretarias = [
  { icon: Building2, name: "Administração", slug: "administracao" },
  { icon: GraduationCap, name: "Educação", slug: "educacao" },
  { icon: Heart, name: "Saúde", slug: "saude" },
  { icon: Users, name: "Assistência Social", slug: "assistencia-social" },
  { icon: Wallet, name: "Finanças", slug: "financas" },
  { icon: Truck, name: "Obras e Infraestrutura", slug: "obras" },
  { icon: Leaf, name: "Meio Ambiente", slug: "meio-ambiente" },
  { icon: Scale, name: "Assuntos Jurídicos", slug: "juridico" },
];

export function SecretariasSection() {
  return (
    <section className="py-16 bg-muted" id="secretarias">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Estrutura Administrativa
          </span>
          <h2 className="section-title text-foreground">Secretarias Municipais</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Conheça as secretarias e seus serviços disponíveis à população
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {secretarias.map((sec, index) => (
            <div
              key={sec.slug}
              className="group bg-card rounded-2xl p-6 card-shadow hover:card-elevated transition-all duration-300 hover:-translate-y-1 text-center animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <sec.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {sec.name}
              </h3>
              <Button variant="outline" size="sm" className="w-full">
                Acessar Secretaria
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
