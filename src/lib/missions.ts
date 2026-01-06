export interface MissionTemplate {
  day: number;
  stage: 'ambiente' | 'financas' | 'rotina' | 'metas';
  title: string;
  description: string;
  checklist: string[];
}

export const MOTIVATIONAL_QUOTES = [
  "A ordem exterior gera clareza interior.",
  "Pequenos passos, grandes transformações.",
  "Disciplina é liberdade.",
  "Hoje é o dia de construir o amanhã.",
  "Foco no progresso, não na perfeição.",
  "Sua vida muda quando seus hábitos mudam.",
  "Clareza vem da ação, não da espera.",
  "Cada dia é uma nova oportunidade.",
  "Simplicidade é a sofisticação suprema.",
  "O caos acaba onde a decisão começa.",
  "Controle seu espaço, controle sua mente.",
  "A organização é um ato de amor próprio.",
  "Menos é mais quando você sabe o que importa.",
  "Progrida um passo de cada vez.",
  "Sua rotina define seu destino.",
];

export const STAGE_INFO = {
  ambiente: {
    name: 'Ambiente',
    description: 'Organize seu espaço físico para reduzir ruído mental',
    icon: 'Home',
    color: 'stage-ambiente',
    gradient: 'gradient-ambiente',
    days: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  financas: {
    name: 'Finanças',
    description: 'Clareza financeira sem complexidade',
    icon: 'Wallet',
    color: 'stage-financas',
    gradient: 'gradient-financas',
    days: [9, 10, 11, 12, 13, 14, 15],
  },
  rotina: {
    name: 'Rotina e Saúde',
    description: 'Consistência mínima diária para bem-estar',
    icon: 'Heart',
    color: 'stage-rotina',
    gradient: 'gradient-rotina',
    days: [16, 17, 18, 19, 20, 21, 22, 23],
  },
  metas: {
    name: 'Metas e Direção',
    description: 'Clareza de objetivos e direcionamento',
    icon: 'Target',
    color: 'stage-metas',
    gradient: 'gradient-metas',
    days: [24, 25, 26, 27, 28, 29, 30],
  },
};

export const MISSIONS: MissionTemplate[] = [
  // AMBIENTE (Dias 1-8)
  {
    day: 1,
    stage: 'ambiente',
    title: 'Diagnóstico do Caos',
    description: 'Identifique as áreas da sua casa que mais precisam de atenção. Tire fotos do "antes".',
    checklist: [
      'Percorra cada cômodo da casa',
      'Identifique os 3 espaços mais bagunçados',
      'Tire fotos do estado atual',
      'Anote o que mais te incomoda',
    ],
  },
  {
    day: 2,
    stage: 'ambiente',
    title: 'Mesa de Trabalho Limpa',
    description: 'Sua mesa de trabalho é seu centro de produtividade. Organize-a para clareza mental.',
    checklist: [
      'Remova tudo da mesa',
      'Limpe a superfície',
      'Devolva apenas o essencial',
      'Organize cabos e fios',
      'Crie um sistema para papéis',
    ],
  },
  {
    day: 3,
    stage: 'ambiente',
    title: 'Eliminação de Itens',
    description: 'Livre-se do que não serve mais. Menos coisas, menos ruído mental.',
    checklist: [
      'Separe uma sacola para doação',
      'Descarte itens quebrados',
      'Elimine roupas não usadas há 1 ano',
      'Revise objetos decorativos sem valor',
    ],
  },
  {
    day: 4,
    stage: 'ambiente',
    title: 'Organização do Guarda-Roupa',
    description: 'Um guarda-roupa organizado economiza tempo e reduz decisões desnecessárias.',
    checklist: [
      'Tire todas as roupas do armário',
      'Separe por categoria',
      'Organize por frequência de uso',
      'Dobre ou pendure adequadamente',
      'Crie espaço para respirar',
    ],
  },
  {
    day: 5,
    stage: 'ambiente',
    title: 'Cozinha Funcional',
    description: 'A cozinha limpa promove alimentação saudável e bem-estar.',
    checklist: [
      'Limpe geladeira e freezer',
      'Organize despensa',
      'Descarte alimentos vencidos',
      'Organize utensílios por uso',
    ],
  },
  {
    day: 6,
    stage: 'ambiente',
    title: 'Banheiro Zen',
    description: 'Um banheiro organizado é um santuário de autocuidado.',
    checklist: [
      'Descarte produtos vencidos',
      'Organize por categoria',
      'Limpe profundamente',
      'Crie rotina de limpeza',
    ],
  },
  {
    day: 7,
    stage: 'ambiente',
    title: 'Espaço Digital',
    description: 'Organize seu ambiente digital: celular, computador, emails.',
    checklist: [
      'Delete apps não utilizados',
      'Organize pastas do computador',
      'Limpe caixa de entrada',
      'Cancele inscrições desnecessárias',
      'Organize área de trabalho',
    ],
  },
  {
    day: 8,
    stage: 'ambiente',
    title: 'Sistema de Manutenção',
    description: 'Crie rotinas para manter a organização conquistada.',
    checklist: [
      'Defina rotina de limpeza diária',
      'Estabeleça dia de faxina semanal',
      'Crie regra: entrou algo, saiu algo',
      'Fotografe o resultado final',
    ],
  },
  // FINANÇAS (Dias 9-15)
  {
    day: 9,
    stage: 'financas',
    title: 'Diagnóstico Financeiro',
    description: 'Entenda sua situação atual sem julgamento. Clareza é o primeiro passo.',
    checklist: [
      'Liste todas as fontes de renda',
      'Identifique contas e senhas bancárias',
      'Verifique saldo de todas as contas',
      'Liste dívidas existentes',
    ],
  },
  {
    day: 10,
    stage: 'financas',
    title: 'Rastreamento de Gastos',
    description: 'Registre cada gasto por uma semana. Consciência gera mudança.',
    checklist: [
      'Configure app de finanças ou planilha',
      'Registre gastos dos últimos 3 dias',
      'Categorize cada despesa',
      'Identifique padrões de consumo',
    ],
  },
  {
    day: 11,
    stage: 'financas',
    title: 'Corte de Gastos Fantasma',
    description: 'Elimine assinaturas e gastos recorrentes que não agregam valor.',
    checklist: [
      'Liste assinaturas ativas',
      'Cancele serviços não utilizados',
      'Negocie planos de telefone/internet',
      'Revise seguros e taxas',
    ],
  },
  {
    day: 12,
    stage: 'financas',
    title: 'Orçamento Simples',
    description: 'Crie um orçamento que você realmente vai seguir.',
    checklist: [
      'Defina gastos fixos mensais',
      'Estabeleça limite para variáveis',
      'Reserve % para emergências',
      'Planeje gastos do próximo mês',
    ],
  },
  {
    day: 13,
    stage: 'financas',
    title: 'Organização de Documentos',
    description: 'Centralize documentos importantes de forma acessível.',
    checklist: [
      'Reúna documentos financeiros',
      'Digitalize o que for possível',
      'Crie pasta física organizada',
      'Estabeleça local fixo para novos docs',
    ],
  },
  {
    day: 14,
    stage: 'financas',
    title: 'Metas Financeiras',
    description: 'Defina objetivos claros para seu dinheiro.',
    checklist: [
      'Defina meta de emergência (3-6 meses)',
      'Estabeleça objetivo de curto prazo',
      'Planeje objetivo de longo prazo',
      'Calcule quanto poupar por mês',
    ],
  },
  {
    day: 15,
    stage: 'financas',
    title: 'Sistema Financeiro',
    description: 'Automatize e simplifique sua gestão financeira.',
    checklist: [
      'Configure débito automático',
      'Estabeleça dia de revisão semanal',
      'Crie alerta de contas a pagar',
      'Documente seu sistema',
    ],
  },
  // ROTINA E SAÚDE (Dias 16-23)
  {
    day: 16,
    stage: 'rotina',
    title: 'Diagnóstico de Rotina',
    description: 'Mapeie como você realmente gasta seu tempo.',
    checklist: [
      'Registre atividades do dia',
      'Identifique desperdícios de tempo',
      'Anote horários de energia alta/baixa',
      'Liste hábitos atuais',
    ],
  },
  {
    day: 17,
    stage: 'rotina',
    title: 'Ritual Matinal',
    description: 'Crie uma manhã que te prepara para vencer o dia.',
    checklist: [
      'Defina horário de acordar',
      'Elimine celular nos primeiros 30min',
      'Inclua hidratação e movimento',
      'Pratique 5min de silêncio ou meditação',
    ],
  },
  {
    day: 18,
    stage: 'rotina',
    title: 'Ritual Noturno',
    description: 'Uma noite bem encerrada garante um sono reparador.',
    checklist: [
      'Defina horário de dormir',
      'Crie rotina de desconexão',
      'Prepare ambiente para sono',
      'Revise o dia e planeje amanhã',
    ],
  },
  {
    day: 19,
    stage: 'rotina',
    title: 'Movimento Diário',
    description: 'Incorpore atividade física de forma sustentável.',
    checklist: [
      'Escolha atividade que goste',
      'Defina horário fixo',
      'Comece com 15-20 minutos',
      'Prepare roupa na noite anterior',
    ],
  },
  {
    day: 20,
    stage: 'rotina',
    title: 'Alimentação Consciente',
    description: 'Simplifique suas escolhas alimentares.',
    checklist: [
      'Planeje refeições da semana',
      'Faça lista de compras',
      'Prepare marmitas se possível',
      'Defina horários de refeição',
    ],
  },
  {
    day: 21,
    stage: 'rotina',
    title: 'Gestão de Energia',
    description: 'Alinhe tarefas importantes com seus picos de energia.',
    checklist: [
      'Identifique seu horário nobre',
      'Reserve-o para trabalho profundo',
      'Agrupe tarefas similares',
      'Inclua pausas estratégicas',
    ],
  },
  {
    day: 22,
    stage: 'rotina',
    title: 'Descanso Intencional',
    description: 'Aprenda a descansar de verdade, não apenas parar.',
    checklist: [
      'Defina atividades de lazer genuíno',
      'Estabeleça limites de telas',
      'Planeje tempo de qualidade',
      'Pratique hobby ou interesse',
    ],
  },
  {
    day: 23,
    stage: 'rotina',
    title: 'Sistema de Rotina',
    description: 'Consolide sua rotina em um sistema sustentável.',
    checklist: [
      'Documente sua rotina ideal',
      'Identifique gatilhos de cada hábito',
      'Prepare ambiente para sucesso',
      'Defina métrica de acompanhamento',
    ],
  },
  // METAS E DIREÇÃO (Dias 24-30)
  {
    day: 24,
    stage: 'metas',
    title: 'Reflexão de Valores',
    description: 'Conecte-se com o que realmente importa para você.',
    checklist: [
      'Liste seus 5 valores principais',
      'Avalie alinhamento atual',
      'Identifique conflitos de valores',
      'Defina prioridades de vida',
    ],
  },
  {
    day: 25,
    stage: 'metas',
    title: 'Visão de Futuro',
    description: 'Visualize onde você quer estar em 1, 5 e 10 anos.',
    checklist: [
      'Escreva carta do seu eu futuro',
      'Visualize dia ideal em 5 anos',
      'Identifique mudanças necessárias',
      'Defina áreas de foco',
    ],
  },
  {
    day: 26,
    stage: 'metas',
    title: 'Meta Principal',
    description: 'Defina seu grande objetivo para os próximos 12 meses.',
    checklist: [
      'Escolha UMA meta principal',
      'Torne-a específica e mensurável',
      'Defina prazo realista',
      'Identifique motivação profunda',
    ],
  },
  {
    day: 27,
    stage: 'metas',
    title: 'Metas de Apoio',
    description: 'Crie metas menores que suportam seu objetivo principal.',
    checklist: [
      'Liste 3-5 metas secundárias',
      'Conecte cada uma à meta principal',
      'Defina prazos trimestrais',
      'Identifique primeira ação de cada',
    ],
  },
  {
    day: 28,
    stage: 'metas',
    title: 'Plano de Ação',
    description: 'Transforme metas em ações concretas e calendário.',
    checklist: [
      'Quebre meta principal em etapas',
      'Defina marcos mensais',
      'Agende ações no calendário',
      'Identifique possíveis obstáculos',
    ],
  },
  {
    day: 29,
    stage: 'metas',
    title: 'Sistema de Revisão',
    description: 'Crie rotina de acompanhamento do seu progresso.',
    checklist: [
      'Defina revisão semanal',
      'Estabeleça revisão mensal',
      'Crie métrica de acompanhamento',
      'Defina recompensas por marcos',
    ],
  },
  {
    day: 30,
    stage: 'metas',
    title: 'Celebração e Continuidade',
    description: 'Celebre sua jornada e planeje os próximos passos.',
    checklist: [
      'Compare antes e depois',
      'Liste principais conquistas',
      'Identifique aprendizados',
      'Defina próximo desafio',
      'Celebre sua transformação!',
    ],
  },
];

export function getMissionForDay(day: number): MissionTemplate | undefined {
  return MISSIONS.find(m => m.day === day);
}

export function getStageForDay(day: number): keyof typeof STAGE_INFO {
  if (day <= 8) return 'ambiente';
  if (day <= 15) return 'financas';
  if (day <= 23) return 'rotina';
  return 'metas';
}

export function getRandomQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
