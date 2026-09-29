import { DifficultyLevel, TypingPhrase } from '../types';
import { simplifyText } from '../utils/textUtils';

export const PHRASES_DATABASE: TypingPhrase[] = [
  // ==================== INICIANTE (Frases simples, curtas, palavras do dia a dia) ====================
  {
    id: 'ini-1',
    difficulty: 'iniciante',
    category: 'Tecnologia',
    text: 'O computador moderno processa dados com muita rapidez.',
  },
  {
    id: 'ini-2',
    difficulty: 'iniciante',
    category: 'Natureza',
    text: 'O sol nasce cedo e ilumina todo o vale verde.',
  },
  {
    id: 'ini-3',
    difficulty: 'iniciante',
    category: 'Cotidiano',
    text: 'Um cafezinho quente pela manhã ajuda a começar o dia bem.',
  },
  {
    id: 'ini-4',
    difficulty: 'iniciante',
    category: 'Educação',
    text: 'A leitura diária desenvolve a mente e a imaginação.',
  },
  {
    id: 'ini-5',
    difficulty: 'iniciante',
    category: 'Música',
    text: 'A música suave acalma a mente e renova o espírito.',
  },
  {
    id: 'ini-6',
    difficulty: 'iniciante',
    category: 'Saúde',
    text: 'Caminhar no parque faz muito bem para a saúde do corpo.',
  },
  {
    id: 'ini-7',
    difficulty: 'iniciante',
    category: 'Trabalho',
    text: 'O foco no objetivo traz resultados positivos para todos.',
  },
  {
    id: 'ini-8',
    difficulty: 'iniciante',
    category: 'Amizade',
    text: 'Uma boa conversa entre amigos alegra qualquer tarde.',
  },
  {
    id: 'ini-9',
    difficulty: 'iniciante',
    category: 'Arte',
    text: 'As cores da pintura mostram a beleza da criatividade.',
  },
  {
    id: 'ini-10',
    difficulty: 'iniciante',
    category: 'Ciência',
    text: 'A água é essencial para a vida em todo o planeta Terra.',
  },
  {
    id: 'ini-11',
    difficulty: 'iniciante',
    category: 'Esporte',
    text: 'O treino constante melhora o ritmo e a postura do atleta.',
  },
  {
    id: 'ini-12',
    difficulty: 'iniciante',
    category: 'Espaço',
    text: 'As estrelas brilham no céu escuro durante a noite.',
  },
  {
    id: 'ini-13',
    difficulty: 'iniciante',
    category: 'Culinária',
    text: 'O cheiro do pão assando enche toda a cozinha de alegria.',
  },
  {
    id: 'ini-14',
    difficulty: 'iniciante',
    category: 'Natureza',
    text: 'As ondas do mar quebram com calma na areia branca.',
  },
  {
    id: 'ini-15',
    difficulty: 'iniciante',
    category: 'Aprendizado',
    text: 'Praticar digitação todos os dias aumenta a sua agilidade.',
  },

  // ==================== SEM ACENTOS & SEM PONTUAÇÃO (Apenas letras minúsculas e espaços) ====================
  {
    id: 'sa-1',
    difficulty: 'sem_acentos',
    category: 'Escrita Direta',
    text: 'o sol brilha forte sobre o mar azul e a areia quente da praia',
  },
  {
    id: 'sa-2',
    difficulty: 'sem_acentos',
    category: 'Treino Basico',
    text: 'aprender a digitar com todos os dedos e uma habilidade muito util',
  },
  {
    id: 'sa-3',
    difficulty: 'sem_acentos',
    category: 'Cotidiano',
    text: 'um bom cafe quente de manha cedo ajuda a comecar o trabalho bem',
  },
  {
    id: 'sa-4',
    difficulty: 'sem_acentos',
    category: 'Tecnologia',
    text: 'os computadores modernos processam milhares de informacoes por segundo',
  },
  {
    id: 'sa-5',
    difficulty: 'sem_acentos',
    category: 'Natureza',
    text: 'as folhas das arvores caem devagar quando chega a estacao do outono',
  },
  {
    id: 'sa-6',
    difficulty: 'sem_acentos',
    category: 'Musica',
    text: 'ouvir uma boa musica acalma o coracao e traz paz para a mente',
  },
  {
    id: 'sa-7',
    difficulty: 'sem_acentos',
    category: 'Educacao',
    text: 'a leitura constante de livros abre caminhos e amplia a imaginacao',
  },
  {
    id: 'sa-8',
    difficulty: 'sem_acentos',
    category: 'Saude',
    text: 'beber bastante agua fresca e praticar caminhada faz bem para a vida',
  },
  {
    id: 'sa-9',
    difficulty: 'sem_acentos',
    category: 'Agilidade',
    text: 'mantenha o ritmo calmo e constante sem pressa para nao errar teclas',
  },
  {
    id: 'sa-10',
    difficulty: 'sem_acentos',
    category: 'Amizade',
    text: 'conversar com bons amigos e uma das melhores coisas do nosso dia',
  },
  {
    id: 'sa-11',
    difficulty: 'sem_acentos',
    category: 'Ciencia',
    text: 'o universo e cheio de misterios fascinantes que a ciencia busca entender',
  },
  {
    id: 'sa-12',
    difficulty: 'sem_acentos',
    category: 'Trabalho',
    text: 'ter foco e disciplina em cada tarefa ajuda a alcancar grandes metas',
  },

  // ==================== INTERMEDIÁRIO (Pontuação variada, frases compostas) ====================
  {
    id: 'int-1',
    difficulty: 'intermediario',
    category: 'Tecnologia',
    text: 'Com a evolução da internet, aprender programação tornou-se acessível a qualquer pessoa curiosa.',
  },
  {
    id: 'int-2',
    difficulty: 'intermediario',
    category: 'Filosofia',
    author: 'René Descartes',
    text: 'Não basta ter uma boa mente; o principal é saber aplicá-la com sabedoria e paciência.',
  },
  {
    id: 'int-3',
    difficulty: 'intermediario',
    category: 'Literatura',
    author: 'Clarice Lispector',
    text: 'Renda-se, como eu me rendi. Mergulhe no que você não conhece, como eu mergulhei.',
  },
  {
    id: 'int-4',
    difficulty: 'intermediario',
    category: 'Ciência',
    text: 'Você sabia que a luz do Sol demora cerca de oito minutos e vinte segundos para chegar à Terra?',
  },
  {
    id: 'int-5',
    difficulty: 'intermediario',
    category: 'Cotidiano',
    text: 'Ao abrir a janela pela manhã, sentiu o vento fresco: um prenúncio de que o outono havia chegado!',
  },
  {
    id: 'int-6',
    difficulty: 'intermediario',
    category: 'Educação',
    text: 'A escrita rápida exige coordenação, memória muscular e, acima de tudo, muita concentração.',
  },
  {
    id: 'int-7',
    difficulty: 'intermediario',
    category: 'Meio Ambiente',
    text: 'Preservar as florestas e os rios não é apenas uma escolha, mas sim um dever para o futuro.',
  },
  {
    id: 'int-8',
    difficulty: 'intermediario',
    category: 'Inovação',
    text: 'Quem busca transformar ideias em realidade precisa estar disposto a errar, ajustar e recomeçar.',
  },
  {
    id: 'int-9',
    difficulty: 'intermediario',
    category: 'História',
    text: 'Durante o século dezenove, a invenção da máquina de escrever revolucionou a comunicação e os escritórios.',
  },
  {
    id: 'int-10',
    difficulty: 'intermediario',
    category: 'Psicologia',
    text: 'Quando mantemos a serenidade diante dos imprevistos, as decisões tornam-se mais equilibradas e assertivas.',
  },
  {
    id: 'int-11',
    difficulty: 'intermediario',
    category: 'Música',
    text: 'O ritmo do samba, com seu balanço sincopado, conquista ouvintes em todas as partes do mundo!',
  },
  {
    id: 'int-12',
    difficulty: 'intermediario',
    category: 'Desenvolvimento',
    text: 'Pratique com regularidade: a precisão das palavras sempre deve vir antes da velocidade pura.',
  },
  {
    id: 'int-13',
    difficulty: 'intermediario',
    category: 'Natureza',
    text: 'Nas matas brasileiras, a diversidade de pássaros impressiona tanto pelas cores quanto pela beleza dos cantos.',
  },
  {
    id: 'int-14',
    difficulty: 'intermediario',
    category: 'Reflexão',
    text: 'Será que o tempo passa mais rápido quando estamos felizes, ou nossa percepção é que se altera?',
  },

  // ==================== AVANÇADO (Complexidade estrutural, rica acentuação, citações densas) ====================
  {
    id: 'ava-1',
    difficulty: 'avancado',
    category: 'Literatura Brasileira',
    author: 'Machado de Assis (Dom Casmurro)',
    text: 'Capitu, apesar daqueles olhos que o diabo lhe deu, era uma criatura tão amiga da minha mãe, tão modesta, tão meiga!',
  },
  {
    id: 'ava-2',
    difficulty: 'avancado',
    category: 'Literatura Brasileira',
    author: 'Guimarães Rosa (Grande Sertão: Veredas)',
    text: 'O correr da vida embrulha tudo. A vida é assim: esquenta e esfria, aperta e daí afrouxa, sossega e depois desinquieta.',
  },
  {
    id: 'ava-3',
    difficulty: 'avancado',
    category: 'Poesia Portuguesa',
    author: 'Fernando Pessoa (Livro do Desassossego)',
    text: 'Tenho pensamentos que, se os pudesse traduzir e lhes dar vida viva, iluminariam o mundo com uma nova luz de arrebol.',
  },
  {
    id: 'ava-4',
    difficulty: 'avancado',
    category: 'Ciência e Filosofia',
    author: 'Carl Sagan',
    text: 'Diante da vastidão do cosmos e da imensidão do tempo, é um privilégio compartilhar um planeta e uma era com vocês.',
  },
  {
    id: 'ava-5',
    difficulty: 'avancado',
    category: 'Linguística',
    text: 'A acentuação gráfica da língua portuguesa — abrangendo oxítonas, paroxítonas e proparoxítonas — exige rigor ortográfico constante.',
  },
  {
    id: 'ava-6',
    difficulty: 'avancado',
    category: 'Literatura',
    author: 'Machado de Assis (Memórias Póstumas)',
    text: 'Não tive filhos, não transmiti a nenhuma criatura o legado da nossa miséria: este foi o epitáfio do meu destino.',
  },
  {
    id: 'ava-7',
    difficulty: 'avancado',
    category: 'Tecnologia Avançada',
    text: 'Algoritmos probabilísticos e arquiteturas neuromórficas operam mediante premissas computacionais de extrema sofisticação lógico-matemática.',
  },
  {
    id: 'ava-8',
    difficulty: 'avancado',
    category: 'Astronomia',
    text: 'A espectrometria estelar permitiu aos astrofísicos decifrar a composição química de nebulosas situadas a bilhões de anos-luz de distância.',
  },
  {
    id: 'ava-9',
    difficulty: 'avancado',
    category: 'Filosofia Clássica',
    author: 'Aristóteles',
    text: 'A excelência não é um ato isolado, mas sim um hábito construído através da repetição disciplinada e consciente.',
  },
  {
    id: 'ava-10',
    difficulty: 'avancado',
    category: 'Literatura Lusófona',
    author: 'José Saramago (Ensaio sobre a Cegueira)',
    text: 'Se podes olhar, vê. Se podes ver, repara: a responsabilidade de ter olhos quando os outros os perderam é incomensurável.',
  },
  {
    id: 'ava-11',
    difficulty: 'avancado',
    category: 'Retórica e Gramática',
    text: 'O emprego meticuloso da crase, aliado à pontuação expressiva — travessões, aspas e ponto e vírgula —, enriquece a cadência sintática.',
  },
  {
    id: 'ava-12',
    difficulty: 'avancado',
    category: 'Pensamento Crítico',
    text: 'Investigar hipóteses contraditórias sem julgamento precipitado constitui o alicerce fundamental do verdadeiro método científico moderno.',
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { title: string; desc: string; badge: string; color: string }> = {
  iniciante: {
    title: 'Iniciante',
    desc: 'Frases curtas, palavras do dia a dia e pontuação simplificada',
    badge: 'Fácil',
    color: 'emerald',
  },
  sem_acentos: {
    title: 'Sem Acentos',
    desc: 'Apenas letras minúsculas e espaços: sem acentos, pontuações ou maiúsculas',
    badge: 'Básico',
    color: 'teal',
  },
  intermediario: {
    title: 'Intermediário',
    desc: 'Estruturas moderadas, vírgulas, acentos e pontuação variada',
    badge: 'Médio',
    color: 'sky',
  },
  avancado: {
    title: 'Avançado',
    desc: 'Clássicos literários, vocabulário complexo, crases e pontuação densa',
    badge: 'Desafiador',
    color: 'amber',
  },
  livre: {
    title: 'Modo Livre',
    desc: 'Sem restrições de tempo, escolha qualquer frase ou insira seu próprio texto',
    badge: 'Flexível',
    color: 'violet',
  },
};

export const TIME_LIMITS: { label: string; value: 30 | 60 | 120 | 0; desc: string }[] = [
  { label: '30 seg', value: 30, desc: 'Tiro curto' },
  { label: '60 seg', value: 60, desc: 'Padrão' },
  { label: '120 seg', value: 120, desc: 'Resistência' },
  { label: 'Livre', value: 0, desc: 'Sem limite' },
];

export function getPhrasesByDifficulty(
  difficulty: DifficultyLevel,
  customPhrases: TypingPhrase[] = [],
  forceSimplified: boolean = false
): TypingPhrase[] {
  let list: TypingPhrase[];

  if (difficulty === 'livre') {
    list = [...PHRASES_DATABASE, ...customPhrases];
  } else if (difficulty === 'sem_acentos') {
    // Return dedicated simplified phrases + all other phrases normalized
    list = PHRASES_DATABASE.filter((p) => p.difficulty === 'sem_acentos');
    if (list.length === 0 || forceSimplified) {
      list = PHRASES_DATABASE.map((p) => ({
        ...p,
        text: simplifyText(p.text),
      }));
    }
  } else {
    list = PHRASES_DATABASE.filter((p) => p.difficulty === difficulty);
  }

  if (forceSimplified || difficulty === 'sem_acentos') {
    return list.map((p) => ({
      ...p,
      text: simplifyText(p.text),
    }));
  }

  return list;
}

export function getRandomPhrase(
  difficulty: DifficultyLevel,
  customPhrases: TypingPhrase[] = [],
  excludeId?: string,
  forceSimplified: boolean = false
): TypingPhrase {
  const list = getPhrasesByDifficulty(difficulty, customPhrases, forceSimplified);
  const eligible = list.length > 1 && excludeId ? list.filter((p) => p.id !== excludeId) : list;
  const randomIndex = Math.floor(Math.random() * eligible.length);
  const picked = eligible[randomIndex] || PHRASES_DATABASE[0];

  if (forceSimplified || difficulty === 'sem_acentos') {
    return {
      ...picked,
      text: simplifyText(picked.text),
    };
  }

  return picked;
}
