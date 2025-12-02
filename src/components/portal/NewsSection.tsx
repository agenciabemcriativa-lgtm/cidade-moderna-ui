import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const news = [
  {
    id: 1,
    title: "Prefeitura inaugura nova UBS no Bairro Centro",
    summary: "A nova Unidade Básica de Saúde conta com 12 consultórios e atenderá mais de 15 mil moradores da região central.",
    date: "28 Nov 2024",
    category: "Saúde",
    categoryColor: "bg-accent",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Programa de Pavimentação chega ao Bairro Jardim",
    summary: "Mais de 5km de ruas serão pavimentadas nos próximos 60 dias, beneficiando milhares de famílias.",
    date: "25 Nov 2024",
    category: "Infraestrutura",
    categoryColor: "bg-primary",
    image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Matrículas para 2025 estão abertas nas escolas municipais",
    summary: "Pais e responsáveis podem realizar a matrícula online através do portal da Secretaria de Educação.",
    date: "22 Nov 2024",
    category: "Educação",
    categoryColor: "bg-secondary",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Feira do Produtor Rural acontece neste fim de semana",
    summary: "Evento reúne mais de 50 produtores locais com produtos frescos direto do campo para sua mesa.",
    date: "20 Nov 2024",
    category: "Eventos",
    categoryColor: "bg-highlight",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=250&fit=crop",
  },
];

export function NewsSection() {
  return (
    <section className="py-16 bg-card" id="noticias">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Fique Informado
            </span>
            <h2 className="section-title text-foreground">Últimas Notícias</h2>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            Ver Todas as Notícias
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item, index) => (
            <article
              key={item.id}
              className="group bg-background rounded-2xl overflow-hidden card-shadow hover:card-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-4 left-4 ${item.categoryColor} text-primary-foreground px-3 py-1 text-xs font-bold uppercase rounded-full`}>
                  {item.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {item.summary}
                </p>
                <a
                  href={`#noticia-${item.id}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-secondary transition-colors"
                >
                  Ler Matéria Completa
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
