import { Link } from "react-router-dom";
import { FileText, Calendar, ArrowRight, Scale, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { usePublicacoesOficiais, tipoLabels, situacaoLabels, situacaoColors } from "@/hooks/usePublicacoesOficiais";

const tipoIcons: Record<string, string> = {
  lei: "📜",
  decreto: "📋",
  portaria: "📄",
  resolucao: "📑",
  instrucao_normativa: "📝",
  ato_administrativo: "📃",
  edital: "📢",
  comunicado: "📣",
  outros: "📎",
};

export function PublicacoesCarousel() {
  const { data: publicacoes, isLoading } = usePublicacoesOficiais({ publicado: true });
  
  // Get latest 10 publications
  const latestPublicacoes = publicacoes?.slice(0, 10) || [];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-muted/40 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-highlight/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg shadow-primary/20">
              <Scale className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Publicações Oficiais
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Leis, decretos, portarias e demais atos normativos do município de Ipubi
          </p>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border">
                <Skeleton className="h-6 w-20 mb-4 rounded-full" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : latestPublicacoes.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {latestPublicacoes.map((pub) => (
                <CarouselItem key={pub.id} className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col group overflow-hidden">
                    {/* Card Header with Type */}
                    <div className="p-5 pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{tipoIcons[pub.tipo] || "📄"}</span>
                          <Badge 
                            variant="secondary" 
                            className="font-medium bg-primary/10 text-primary border-0"
                          >
                            {tipoLabels[pub.tipo]}
                          </Badge>
                        </div>
                        <Badge 
                          className={`text-xs font-medium border-0 ${situacaoColors[pub.situacao]}`}
                        >
                          {situacaoLabels[pub.situacao]}
                        </Badge>
                      </div>

                      {/* Number */}
                      <p className="text-sm font-semibold text-primary mb-2">
                        Nº {pub.numero}/{pub.ano}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 flex-1 flex flex-col">
                      {/* Title */}
                      <Link to={`/publicacao/${pub.id}`} className="block">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-base mb-2">
                          {pub.titulo}
                        </h3>
                      </Link>

                      {/* Ementa */}
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {pub.ementa}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-4 mt-auto">
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(pub.data_publicacao), "dd MMM yyyy", { locale: ptBR })}
                        </span>
                        <div className="flex items-center gap-1">
                          {pub.texto_completo_url && (
                            <a
                              href={pub.texto_completo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                              title="Baixar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            to={`/publicacao/${pub.id}`}
                            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            title="Ver detalhes"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 md:-left-5 w-10 h-10 bg-card border-border shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" />
            <CarouselNext className="-right-3 md:-right-5 w-10 h-10 bg-card border-border shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" />
          </Carousel>
        ) : (
          <div className="bg-card rounded-2xl border border-border py-16 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma publicação encontrada</h3>
            <p className="text-muted-foreground">
              As publicações oficiais serão exibidas aqui quando disponíveis.
            </p>
          </div>
        )}

        {/* Quick filters and CTA */}
        <div className="mt-10 flex flex-col items-center gap-6">
          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Leis", tipo: "lei" },
              { label: "Decretos", tipo: "decreto" },
              { label: "Portarias", tipo: "portaria" },
              { label: "Editais", tipo: "edital" },
              { label: "Resoluções", tipo: "resolucao" },
            ].map((filter) => (
              <Link key={filter.tipo} to={`/publicacoes-oficiais?tipo=${filter.tipo}`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full bg-card border border-border hover:border-primary hover:bg-primary/5 hover:text-primary px-5"
                >
                  {filter.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Main CTA */}
          <Link to="/publicacoes-oficiais">
            <Button 
              size="lg" 
              className="rounded-full gap-2 px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Ver todas as publicações
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
