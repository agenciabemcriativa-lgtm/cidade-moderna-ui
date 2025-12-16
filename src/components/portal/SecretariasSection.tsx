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
  ShieldCheck,
  HardHat,
  Dumbbell,
  Shield,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSecretarias } from "@/hooks/useSecretarias";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, LucideIcon> = {
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
  ShieldCheck,
  HardHat,
  Dumbbell,
  Shield,
};

export function SecretariasSection() {
  const { data: secretarias, isLoading } = useSecretarias();

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
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 text-center">
                <Skeleton className="w-16 h-16 mx-auto rounded-2xl mb-4" />
                <Skeleton className="h-5 w-24 mx-auto mb-3" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))
          ) : (
            secretarias?.map((sec, index) => {
              const IconComponent = iconMap[sec.icone || "Building2"] || Building2;
              return (
                <div
                  key={sec.slug}
                  className="group bg-card rounded-2xl p-6 card-shadow hover:card-elevated transition-all duration-300 hover:-translate-y-1 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {sec.nome}
                  </h3>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/secretaria/${sec.slug}`}>Acessar Secretaria</Link>
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
