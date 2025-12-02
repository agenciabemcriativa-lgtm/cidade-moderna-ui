import { 
  Building2, 
  GraduationCap, 
  Heart, 
  Leaf, 
  Wallet,
  Users,
  Truck,
  Palette,
  Tractor,
  Trophy,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const secretarias = [
  { icon: Building2, name: "Administração", slug: "administracao" },
  { icon: ShieldCheck, name: "Controle Interno", slug: "controle-interno" },
  { icon: Palette, name: "Cultura", slug: "cultura" },
  { icon: Tractor, name: "Desenvolvimento Rural", slug: "desenvolvimento-rural" },
  { icon: Users, name: "Desenvolvimento Social", slug: "desenvolvimento-social" },
  { icon: GraduationCap, name: "Educação", slug: "educacao" },
  { icon: Trophy, name: "Esporte", slug: "esporte" },
  { icon: Wallet, name: "Finanças", slug: "financas" },
  { icon: Truck, name: "Obras e Urbanismo", slug: "obras-urbanismo" },
  { icon: Heart, name: "Saúde", slug: "saude" },
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
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/secretaria/${sec.slug}`}>Acessar Secretaria</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
