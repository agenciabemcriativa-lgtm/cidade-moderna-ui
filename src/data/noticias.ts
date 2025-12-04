export interface Noticia {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  categoryColor: string;
  image: string;
}

export const noticiasData: Noticia[] = [
  {
    id: "1",
    slug: "inauguracao-nova-escola",
    title: "Prefeitura inaugura nova escola no bairro Centro",
    summary: "Nova unidade escolar vai atender mais de 500 alunos da rede municipal de ensino.",
    content: `
      <p>A Prefeitura Municipal de Ipubi inaugurou nesta segunda-feira a nova Escola Municipal de Ensino Fundamental, localizada no bairro Centro. A unidade escolar tem capacidade para atender mais de 500 alunos da rede municipal de ensino.</p>
      
      <p>A nova escola conta com 12 salas de aula climatizadas, laboratório de informática, biblioteca, quadra poliesportiva coberta, refeitório e área de recreação. O investimento total foi de R$ 3,5 milhões, provenientes de recursos próprios do município e convênios federais.</p>
      
      <p>"Este é um momento histórico para a educação de Ipubi. Estamos entregando uma escola moderna, com toda infraestrutura necessária para oferecer um ensino de qualidade aos nossos alunos", destacou o prefeito durante a cerimônia de inauguração.</p>
      
      <p>A secretária de Educação ressaltou que a nova unidade vai desafogar as escolas da região e permitir a ampliação do atendimento em tempo integral. "Com essa nova escola, vamos poder oferecer mais vagas e melhorar ainda mais a qualidade do ensino em nosso município", afirmou.</p>
      
      <p>As matrículas para a nova escola já estão abertas e podem ser realizadas na Secretaria Municipal de Educação ou diretamente na unidade escolar.</p>
    `,
    date: "28 Nov 2024",
    category: "Educação",
    categoryColor: "bg-accent",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    slug: "campanha-vacinacao-2024",
    title: "Campanha de vacinação atinge 95% da meta",
    summary: "Município supera expectativas na imunização contra gripe e COVID-19.",
    content: `
      <p>A campanha de vacinação contra gripe e COVID-19 em Ipubi alcançou 95% da meta estabelecida pelo Ministério da Saúde, superando as expectativas da Secretaria Municipal de Saúde.</p>
      
      <p>Ao todo, foram aplicadas mais de 15 mil doses de vacinas nos postos de saúde e unidades móveis espalhadas pelo município. A campanha priorizou idosos, crianças, gestantes, profissionais de saúde e pessoas com comorbidades.</p>
      
      <p>"Estamos muito satisfeitos com o resultado. A população de Ipubi demonstrou consciência sobre a importância da vacinação para a proteção individual e coletiva", destacou a secretária de Saúde.</p>
      
      <p>Os postos de vacinação continuam funcionando normalmente para atender quem ainda não se vacinou. A Secretaria de Saúde reforça que as vacinas são seguras e essenciais para prevenir formas graves das doenças.</p>
    `,
    date: "25 Nov 2024",
    category: "Saúde",
    categoryColor: "bg-secondary",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    slug: "obras-pavimentacao-bairros",
    title: "Obras de pavimentação beneficiam 5 bairros",
    summary: "Investimento de R$ 2 milhões em infraestrutura urbana melhora mobilidade.",
    content: `
      <p>A Prefeitura de Ipubi deu início às obras de pavimentação asfáltica que vão beneficiar cinco bairros da cidade. O investimento total é de R$ 2 milhões e contempla a pavimentação de mais de 10 quilômetros de vias urbanas.</p>
      
      <p>Os bairros contemplados são: Centro, Vila Nova, Jardim das Flores, Alto da Boa Vista e São José. As obras incluem drenagem, meio-fio, calçadas e sinalização viária.</p>
      
      <p>"Essas obras vão melhorar significativamente a qualidade de vida da população, facilitando o acesso e a mobilidade urbana", afirmou o secretário de Obras e Urbanismo.</p>
      
      <p>A previsão é que todas as obras sejam concluídas em até 6 meses. Durante a execução, algumas vias poderão ter o trânsito alterado, e a prefeitura pede compreensão à população.</p>
    `,
    date: "22 Nov 2024",
    category: "Obras",
    categoryColor: "bg-highlight text-highlight-foreground",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "4",
    slug: "feira-agricultura-familiar",
    title: "Feira da Agricultura Familiar bate recorde de vendas",
    summary: "Evento movimentou mais de R$ 50 mil e beneficiou produtores locais.",
    content: `
      <p>A Feira da Agricultura Familiar de Ipubi bateu recorde de vendas neste ano, movimentando mais de R$ 50 mil durante os três dias de evento. Participaram mais de 80 produtores rurais do município e região.</p>
      
      <p>O evento contou com venda de produtos orgânicos, artesanato, doces caseiros, queijos, mel e derivados. Além das vendas, a feira ofereceu oficinas de agricultura sustentável e palestras sobre comercialização.</p>
      
      <p>"A feira é uma oportunidade única para os nossos agricultores familiares comercializarem seus produtos diretamente ao consumidor, sem intermediários", destacou o secretário de Desenvolvimento Rural.</p>
      
      <p>A próxima edição da feira está prevista para março de 2025, e os interessados em participar já podem fazer inscrição na Secretaria de Desenvolvimento Rural.</p>
    `,
    date: "20 Nov 2024",
    category: "Agricultura",
    categoryColor: "bg-accent",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "5",
    slug: "programa-social-familias",
    title: "Programa Social beneficia 200 famílias em situação de vulnerabilidade",
    summary: "Ação distribui cestas básicas e kits de higiene para famílias carentes.",
    content: `
      <p>A Secretaria de Desenvolvimento Social realizou mais uma edição do programa de distribuição de cestas básicas e kits de higiene para famílias em situação de vulnerabilidade social. Nesta etapa, foram beneficiadas 200 famílias.</p>
      
      <p>Cada família recebeu uma cesta básica completa com alimentos não perecíveis e um kit de higiene pessoal. A ação faz parte do programa permanente de assistência social do município.</p>
      
      <p>"Nosso compromisso é garantir que nenhuma família de Ipubi passe necessidade. Trabalhamos incansavelmente para identificar e atender aqueles que mais precisam", afirmou a secretária de Desenvolvimento Social.</p>
      
      <p>As famílias interessadas em participar do programa devem procurar o CRAS mais próximo para fazer o cadastro e avaliação socioeconômica.</p>
    `,
    date: "18 Nov 2024",
    category: "Social",
    categoryColor: "bg-secondary",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "6",
    slug: "festival-cultural-ipubi",
    title: "Festival Cultural de Ipubi reúne milhares de visitantes",
    summary: "Evento celebrou a cultura local com shows, exposições e gastronomia típica.",
    content: `
      <p>O Festival Cultural de Ipubi reuniu milhares de visitantes durante o fim de semana, celebrando a rica cultura do município com shows musicais, exposições de arte, apresentações folclóricas e gastronomia típica.</p>
      
      <p>O evento contou com a participação de artistas locais e regionais, além de grupos de dança, teatro e música. A praça central foi transformada em um grande palco cultural, com atrações para todas as idades.</p>
      
      <p>"O festival é uma celebração da nossa identidade cultural. É um momento de valorizar nossos artistas, nossas tradições e nossa história", destacou a secretária de Cultura.</p>
      
      <p>A gastronomia típica foi um dos destaques do evento, com barracas oferecendo pratos tradicionais da culinária regional. O artesanato local também teve espaço garantido, com expositores vendendo peças únicas.</p>
    `,
    date: "15 Nov 2024",
    category: "Cultura",
    categoryColor: "bg-highlight text-highlight-foreground",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60"
  }
];

export function getNoticiaBySlug(slug: string): Noticia | undefined {
  return noticiasData.find(noticia => noticia.slug === slug);
}
