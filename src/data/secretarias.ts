export interface Secretaria {
  slug: string;
  nome: string;
  icone: string;
  secretario: {
    nome: string;
    foto: string;
    biografia: string;
  };
  contato: {
    endereco: string;
    telefone: string;
    email: string;
    horario: string;
  };
}

export const secretariasData: Secretaria[] = [
  {
    slug: "administracao",
    nome: "Secretaria de Administração",
    icone: "Building2",
    secretario: {
      nome: "Dr. Carlos Alberto Silva",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      biografia: "Formado em Administração Pública pela Universidade Federal, com mais de 20 anos de experiência na gestão pública municipal. Especialista em modernização administrativa e gestão de pessoas.",
    },
    contato: {
      endereco: "Praça Central, 100 - Centro",
      telefone: "(00) 3333-1001",
      email: "administracao@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 14h",
    },
  },
  {
    slug: "controle-interno",
    nome: "Secretaria de Controle Interno",
    icone: "ShieldCheck",
    secretario: {
      nome: "Dra. Maria Fernanda Costa",
      foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
      biografia: "Auditora pública com especialização em Controladoria e Finanças Públicas. Atua há 15 anos no serviço público, com foco em transparência e eficiência na gestão dos recursos municipais.",
    },
    contato: {
      endereco: "Praça Central, 100 - Centro, Sala 201",
      telefone: "(00) 3333-1002",
      email: "controleinterno@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 14h",
    },
  },
  {
    slug: "cultura",
    nome: "Secretaria de Cultura",
    icone: "Palette",
    secretario: {
      nome: "Prof. Roberto Nascimento",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      biografia: "Professor de História e Artes, com mestrado em Gestão Cultural. Coordenou diversos projetos culturais e festivais regionais nos últimos 10 anos.",
    },
    contato: {
      endereco: "Av. das Artes, 500 - Centro Cultural",
      telefone: "(00) 3333-1003",
      email: "cultura@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 17h",
    },
  },
  {
    slug: "desenvolvimento-rural",
    nome: "Secretaria de Desenvolvimento Rural",
    icone: "Tractor",
    secretario: {
      nome: "Eng. Agr. José Antônio Pereira",
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      biografia: "Engenheiro Agrônomo com 25 anos de atuação no setor agrícola. Especialista em agricultura familiar e desenvolvimento sustentável.",
    },
    contato: {
      endereco: "Rodovia Municipal, Km 5 - Zona Rural",
      telefone: "(00) 3333-1004",
      email: "rural@prefeitura.gov.br",
      horario: "Segunda a Sexta, 07h às 13h",
    },
  },
  {
    slug: "desenvolvimento-social",
    nome: "Secretaria de Desenvolvimento Social",
    icone: "Users",
    secretario: {
      nome: "Dra. Ana Paula Santos",
      foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      biografia: "Assistente Social com doutorado em Políticas Públicas. Atua há 18 anos na área social, coordenando programas de assistência e inclusão social.",
    },
    contato: {
      endereco: "Rua da Solidariedade, 200 - Centro",
      telefone: "(00) 3333-1005",
      email: "social@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 14h",
    },
  },
  {
    slug: "educacao",
    nome: "Secretaria de Educação",
    icone: "GraduationCap",
    secretario: {
      nome: "Profa. Dra. Luciana Mendes",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      biografia: "Pedagoga com doutorado em Educação. Mais de 20 anos de experiência na educação pública, com foco em inovação pedagógica e inclusão escolar.",
    },
    contato: {
      endereco: "Av. da Educação, 1000 - Centro",
      telefone: "(00) 3333-1006",
      email: "educacao@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 17h",
    },
  },
  {
    slug: "esporte",
    nome: "Secretaria de Esporte",
    icone: "Trophy",
    secretario: {
      nome: "Prof. Marcos Vinícius Lima",
      foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      biografia: "Educador Físico e ex-atleta profissional. Especialista em gestão esportiva e políticas públicas de incentivo ao esporte e lazer.",
    },
    contato: {
      endereco: "Complexo Esportivo Municipal - Setor Norte",
      telefone: "(00) 3333-1007",
      email: "esporte@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 18h",
    },
  },
  {
    slug: "financas",
    nome: "Secretaria de Finanças",
    icone: "Wallet",
    secretario: {
      nome: "Dr. Paulo Ricardo Almeida",
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      biografia: "Economista com MBA em Finanças Públicas. Mais de 15 anos de experiência em gestão fiscal e planejamento orçamentário municipal.",
    },
    contato: {
      endereco: "Praça Central, 100 - Centro, Térreo",
      telefone: "(00) 3333-1008",
      email: "financas@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 14h",
    },
  },
  {
    slug: "obras-urbanismo",
    nome: "Secretaria de Obras e Urbanismo",
    icone: "HardHat",
    secretario: {
      nome: "Eng. Civil Fernando Oliveira",
      foto: "https://images.unsplash.com/photo-1556157382-97edd2f9e4b8?w=300&h=300&fit=crop&crop=face",
      biografia: "Engenheiro Civil com especialização em Urbanismo. Coordenou grandes obras de infraestrutura e possui experiência em planejamento urbano sustentável.",
    },
    contato: {
      endereco: "Rua das Obras, 300 - Centro",
      telefone: "(00) 3333-1009",
      email: "obras@prefeitura.gov.br",
      horario: "Segunda a Sexta, 07h às 13h",
    },
  },
  {
    slug: "saude",
    nome: "Secretaria de Saúde",
    icone: "Heart",
    secretario: {
      nome: "Dr. Ricardo Mendonça",
      foto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      biografia: "Médico com especialização em Saúde Pública e Gestão Hospitalar. Mais de 20 anos de experiência no SUS, com foco em atenção primária.",
    },
    contato: {
      endereco: "Av. da Saúde, 800 - Centro",
      telefone: "(00) 3333-1010",
      email: "saude@prefeitura.gov.br",
      horario: "Segunda a Sexta, 08h às 17h",
    },
  },
];
