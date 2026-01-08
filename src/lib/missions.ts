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
  rotina: {
    name: 'Rotina e Saúde',
    description: 'Consistência mínima diária para bem-estar',
    icon: 'Heart',
    color: 'stage-rotina',
    gradient: 'gradient-rotina',
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  ambiente: {
    name: 'Ambiente',
    description: 'Organize seu espaço físico para reduzir ruído mental',
    icon: 'Home',
    color: 'stage-ambiente',
    gradient: 'gradient-ambiente',
    days: [8, 9, 10, 11, 12, 13, 14],
  },
  financas: {
    name: 'Finanças',
    description: 'Clareza financeira sem complexidade',
    icon: 'Wallet',
    color: 'stage-financas',
    gradient: 'gradient-financas',
    days: [15, 16, 17, 18, 19, 20, 21],
  },
  metas: {
    name: 'Metas e Direção',
    description: 'Clareza de objetivos e direcionamento',
    icon: 'Target',
    color: 'stage-metas',
    gradient: 'gradient-metas',
    days: [22, 23, 24, 25, 26, 27, 28, 29, 30],
  },
};

export const MISSIONS: MissionTemplate[] = [
  // SEMANA 1: FUNDAÇÃO EM ROTINA & SAÚDE (Dias 1-7)
  {
    day: 1,
    stage: 'rotina',
    title: 'Beber 1 copo de água logo ao acordar',
    description: 'Ativa o corpo e a mente com hidratação. É a vitória mais fácil para começar o dia.',
    checklist: [
      'Deixe um copo de água na mesa de cabeceira',
      'Beba imediatamente ao acordar',
      'Observe como se sente depois',
    ],
  },
  {
    day: 2,
    stage: 'rotina',
    title: 'Fazer 5 minutos de alongamento matinal',
    description: 'Desperta os músculos, melhora a postura e aumenta a energia para o dia.',
    checklist: [
      'Escolha 3-5 alongamentos simples',
      'Faça logo após levantar',
      'Respire profundamente durante',
    ],
  },
  {
    day: 3,
    stage: 'rotina',
    title: 'Não usar o celular na primeira hora do dia',
    description: 'Protege seu foco e reduz a ansiedade, permitindo que você comece o dia nos seus termos.',
    checklist: [
      'Deixe o celular fora do quarto ou no modo avião',
      'Faça sua rotina matinal sem telas',
      'Observe a diferença no seu humor',
    ],
  },
  {
    day: 4,
    stage: 'rotina',
    title: 'Expor-se à luz solar por 10 minutos pela manhã',
    description: 'Regula seu ciclo de sono, melhora o humor e aumenta os níveis de vitamina D.',
    checklist: [
      'Saia ao ar livre ou abra as janelas',
      'Fique 10 minutos exposto à luz natural',
      'Evite óculos de sol nesse momento',
    ],
  },
  {
    day: 5,
    stage: 'rotina',
    title: 'Fazer uma caminhada de 15 minutos',
    description: 'Movimenta o corpo, clareia a mente e combate o sedentarismo de forma leve.',
    checklist: [
      'Escolha um horário do dia',
      'Caminhe por 15 minutos sem distrações',
      'Preste atenção na respiração e ambiente',
    ],
  },
  {
    day: 6,
    stage: 'rotina',
    title: 'Preparar uma refeição saudável em casa',
    description: 'Dá a você controle total sobre sua nutrição e conecta você com o que come.',
    checklist: [
      'Escolha uma receita simples e saudável',
      'Prepare os ingredientes com calma',
      'Coma sem distrações, apreciando a refeição',
    ],
  },
  {
    day: 7,
    stage: 'rotina',
    title: 'Fazer um "detox digital" 1 hora antes de dormir',
    description: 'Melhora drasticamente a qualidade do seu sono e acalma a mente para um descanso reparador.',
    checklist: [
      'Desligue telas 1 hora antes de dormir',
      'Faça uma atividade relaxante (ler, alongar)',
      'Prepare o ambiente para o sono',
    ],
  },
  // SEMANA 2: ORGANIZANDO SEU AMBIENTE (Dias 8-14)
  {
    day: 8,
    stage: 'ambiente',
    title: 'Arrumar a cama assim que levantar',
    description: 'É a primeira tarefa do dia concluída, gerando um efeito dominó de organização e disciplina.',
    checklist: [
      'Arrume a cama imediatamente ao levantar',
      'Alinhe travesseiros e cobertores',
      'Observe a sensação de tarefa concluída',
    ],
  },
  {
    day: 9,
    stage: 'ambiente',
    title: 'Organizar sua área de trabalho ao final do dia',
    description: 'Garante que você comece o dia seguinte com clareza, sem o "peso" da bagunça anterior.',
    checklist: [
      'Guarde materiais usados durante o dia',
      'Limpe a superfície da mesa',
      'Deixe apenas o essencial visível',
    ],
  },
  {
    day: 10,
    stage: 'ambiente',
    title: 'Escolher a roupa do dia seguinte na noite anterior',
    description: 'Economiza tempo e energia mental pela manhã, eliminando uma decisão.',
    checklist: [
      'Escolha roupa completa para amanhã',
      'Deixe separada e acessível',
      'Inclua acessórios se necessário',
    ],
  },
  {
    day: 11,
    stage: 'ambiente',
    title: 'Limpar e organizar uma pequena área',
    description: 'Gera um pico de satisfação e senso de controle sobre seu espaço físico.',
    checklist: [
      'Escolha uma gaveta, prateleira ou canto',
      'Retire tudo e limpe',
      'Devolva apenas o que faz sentido manter',
    ],
  },
  {
    day: 12,
    stage: 'ambiente',
    title: 'Digitalizar ou jogar fora um papel/documento antigo',
    description: 'Começa o processo de reduzir a papelada e a desordem física que pesa na mente.',
    checklist: [
      'Encontre um documento ou papel acumulado',
      'Digitalize se importante ou descarte',
      'Crie uma pasta para documentos importantes',
    ],
  },
  {
    day: 13,
    stage: 'ambiente',
    title: 'Criar uma playlist para o seu dia',
    description: 'Molda a atmosfera do seu ambiente com som, influenciando diretamente seu humor e foco.',
    checklist: [
      'Crie playlist para foco/trabalho',
      'Adicione músicas que te energizam',
      'Teste durante suas atividades',
    ],
  },
  {
    day: 14,
    stage: 'ambiente',
    title: 'Jogar fora ou doar 5 itens que você não usa mais',
    description: 'Pratica o desapego e libera espaço físico e mental, deixando o ambiente mais leve.',
    checklist: [
      'Encontre 5 itens não utilizados',
      'Separe para doação ou descarte',
      'Efetue a doação ou descarte hoje',
    ],
  },
  // SEMANA 3: DOMINANDO SUAS FINANÇAS (Dias 15-21)
  {
    day: 15,
    stage: 'financas',
    title: 'Anotar todos os seus gastos do dia',
    description: 'É o primeiro passo para a consciência financeira. Você não pode controlar o que não mede.',
    checklist: [
      'Registre cada gasto do dia',
      'Inclua valor e categoria',
      'Use app, planilha ou papel',
    ],
  },
  {
    day: 16,
    stage: 'financas',
    title: 'Avaliar uma assinatura mensal',
    description: 'Incentiva o pensamento crítico sobre gastos recorrentes e "vazamentos" de dinheiro.',
    checklist: [
      'Liste suas assinaturas ativas',
      'Avalie o uso real de cada uma',
      'Cancele ou pause as não essenciais',
    ],
  },
  {
    day: 17,
    stage: 'financas',
    title: 'Preparar café/lanche em casa',
    description: 'Demonstra na prática como pequenas economias diárias geram um grande impacto no final do mês.',
    checklist: [
      'Prepare café ou lanche em casa',
      'Leve para o trabalho se aplicável',
      'Calcule quanto economizou',
    ],
  },
  {
    day: 18,
    stage: 'financas',
    title: 'Ler sobre um conceito financeiro básico',
    description: 'Aumenta seu letramento financeiro, dando a você poder e confiança para tomar melhores decisões.',
    checklist: [
      'Escolha um tema (juros compostos, orçamento, etc.)',
      'Leia por 15 minutos',
      'Anote um aprendizado principal',
    ],
  },
  {
    day: 19,
    stage: 'financas',
    title: 'Definir uma meta de economia para a semana',
    description: 'Transforma a ideia abstrata de "economizar" em um objetivo concreto e alcançável.',
    checklist: [
      'Defina um valor específico para economizar',
      'Identifique de onde virá essa economia',
      'Acompanhe ao longo da semana',
    ],
  },
  {
    day: 20,
    stage: 'financas',
    title: 'Colocar item no carrinho e esperar 24h',
    description: 'Treina o controle de impulsos, a principal causa de gastos desnecessários.',
    checklist: [
      'Encontre algo que deseja comprar',
      'Adicione ao carrinho mas não finalize',
      'Reavalie a necessidade após 24 horas',
    ],
  },
  {
    day: 21,
    stage: 'financas',
    title: 'Pagar uma conta ou organizar boletos',
    description: 'Gera um sentimento de responsabilidade e controle sobre suas obrigações financeiras.',
    checklist: [
      'Revise suas contas pendentes',
      'Pague ou agende pagamentos',
      'Organize boletos futuros',
    ],
  },
  // SEMANA 4: DEFININDO METAS & DIREÇÃO (Dias 22-30)
  {
    day: 22,
    stage: 'metas',
    title: 'Escrever a tarefa MAIS importante para amanhã',
    description: 'Garante que você acorde com clareza e direcione sua energia para o que realmente importa.',
    checklist: [
      'Identifique a tarefa mais impactante',
      'Escreva de forma clara e específica',
      'Coloque em local visível',
    ],
  },
  {
    day: 23,
    stage: 'metas',
    title: 'Escrever 3 coisas pelas quais é grato',
    description: 'Direciona sua mente para a abundância e o progresso já feito, criando uma base positiva.',
    checklist: [
      'Reflita sobre seu dia ou semana',
      'Escreva 3 gratidões específicas',
      'Sinta genuinamente cada uma',
    ],
  },
  {
    day: 24,
    stage: 'metas',
    title: 'Ler 10 páginas de um livro alinhado a um objetivo',
    description: 'Usa o aprendizado como ferramenta para se aproximar de onde você quer chegar.',
    checklist: [
      'Escolha um livro relevante para seus objetivos',
      'Leia pelo menos 10 páginas',
      'Anote uma ideia que pode aplicar',
    ],
  },
  {
    day: 25,
    stage: 'metas',
    title: 'Definir 3 metas realistas para o próximo mês',
    description: 'Transforma sonhos vagos em um plano de ação, dando um propósito claro para seus esforços.',
    checklist: [
      'Liste 3 objetivos para os próximos 30 dias',
      'Torne cada um específico e mensurável',
      'Defina a primeira ação para cada meta',
    ],
  },
  {
    day: 26,
    stage: 'metas',
    title: 'Fazer algo por 15 minutos que te aproxima de uma meta',
    description: 'Quebra a procrastinação e prova que pequenos passos consistentes levam a grandes resultados.',
    checklist: [
      'Escolha uma de suas metas',
      'Trabalhe nela por 15 minutos focados',
      'Celebre o progresso feito',
    ],
  },
  {
    day: 27,
    stage: 'metas',
    title: 'Revisar seu progresso e celebrar vitórias',
    description: 'Reforça o comportamento positivo e cria a motivação para continuar na jornada.',
    checklist: [
      'Revise o que conquistou na semana',
      'Liste suas principais vitórias',
      'Celebre de alguma forma significativa',
    ],
  },
  {
    day: 28,
    stage: 'metas',
    title: 'Escrever algo que aprendeu sobre si mesmo',
    description: 'Incentiva a autorreflexão, o pilar para qualquer crescimento sustentável.',
    checklist: [
      'Reflita sobre sua jornada no desafio',
      'Identifique um aprendizado sobre você',
      'Escreva como isso pode te ajudar',
    ],
  },
  {
    day: 29,
    stage: 'metas',
    title: 'Escolher os 3 melhores hábitos para você',
    description: 'Consolida o aprendizado e foca na personalização da jornada para além do desafio.',
    checklist: [
      'Revise todos os 28 hábitos anteriores',
      'Escolha os 3 mais impactantes para você',
      'Anote por que cada um é importante',
    ],
  },
  {
    day: 30,
    stage: 'metas',
    title: 'Criar plano para continuar seus hábitos favoritos',
    description: 'Transforma o desafio de 30 dias em um novo estilo de vida, garantindo o sucesso a longo prazo.',
    checklist: [
      'Defina como manter os 3 hábitos escolhidos',
      'Estabeleça gatilhos e horários',
      'Celebre a conclusão do desafio! 🎉',
    ],
  },
];

export function getMissionForDay(day: number): MissionTemplate | undefined {
  return MISSIONS.find(m => m.day === day);
}

export function getStageForDay(day: number): keyof typeof STAGE_INFO {
  if (day <= 7) return 'rotina';
  if (day <= 14) return 'ambiente';
  if (day <= 21) return 'financas';
  return 'metas';
}

export function getRandomQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
