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
      'Antes de dormir, deixe um copo ou garrafa de água na mesa de cabeceira',
      'Ao despertar, beba a água ANTES de olhar o celular ou sair da cama',
      'Espere 2-3 minutos sentado para o corpo absorver a hidratação',
      'Registre como você se sentiu: mais alerta? Menos lento?',
      'Repita esse ritual amanhã para começar a criar o hábito',
    ],
  },
  {
    day: 2,
    stage: 'rotina',
    title: 'Fazer 5 minutos de alongamento matinal',
    description: 'Desperta os músculos, melhora a postura e aumenta a energia para o dia.',
    checklist: [
      'Alongue o pescoço: incline a cabeça para cada lado por 15 segundos',
      'Alongue os ombros: cruze um braço sobre o peito e segure por 20 segundos cada',
      'Alongue as costas: incline-se para frente tentando tocar os pés por 30 segundos',
      'Alongue as pernas: faça uma lunge (avanço) e segure 20 segundos cada lado',
      'Finalize com 5 respirações profundas de olhos fechados',
    ],
  },
  {
    day: 3,
    stage: 'rotina',
    title: 'Não usar o celular na primeira hora do dia',
    description: 'Protege seu foco e reduz a ansiedade, permitindo que você comece o dia nos seus termos.',
    checklist: [
      'Deixe o celular em modo avião ou em outro cômodo antes de dormir',
      'Use um despertador tradicional ou relógio para acordar',
      'Faça sua rotina matinal completa (banho, café, vestir-se) sem telas',
      'Se precisar verificar algo urgente, espere pelo menos 30 minutos',
      'Anote como você se sentiu: mais calmo? Menos ansioso? Mais presente?',
    ],
  },
  {
    day: 4,
    stage: 'rotina',
    title: 'Expor-se à luz solar por 10 minutos pela manhã',
    description: 'Regula seu ciclo de sono, melhora o humor e aumenta os níveis de vitamina D.',
    checklist: [
      'Saia ao ar livre nos primeiros 30 minutos após acordar (ideal)',
      'Fique em local com luz solar direta, sem óculos de sol',
      'Combine com uma atividade: tome café, leia ou simplesmente observe',
      'Se estiver nublado, ainda saia - a luz natural é suficiente',
      'Observe se você dorme melhor esta noite após a exposição',
    ],
  },
  {
    day: 5,
    stage: 'rotina',
    title: 'Fazer uma caminhada de 15 minutos',
    description: 'Movimenta o corpo, clareia a mente e combate o sedentarismo de forma leve.',
    checklist: [
      'Escolha um horário fixo: manhã, almoço ou fim do dia',
      'Vista roupas confortáveis e tênis apropriado',
      'Deixe o celular no bolso e foque no ambiente ao redor',
      'Mantenha um ritmo confortável, não precisa ser intenso',
      'Ao retornar, registre como seu nível de energia mudou',
    ],
  },
  {
    day: 6,
    stage: 'rotina',
    title: 'Preparar uma refeição saudável em casa',
    description: 'Dá a você controle total sobre sua nutrição e conecta você com o que come.',
    checklist: [
      'Escolha uma receita simples com até 5 ingredientes principais',
      'Compre os ingredientes frescos necessários',
      'Reserve 30-45 minutos para preparar com calma, sem pressa',
      'Sirva a refeição em um prato bonito, sentado à mesa',
      'Coma sem TV, celular ou distrações - aprecie cada garfada',
    ],
  },
  {
    day: 7,
    stage: 'rotina',
    title: 'Fazer um "detox digital" 1 hora antes de dormir',
    description: 'Melhora drasticamente a qualidade do seu sono e acalma a mente para um descanso reparador.',
    checklist: [
      'Defina um horário de "desligamento" (ex: 22h se dorme às 23h)',
      'Coloque o celular para carregar FORA do quarto',
      'Ative o modo "Não Perturbe" em todos os dispositivos',
      'Substitua a tela por: leitura, alongamento, conversa ou meditação',
      'Prepare o quarto: escureça, ajuste temperatura, organize a cama',
    ],
  },
  // SEMANA 2: ORGANIZANDO SEU AMBIENTE (Dias 8-14)
  {
    day: 8,
    stage: 'ambiente',
    title: 'Arrumar a cama assim que levantar',
    description: 'É a primeira tarefa do dia concluída, gerando um efeito dominó de organização e disciplina.',
    checklist: [
      'Levante-se imediatamente ao despertar, sem ficar deitado',
      'Estique o lençol de baixo e remova dobras',
      'Arrume lençol de cima e cobertor de forma simétrica',
      'Afofe e alinhe os travesseiros',
      'Dê um passo para trás e aprecie o resultado por 5 segundos',
    ],
  },
  {
    day: 9,
    stage: 'ambiente',
    title: 'Organizar sua área de trabalho ao final do dia',
    description: 'Garante que você comece o dia seguinte com clareza, sem o "peso" da bagunça anterior.',
    checklist: [
      'Guarde todos os papéis em pastas ou gavetas apropriadas',
      'Descarte lixo: copos, embalagens, papéis não necessários',
      'Limpe a superfície da mesa com um pano úmido',
      'Organize cabos e carregadores de forma ordenada',
      'Deixe apenas: computador, caderno, caneta e 1-2 itens essenciais',
    ],
  },
  {
    day: 10,
    stage: 'ambiente',
    title: 'Escolher a roupa do dia seguinte na noite anterior',
    description: 'Economiza tempo e energia mental pela manhã, eliminando uma decisão.',
    checklist: [
      'Verifique o clima e seus compromissos de amanhã',
      'Escolha a roupa completa: peças de cima, baixo e calçado',
      'Separe também roupas íntimas e meias',
      'Pendure ou deixe dobrada em local visível e acessível',
      'Se necessário, passe a roupa ou verifique se está limpa',
    ],
  },
  {
    day: 11,
    stage: 'ambiente',
    title: 'Limpar e organizar uma pequena área',
    description: 'Gera um pico de satisfação e senso de controle sobre seu espaço físico.',
    checklist: [
      'Escolha UMA área pequena: gaveta, prateleira, canto do armário',
      'Retire TODOS os itens dessa área',
      'Limpe a superfície vazia com pano úmido',
      'Avalie cada item: usar, doar, descartar ou guardar em outro lugar',
      'Devolva apenas o que você realmente usa, de forma organizada',
    ],
  },
  {
    day: 12,
    stage: 'ambiente',
    title: 'Digitalizar ou jogar fora um papel/documento antigo',
    description: 'Começa o processo de reduzir a papelada e a desordem física que pesa na mente.',
    checklist: [
      'Encontre uma pilha de papéis ou documentos acumulados',
      'Separe em categorias: importante, digitalizar, descartar',
      'Use o celular para fotografar ou escanear documentos importantes',
      'Crie uma pasta digital organizada (Google Drive, iCloud, etc.)',
      'Descarte com segurança os papéis não mais necessários',
    ],
  },
  {
    day: 13,
    stage: 'ambiente',
    title: 'Criar uma playlist para o seu dia',
    description: 'Molda a atmosfera do seu ambiente com som, influenciando diretamente seu humor e foco.',
    checklist: [
      'Abra seu app de música favorito (Spotify, YouTube Music, etc.)',
      'Crie uma playlist chamada "Foco" com músicas instrumentais ou lo-fi',
      'Crie uma playlist "Energia" com músicas que te motivam',
      'Adicione pelo menos 10 músicas em cada playlist',
      'Teste uma delas durante uma atividade hoje e veja o impacto',
    ],
  },
  {
    day: 14,
    stage: 'ambiente',
    title: 'Jogar fora ou doar 5 itens que você não usa mais',
    description: 'Pratica o desapego e libera espaço físico e mental, deixando o ambiente mais leve.',
    checklist: [
      'Faça uma varredura em armários, gavetas ou estantes',
      'Identifique 5 itens não usados há mais de 6 meses',
      'Separe em duas categorias: doação e descarte',
      'Coloque os itens de doação em uma sacola perto da porta',
      'Leve para um ponto de doação HOJE ou agende coleta',
    ],
  },
  // SEMANA 3: DOMINANDO SUAS FINANÇAS (Dias 15-21)
  {
    day: 15,
    stage: 'financas',
    title: 'Anotar todos os seus gastos do dia',
    description: 'É o primeiro passo para a consciência financeira. Você não pode controlar o que não mede.',
    checklist: [
      'Escolha uma ferramenta: app, planilha ou caderno',
      'Anote CADA gasto, por menor que seja (café, estacionamento, etc.)',
      'Inclua: valor exato, categoria e forma de pagamento',
      'Faça isso imediatamente após cada compra, não deixe acumular',
      'No final do dia, some o total e reflita: foi necessário?',
    ],
  },
  {
    day: 16,
    stage: 'financas',
    title: 'Avaliar uma assinatura mensal',
    description: 'Incentiva o pensamento crítico sobre gastos recorrentes e "vazamentos" de dinheiro.',
    checklist: [
      'Liste TODAS suas assinaturas: streaming, apps, academia, etc.',
      'Anote o valor mensal de cada uma',
      'Avalie: quantas vezes você usou cada serviço no último mês?',
      'Identifique pelo menos 1 para cancelar ou pausar',
      'Execute o cancelamento HOJE, não deixe para depois',
    ],
  },
  {
    day: 17,
    stage: 'financas',
    title: 'Preparar café/lanche em casa',
    description: 'Demonstra na prática como pequenas economias diárias geram um grande impacto no final do mês.',
    checklist: [
      'Prepare seu café da manhã ou lanche completo em casa',
      'Se trabalha fora, leve em recipientes adequados',
      'Calcule quanto gastaria comprando fora',
      'Anote a economia do dia (ex: R$ 15 economizados)',
      'Multiplique por 22 dias úteis e veja o impacto mensal',
    ],
  },
  {
    day: 18,
    stage: 'financas',
    title: 'Ler sobre um conceito financeiro básico',
    description: 'Aumenta seu letramento financeiro, dando a você poder e confiança para tomar melhores decisões.',
    checklist: [
      'Escolha um tema: juros compostos, reserva de emergência ou orçamento 50-30-20',
      'Pesquise um artigo ou vídeo de 10-15 minutos sobre o assunto',
      'Leia ou assista com atenção, sem distrações',
      'Anote 3 pontos principais que você aprendeu',
      'Pense: como posso aplicar isso na minha vida?',
    ],
  },
  {
    day: 19,
    stage: 'financas',
    title: 'Definir uma meta de economia para a semana',
    description: 'Transforma a ideia abstrata de "economizar" em um objetivo concreto e alcançável.',
    checklist: [
      'Defina um valor específico e realista (ex: R$ 50, R$ 100)',
      'Identifique DE ONDE virá essa economia (lanches, delivery, etc.)',
      'Crie uma "conta mental" ou envelope para esse valor',
      'Coloque um lembrete diário para verificar seu progresso',
      'No final da semana, transfira o valor para poupança ou investimento',
    ],
  },
  {
    day: 20,
    stage: 'financas',
    title: 'Colocar item no carrinho e esperar 24h',
    description: 'Treina o controle de impulsos, a principal causa de gastos desnecessários.',
    checklist: [
      'Identifique algo que você "quer" comprar (não precisa urgente)',
      'Adicione ao carrinho do site, mas NÃO finalize',
      'Anote o valor e por que você quer esse item',
      'Espere 24 horas completas antes de qualquer ação',
      'Após 24h, pergunte: ainda quero? Preciso? Tenho dinheiro para isso?',
    ],
  },
  {
    day: 21,
    stage: 'financas',
    title: 'Pagar uma conta ou organizar boletos',
    description: 'Gera um sentimento de responsabilidade e controle sobre suas obrigações financeiras.',
    checklist: [
      'Liste todas as contas do mês com datas de vencimento',
      'Identifique quais estão pendentes ou próximas',
      'Pague pelo menos uma conta hoje ou agende pagamento',
      'Organize os boletos futuros em pasta física ou digital',
      'Configure lembretes 3 dias antes de cada vencimento',
    ],
  },
  // SEMANA 4: DEFININDO METAS & DIREÇÃO (Dias 22-30)
  {
    day: 22,
    stage: 'metas',
    title: 'Escrever a tarefa MAIS importante para amanhã',
    description: 'Garante que você acorde com clareza e direcione sua energia para o que realmente importa.',
    checklist: [
      'Reflita: qual tarefa, se concluída, fará amanhã um sucesso?',
      'Escreva de forma clara e específica (evite "trabalhar no projeto")',
      'Use o formato: verbo + objeto + resultado (ex: "Finalizar relatório para enviar ao cliente")',
      'Coloque em local visível: post-it, celular ou quadro',
      'Ao acordar, comece por essa tarefa ANTES de qualquer outra coisa',
    ],
  },
  {
    day: 23,
    stage: 'metas',
    title: 'Escrever 3 coisas pelas quais é grato',
    description: 'Direciona sua mente para a abundância e o progresso já feito, criando uma base positiva.',
    checklist: [
      'Reserve 5 minutos em um momento tranquilo do dia',
      'Reflita sobre as últimas 24 horas ou semana',
      'Escreva 3 gratidões ESPECÍFICAS (não genéricas)',
      'Exemplo bom: "Gratidão pela ligação com minha mãe hoje"',
      'Sinta genuinamente cada gratidão por alguns segundos antes de escrever a próxima',
    ],
  },
  {
    day: 24,
    stage: 'metas',
    title: 'Ler 10 páginas de um livro alinhado a um objetivo',
    description: 'Usa o aprendizado como ferramenta para se aproximar de onde você quer chegar.',
    checklist: [
      'Escolha um livro relacionado a uma área que quer desenvolver',
      'Reserve um horário fixo para leitura (manhã ou noite)',
      'Leia pelo menos 10 páginas sem interrupções',
      'Grife ou anote 1-2 ideias principais',
      'Reflita: como posso aplicar isso na minha vida esta semana?',
    ],
  },
  {
    day: 25,
    stage: 'metas',
    title: 'Definir 3 metas realistas para o próximo mês',
    description: 'Transforma sonhos vagos em um plano de ação, dando um propósito claro para seus esforços.',
    checklist: [
      'Liste áreas importantes: saúde, carreira, relacionamentos, finanças',
      'Escolha 3 metas usando o método SMART (específica, mensurável, alcançável, relevante, temporal)',
      'Para cada meta, defina o "porquê" - sua motivação real',
      'Escreva a PRIMEIRA pequena ação para cada meta',
      'Coloque as metas em local visível e revise semanalmente',
    ],
  },
  {
    day: 26,
    stage: 'metas',
    title: 'Fazer algo por 15 minutos que te aproxima de uma meta',
    description: 'Quebra a procrastinação e prova que pequenos passos consistentes levam a grandes resultados.',
    checklist: [
      'Escolha uma das suas metas do dia 25',
      'Identifique UMA ação concreta que pode fazer agora',
      'Configure um timer para 15 minutos',
      'Trabalhe com foco total, sem distrações',
      'Ao final, celebre: você está 15 minutos mais perto do seu objetivo!',
    ],
  },
  {
    day: 27,
    stage: 'metas',
    title: 'Revisar seu progresso e celebrar vitórias',
    description: 'Reforça o comportamento positivo e cria a motivação para continuar na jornada.',
    checklist: [
      'Reserve 15 minutos para uma revisão semanal',
      'Liste 3-5 conquistas da semana, por menores que sejam',
      'Identifique o que funcionou bem e o que pode melhorar',
      'Celebre de forma significativa: sobremesa, passeio, tempo livre',
      'Compartilhe uma vitória com alguém importante para você',
    ],
  },
  {
    day: 28,
    stage: 'metas',
    title: 'Escrever algo que aprendeu sobre si mesmo',
    description: 'Incentiva a autorreflexão, o pilar para qualquer crescimento sustentável.',
    checklist: [
      'Reflita sobre sua jornada nesses 28 dias de desafio',
      'Pergunte-se: o que descobri sobre meus hábitos? Meus gatilhos?',
      'Escreva 1 aprendizado profundo sobre você mesmo',
      'Identifique como esse aprendizado pode te ajudar no futuro',
      'Guarde essa reflexão em lugar especial para reler depois',
    ],
  },
  {
    day: 29,
    stage: 'metas',
    title: 'Escolher os 3 melhores hábitos para você',
    description: 'Consolida o aprendizado e foca na personalização da jornada para além do desafio.',
    checklist: [
      'Revise a lista de todos os 28 hábitos praticados',
      'Avalie cada um: impacto na sua vida, facilidade de manter, prazer em fazer',
      'Selecione os 3 que mais fizeram diferença para você',
      'Escreva POR QUE cada um é importante para você especificamente',
      'Esses serão seus hábitos-âncora para a vida',
    ],
  },
  {
    day: 30,
    stage: 'metas',
    title: 'Criar plano para continuar seus hábitos favoritos',
    description: 'Transforma o desafio de 30 dias em um novo estilo de vida, garantindo o sucesso a longo prazo.',
    checklist: [
      'Pegue os 3 hábitos escolhidos no dia 29',
      'Para cada um, defina: horário específico e gatilho ("depois de X, faço Y")',
      'Identifique possíveis obstáculos e como superá-los',
      'Crie um sistema de acompanhamento: app, calendário ou diário',
      'Celebre a conclusão do desafio! 🎉 Você construiu uma nova versão de si mesmo!',
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
