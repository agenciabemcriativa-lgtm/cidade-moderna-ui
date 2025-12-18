import { Link } from "react-router-dom";
import { FileText, Calendar, ArrowRight, ChevronLeft, ChevronRight, Scale, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
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

export function PublicacoesCarousel() {
  const { data: publicacoes, isLoading } = usePublicacoesOficiais({ publicado: true });
  
  // Get latest 10 publications
  const latestPublicacoes = publicacoes?.slice(0, 10) || [];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Publicações Oficiais
              </h2>
              <p className="text-muted-foreground">
                Leis, decretos, portarias e demais atos normativos do município
              </p>
            </div>
          </div>
          <Link to="/publicacoes-oficiais">
            <Button variant="outline" className="gap-2">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mb-3" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
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
            <CarouselContent className="-ml-2 md:-ml-4">
              {latestPublicacoes.map((pub) => (
                <CarouselItem key={pub.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border group">
                    <CardContent className="p-5 flex flex-col h-full">
                      {/* Type and Status badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {tipoLabels[pub.tipo]}
                        </Badge>
                        <Badge className={`text-xs ${situacaoColors[pub.situacao]}`}>
                          {situacaoLabels[pub.situacao]}
                        </Badge>
                      </div>

                      {/* Number */}
                      <p className="text-sm text-muted-foreground mb-1">
                        Nº {pub.numero}/{pub.ano}
                      </p>

                      {/* Title */}
                      <Link to={`/publicacao/${pub.id}`} className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {pub.titulo}
                        </h3>
                      </Link>

                      {/* Ementa */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {pub.ementa}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(pub.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <div className="flex items-center gap-2">
                          {pub.texto_completo_url && (
                            <a
                              href={pub.texto_completo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Baixar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            to={`/publicacao/${pub.id}`}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-6 bg-background border-border shadow-md hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="-right-4 md:-right-6 bg-background border-border shadow-md hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma publicação encontrada</h3>
              <p className="text-muted-foreground">
                As publicações oficiais serão exibidas aqui quando disponíveis.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <Link to="/publicacoes-oficiais?tipo=lei">
            <Button variant="outline" size="sm" className="rounded-full">
              Leis
            </Button>
          </Link>
          <Link to="/publicacoes-oficiais?tipo=decreto">
            <Button variant="outline" size="sm" className="rounded-full">
              Decretos
            </Button>
          </Link>
          <Link to="/publicacoes-oficiais?tipo=portaria">
            <Button variant="outline" size="sm" className="rounded-full">
              Portarias
            </Button>
          </Link>
          <Link to="/publicacoes-oficiais?tipo=edital">
            <Button variant="outline" size="sm" className="rounded-full">
              Editais
            </Button>
          </Link>
          <Link to="/legislacao">
            <Button variant="outline" size="sm" className="rounded-full">
              Legislação
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}