export interface PlanItem {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: string;
  periodLabel: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

export interface ModalityItem {
  id: string;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  iconName: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  timeAsMember: string;
  content: string;
  stars: number;
  highlight: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const GYM_CONFIG = {
  name: "Helmans Academy",
  tagline: "Musculação & Alta Performance",
  description: "A melhor estrutura de musculação, peso livre e biomecânica avançada para quem busca hipertrofia, força e evolução real.",
  phoneFormatted: "(11) 99999-9999",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "5511999999999",
  address: "Av. Principal, 1000 - Centro Empresarial, São Paulo - SP",
  instagramUrl: "https://instagram.com/helmansacademy",
  saasUrl: import.meta.env.VITE_SAAS_URL || "",
};

export const GYM_STATS = [
  { value: "+1.500", label: "Alunos Ativos", sub: "Evolução constante" },
  { value: "1.200m²", label: "Área de Treino", sub: "Espaço 100% climatizado" },
  { value: "+10.000kg", label: "Halteres & Anilhas", sub: "Área de peso livre completa" },
  { value: "4.9 ★", label: "Avaliação Google", sub: "Mais de 380 avaliações reais" },
];

export const GYM_PLANS: PlanItem[] = [
  {
    id: "mensal",
    name: "Plano Mensal",
    priceMonthly: "R$ 139,90",
    periodLabel: "/mês",
    description: "Ideal para quem busca total flexibilidade sem compromisso de fidelidade.",
    features: [
      "Acesso livre a toda musculação e cardio",
      "Horários 100% livres (Segunda a Domingo)",
      "Sem taxa de cancelamento ou fidelidade",
      "Avaliação física inicial inclusa",
      "Suporte de instrutores no salão",
    ],
    ctaText: "Começar Agora",
  },
  {
    id: "trimestral",
    name: "Plano Trimestral",
    badge: "Consistência Garantida",
    priceMonthly: "R$ 119,90",
    periodLabel: "/mês no plano",
    description: "Perfeito para criar o hábito e consolidar seus primeiros grandes ganhos.",
    features: [
      "Tudo do Plano Mensal",
      "Economia garantida no ciclo de 3 meses",
      "1 reavaliação de bioimpedância gratuita",
      "Acompanhamento e ajuste de ficha",
      "Desconto em suplementos parceiros",
    ],
    ctaText: "Garantir Trimestral",
  },
  {
    id: "anual-vip",
    name: "Plano Black VIP",
    badge: "Mais Escolhido • Melhor Custo-Benefício",
    isPopular: true,
    priceMonthly: "R$ 99,90",
    periodLabel: "/mês (12x no cartão)",
    description: "Para quem leva o treino a sério e deseja o melhor ambiente com máxima economia.",
    features: [
      "Acesso total e irrestrito 7 dias por semana",
      "Menor valor mensal garantido",
      "Bioimpedância trimestral gratuita",
      "Direito a 2 convites VIP mensais para amigos",
      "Armário rotativo exclusivo",
      "Acesso prioritário à futura Área do Aluno",
    ],
    ctaText: "Matricular no Plano VIP",
  },
];

export const GYM_MODALITIES: ModalityItem[] = [
  {
    id: "musculacao-pesada",
    title: "Musculação & Hipertrofia",
    category: "Força & Estética",
    description: "Maquinário de biomecânica profissional, halteres pesados (até 50kg+) e bancos reforçados para sobrecarga progressiva com máxima segurança articular.",
    benefits: ["Equipamentos convergentes e articulados", "Halteres de 1kg a 50kg emborrachados", "Bancos olímpicos com travas de segurança"],
    iconName: "Dumbbell",
  },
  {
    id: "cardio-resistencia",
    title: "Cardio & Alta Performance",
    category: "Condicionamento",
    description: "Esteiras profissionais de alto amortecimento, escadas elípticas, bikes de spinning e air bikes para queima calórica e saúde cardiovascular impecável.",
    benefits: ["Esteiras com absorção de impacto", "Simuladores de escada para glúteos e pernas", "Monitores de frequência cardíaca integrados"],
    iconName: "Flame",
  },
  {
    id: "treinamento-funcional",
    title: "Treinamento Funcional & Core",
    category: "Agilidade & Potência",
    description: "Espaço dedicado para treinos dinâmicos com kettlebells, cordas navais, caixas de salto, elásticos e trenós para mobilidade e condicionamento geral.",
    benefits: ["Gramado sintético com trenó de empurrar", "Cordas navais de alta resistência", "Melhora de mobilidade e postura"],
    iconName: "Zap",
  },
  {
    id: "bioimpedancia-personal",
    title: "Bioimpedância & Avaliação Física",
    category: "Saúde & Diagnóstico",
    description: "Medição precisa da composição corporal (massa magra, porcentagem de gordura, água e taxa metabólica basal) para direcionar sua evolução com dados reais.",
    benefits: ["Relatório digital detalhado", "Acompanhamento de metas periódicas", "Prescrição precisa de treino"],
    iconName: "Activity",
  },
];

export const GYM_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Rodrigo Carvalho",
    role: "Aluno há 1 ano e meio",
    timeAsMember: "-18kg eliminados e ganho de 6kg de massa",
    stars: 5,
    highlight: "Biomecânica e halteres que você não encontra em academia de rede.",
    content: "O que me conquistou na Helmans Academy foi o respeito pelo treino sério. Não tem aparelho quebrado, os pesos livres são fartos e os instrutores realmente corrigem a execução. Mudou meu físico e minha disciplina.",
  },
  {
    id: "t2",
    name: "Camila Guimarães",
    role: "Aluna há 8 meses",
    timeAsMember: "Foco em hipertrofia e saúde",
    stars: 5,
    highlight: "Ambiente motivador e climatizado de verdade.",
    content: "Tinha receio de academias pesadas, mas na Helmans me senti super acolhida desde o primeiro dia de aula experimental. A estrutura é limpa, ampla e os professores montam treinos personalizados de verdade.",
  },
  {
    id: "t3",
    name: "Marcos Vinicius",
    role: "Aluno há 2 anos",
    timeAsMember: "Atleta amador de Powerlifting",
    stars: 5,
    highlight: "O melhor rack de halteres e anilhas da região.",
    content: "Quem treina pesado sabe a raiva de ficar revezando anilha ou usando barra torta. Na Helmans tudo é de ferro puro, chão emborrachado grosso e equipamento profissional. Não troco por nenhuma outra.",
  },
];

export const GYM_FAQS: FaqItem[] = [
  {
    question: "Como funciona a aula experimental gratuita?",
    answer: "Basta clicar em 'Agendar Aula Grátis' ou enviar uma mensagem no WhatsApp. Você escolhe o melhor dia e turno, e nossa recepção já deixa sua entrada liberada com acompanhamento de um instrutor.",
  },
  {
    question: "Preciso pagar taxa de matrícula ou anuidade?",
    answer: "Não cobramos taxas de matrícula abusivas e nossos planos são transparentes. No Plano Black VIP você ainda tem benefícios exclusivos e isenções completas.",
  },
  {
    question: "A academia abre aos finais de semana e feriados?",
    answer: "Sim! Abrimos de Segunda a Sexta das 05:00 às 23:00, aos Sábados das 08:00 às 18:00, e aos Domingos e Feriados das 08:00 às 14:00.",
  },
  {
    question: "Como funciona a futura Área do Aluno?",
    answer: "Estamos desenvolvendo nosso SaaS exclusivo! Em breve, todos os alunos terão aplicativo próprio para visualizar ficha de treinos com vídeos explicativos, histórico de cargas, relatórios de bioimpedância e controle de pagamentos.",
  },
  {
    question: "A Helmans Academy possui estacionamento?",
    answer: "Sim, contamos com convênio de estacionamento gratuito e vagas próprias para motos e carros bem em frente à academia.",
  },
];
