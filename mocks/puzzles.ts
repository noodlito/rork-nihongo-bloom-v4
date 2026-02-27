export interface PuzzleClue {
  number: number;
  clue: string;
  answer: string;
  japaneseMeaning?: string;
  kana?: string;
  romaji?: string;
}

export interface PuzzleCell {
  row: number;
  col: number;
  letter: string;
  number?: number;
  isBlocked: boolean;
  acrossClue?: number;
  downClue?: number;
}

export interface Puzzle {
  id: string;
  title: string;
  titleJa?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gridSize: number;
  cells: PuzzleCell[];
  acrossClues: PuzzleClue[];
  downClues: PuzzleClue[];
  coinReward: number;
  xpReward: number;
}

export const PUZZLES: Puzzle[] = [
  {
    id: 'beginner-1',
    title: 'First Steps',
    titleJa: 'はじめの一歩',
    difficulty: 'beginner',
    gridSize: 5,
    cells: [
      { row: 0, col: 0, letter: 'C', number: 1, isBlocked: false, acrossClue: 1, downClue: 1 },
      { row: 0, col: 1, letter: 'A', isBlocked: false, acrossClue: 1, downClue: 2 },
      { row: 0, col: 2, letter: 'T', isBlocked: false, acrossClue: 1 },
      { row: 0, col: 3, letter: '', isBlocked: true },
      { row: 0, col: 4, letter: 'D', number: 3, isBlocked: false, downClue: 3 },
      { row: 1, col: 0, letter: 'O', isBlocked: false, downClue: 1 },
      { row: 1, col: 1, letter: 'N', isBlocked: false, downClue: 2 },
      { row: 1, col: 2, letter: '', isBlocked: true },
      { row: 1, col: 3, letter: 'S', number: 4, isBlocked: false, acrossClue: 4 },
      { row: 1, col: 4, letter: 'O', isBlocked: false, acrossClue: 4, downClue: 3 },
      { row: 2, col: 0, letter: 'W', number: 5, isBlocked: false, acrossClue: 5, downClue: 1 },
      { row: 2, col: 1, letter: 'I', isBlocked: false, acrossClue: 5, downClue: 2 },
      { row: 2, col: 2, letter: 'N', isBlocked: false, acrossClue: 5 },
      { row: 2, col: 3, letter: 'D', isBlocked: false, acrossClue: 5 },
      { row: 2, col: 4, letter: 'G', isBlocked: false, downClue: 3 },
      { row: 3, col: 0, letter: '', isBlocked: true },
      { row: 3, col: 1, letter: 'M', number: 6, isBlocked: false, acrossClue: 6, downClue: 2 },
      { row: 3, col: 2, letter: 'O', isBlocked: false, acrossClue: 6 },
      { row: 3, col: 3, letter: 'O', isBlocked: false, acrossClue: 6 },
      { row: 3, col: 4, letter: 'N', isBlocked: false, acrossClue: 6 },
      { row: 4, col: 0, letter: 'R', number: 7, isBlocked: false, acrossClue: 7 },
      { row: 4, col: 1, letter: 'E', isBlocked: false, acrossClue: 7, downClue: 2 },
      { row: 4, col: 2, letter: 'D', isBlocked: false, acrossClue: 7 },
      { row: 4, col: 3, letter: '', isBlocked: true },
      { row: 4, col: 4, letter: '', isBlocked: true },
    ],
    acrossClues: [
      { number: 1, clue: 'A small furry pet', answer: 'CAT', japaneseMeaning: '猫', kana: 'ねこ', romaji: 'neko' },
      { number: 4, clue: 'Not long', answer: 'SO', japaneseMeaning: 'そう', kana: 'そう', romaji: 'sou' },
      { number: 5, clue: 'Moving air', answer: 'WIND', japaneseMeaning: '風', kana: 'かぜ', romaji: 'kaze' },
      { number: 6, clue: 'Night sky light', answer: 'MOON', japaneseMeaning: '月', kana: 'つき', romaji: 'tsuki' },
      { number: 7, clue: 'Color of roses', answer: 'RED', japaneseMeaning: '赤', kana: 'あか', romaji: 'aka' },
    ],
    downClues: [
      { number: 1, clue: 'A bovine animal', answer: 'COW', japaneseMeaning: '牛', kana: 'うし', romaji: 'ushi' },
      { number: 2, clue: 'Japanese animation', answer: 'ANIME', japaneseMeaning: 'アニメ', kana: 'アニメ', romaji: 'anime' },
      { number: 3, clue: 'A pet that fetches', answer: 'DOG', japaneseMeaning: '犬', kana: 'いぬ', romaji: 'inu' },
    ],
    coinReward: 50,
    xpReward: 20,
  },
  {
    id: 'beginner-2',
    title: 'Nature Walk',
    titleJa: '自然散歩',
    difficulty: 'beginner',
    gridSize: 5,
    cells: [
      { row: 0, col: 0, letter: 'S', number: 1, isBlocked: false, acrossClue: 1, downClue: 1 },
      { row: 0, col: 1, letter: 'U', isBlocked: false, acrossClue: 1 },
      { row: 0, col: 2, letter: 'N', isBlocked: false, acrossClue: 1, downClue: 2 },
      { row: 0, col: 3, letter: '', isBlocked: true },
      { row: 0, col: 4, letter: '', isBlocked: true },
      { row: 1, col: 0, letter: 'K', isBlocked: false, downClue: 1 },
      { row: 1, col: 1, letter: '', isBlocked: true },
      { row: 1, col: 2, letter: 'E', isBlocked: false, downClue: 2 },
      { row: 1, col: 3, letter: 'A', number: 3, isBlocked: false, acrossClue: 3 },
      { row: 1, col: 4, letter: 'T', isBlocked: false, acrossClue: 3 },
      { row: 2, col: 0, letter: 'Y', number: 4, isBlocked: false, acrossClue: 4, downClue: 1 },
      { row: 2, col: 1, letter: 'E', isBlocked: false, acrossClue: 4 },
      { row: 2, col: 2, letter: 'W', isBlocked: false, acrossClue: 4, downClue: 2 },
      { row: 2, col: 3, letter: '', isBlocked: true },
      { row: 2, col: 4, letter: '', isBlocked: true },
      { row: 3, col: 0, letter: '', isBlocked: true },
      { row: 3, col: 1, letter: '', isBlocked: true },
      { row: 3, col: 2, letter: '', isBlocked: true },
      { row: 3, col: 3, letter: 'L', number: 5, isBlocked: false, downClue: 5 },
      { row: 3, col: 4, letter: '', isBlocked: true },
      { row: 4, col: 0, letter: 'R', number: 6, isBlocked: false, acrossClue: 6 },
      { row: 4, col: 1, letter: 'A', isBlocked: false, acrossClue: 6 },
      { row: 4, col: 2, letter: 'I', isBlocked: false, acrossClue: 6 },
      { row: 4, col: 3, letter: 'N', isBlocked: false, acrossClue: 6, downClue: 5 },
      { row: 4, col: 4, letter: '', isBlocked: true },
    ],
    acrossClues: [
      { number: 1, clue: 'Our star', answer: 'SUN', japaneseMeaning: '太陽', kana: 'たいよう', romaji: 'taiyou' },
      { number: 3, clue: 'To consume food', answer: 'EAT', japaneseMeaning: '食べる', kana: 'たべる', romaji: 'taberu' },
      { number: 4, clue: 'A type of tree', answer: 'YEW', japaneseMeaning: 'イチイ', kana: 'いちい', romaji: 'ichii' },
      { number: 6, clue: 'Water from clouds', answer: 'RAIN', japaneseMeaning: '雨', kana: 'あめ', romaji: 'ame' },
    ],
    downClues: [
      { number: 1, clue: 'The heavens above', answer: 'SKY', japaneseMeaning: '空', kana: 'そら', romaji: 'sora' },
      { number: 2, clue: 'Fresh or recent', answer: 'NEW', japaneseMeaning: '新しい', kana: 'あたらしい', romaji: 'atarashii' },
      { number: 5, clue: 'Abbreviation for lane', answer: 'LN', japaneseMeaning: '近い', kana: 'ちかい', romaji: 'chikai' },
    ],
    coinReward: 50,
    xpReward: 20,
  },
  {
    id: 'intermediate-1',
    title: 'Sakura Season',
    titleJa: '桜の季節',
    difficulty: 'intermediate',
    gridSize: 5,
    cells: [
      { row: 0, col: 0, letter: 'L', number: 1, isBlocked: false, acrossClue: 1, downClue: 1 },
      { row: 0, col: 1, letter: 'I', isBlocked: false, acrossClue: 1 },
      { row: 0, col: 2, letter: 'G', isBlocked: false, acrossClue: 1, downClue: 2 },
      { row: 0, col: 3, letter: 'H', isBlocked: false, acrossClue: 1 },
      { row: 0, col: 4, letter: 'T', isBlocked: false, acrossClue: 1, downClue: 3 },
      { row: 1, col: 0, letter: 'O', isBlocked: false, downClue: 1 },
      { row: 1, col: 1, letter: '', isBlocked: true },
      { row: 1, col: 2, letter: 'A', isBlocked: false, downClue: 2 },
      { row: 1, col: 3, letter: '', isBlocked: true },
      { row: 1, col: 4, letter: 'O', isBlocked: false, downClue: 3 },
      { row: 2, col: 0, letter: 'V', number: 4, isBlocked: false, acrossClue: 4, downClue: 1 },
      { row: 2, col: 1, letter: 'O', isBlocked: false, acrossClue: 4 },
      { row: 2, col: 2, letter: 'T', isBlocked: false, acrossClue: 4, downClue: 2 },
      { row: 2, col: 3, letter: 'E', isBlocked: false, acrossClue: 4 },
      { row: 2, col: 4, letter: 'W', isBlocked: false, downClue: 3 },
      { row: 3, col: 0, letter: 'E', isBlocked: false, downClue: 1 },
      { row: 3, col: 1, letter: '', isBlocked: true },
      { row: 3, col: 2, letter: 'E', isBlocked: false, downClue: 2 },
      { row: 3, col: 3, letter: '', isBlocked: true },
      { row: 3, col: 4, letter: 'E', isBlocked: false, downClue: 3 },
      { row: 4, col: 0, letter: '', isBlocked: true },
      { row: 4, col: 1, letter: 'N', number: 5, isBlocked: false, acrossClue: 5 },
      { row: 4, col: 2, letter: 'O', isBlocked: false, acrossClue: 5, downClue: 2 },
      { row: 4, col: 3, letter: 'T', isBlocked: false, acrossClue: 5 },
      { row: 4, col: 4, letter: 'R', isBlocked: false, downClue: 3 },
    ],
    acrossClues: [
      { number: 1, clue: 'Neon glow in the city', answer: 'LIGHT', japaneseMeaning: '光', kana: 'ひかり', romaji: 'hikari' },
      { number: 4, clue: 'To choose in an election', answer: 'VOTE', japaneseMeaning: '投票', kana: 'とうひょう', romaji: 'touhyou' },
      { number: 5, clue: 'A musical pitch', answer: 'NOTE', japaneseMeaning: '音', kana: 'おと', romaji: 'oto' },
    ],
    downClues: [
      { number: 1, clue: 'Adore, cherish', answer: 'LOVE', japaneseMeaning: '愛', kana: 'あい', romaji: 'ai' },
      { number: 2, clue: 'Entrance or exit', answer: 'GATEO', japaneseMeaning: '門', kana: 'もん', romaji: 'mon' },
      { number: 3, clue: 'A tall structure', answer: 'TOWER', japaneseMeaning: '塔', kana: 'とう', romaji: 'tou' },
    ],
    coinReward: 100,
    xpReward: 40,
  },
  {
    id: 'advanced-1',
    title: 'Tokyo Nights',
    titleJa: '東京の夜',
    difficulty: 'advanced',
    gridSize: 5,
    cells: [
      { row: 0, col: 0, letter: 'B', number: 1, isBlocked: false, acrossClue: 1, downClue: 1 },
      { row: 0, col: 1, letter: 'R', isBlocked: false, acrossClue: 1, downClue: 2 },
      { row: 0, col: 2, letter: 'A', isBlocked: false, acrossClue: 1, downClue: 3 },
      { row: 0, col: 3, letter: 'V', isBlocked: false, acrossClue: 1 },
      { row: 0, col: 4, letter: 'E', isBlocked: false, acrossClue: 1, downClue: 4 },
      { row: 1, col: 0, letter: 'L', isBlocked: false, downClue: 1 },
      { row: 1, col: 1, letter: 'I', isBlocked: false, downClue: 2 },
      { row: 1, col: 2, letter: 'N', isBlocked: false, downClue: 3 },
      { row: 1, col: 3, letter: '', isBlocked: true },
      { row: 1, col: 4, letter: 'V', isBlocked: false, downClue: 4 },
      { row: 2, col: 0, letter: 'O', number: 5, isBlocked: false, acrossClue: 5, downClue: 1 },
      { row: 2, col: 1, letter: 'V', isBlocked: false, acrossClue: 5, downClue: 2 },
      { row: 2, col: 2, letter: 'E', isBlocked: false, acrossClue: 5, downClue: 3 },
      { row: 2, col: 3, letter: 'N', isBlocked: false, acrossClue: 5 },
      { row: 2, col: 4, letter: 'E', isBlocked: false, downClue: 4 },
      { row: 3, col: 0, letter: 'O', isBlocked: false, downClue: 1 },
      { row: 3, col: 1, letter: 'E', isBlocked: false, downClue: 2 },
      { row: 3, col: 2, letter: '', isBlocked: true },
      { row: 3, col: 3, letter: 'I', number: 6, isBlocked: false, acrossClue: 6 },
      { row: 3, col: 4, letter: 'N', isBlocked: false, acrossClue: 6, downClue: 4 },
      { row: 4, col: 0, letter: 'D', number: 7, isBlocked: false, acrossClue: 7, downClue: 1 },
      { row: 4, col: 1, letter: 'R', isBlocked: false, acrossClue: 7, downClue: 2 },
      { row: 4, col: 2, letter: 'E', isBlocked: false, acrossClue: 7 },
      { row: 4, col: 3, letter: 'A', isBlocked: false, acrossClue: 7 },
      { row: 4, col: 4, letter: 'M', isBlocked: false, acrossClue: 7, downClue: 4 },
    ],
    acrossClues: [
      { number: 1, clue: 'Courageous', answer: 'BRAVE', japaneseMeaning: '勇敢', kana: 'ゆうかん', romaji: 'yuukan' },
      { number: 5, clue: 'A cooking device', answer: 'OVEN', japaneseMeaning: 'オーブン', kana: 'オーブン', romaji: 'oobun' },
      { number: 6, clue: 'Within, inside', answer: 'IN', japaneseMeaning: '中', kana: 'なか', romaji: 'naka' },
      { number: 7, clue: 'A vision while sleeping', answer: 'DREAM', japaneseMeaning: '夢', kana: 'ゆめ', romaji: 'yume' },
    ],
    downClues: [
      { number: 1, clue: 'Vital fluid', answer: 'BLOOD', japaneseMeaning: '血', kana: 'ち', romaji: 'chi' },
      { number: 2, clue: 'A body of flowing water', answer: 'RIVER', japaneseMeaning: '川', kana: 'かわ', romaji: 'kawa' },
      { number: 3, clue: 'A Japanese cartoon', answer: 'ANE', japaneseMeaning: 'アニメ', kana: 'アニメ', romaji: 'anime' },
      { number: 4, clue: 'When night falls', answer: 'EVENM', japaneseMeaning: '夕方', kana: 'ゆうがた', romaji: 'yuugata' },
    ],
    coinReward: 150,
    xpReward: 60,
  },
];

export function getPuzzlesByDifficulty(difficulty: string): Puzzle[] {
  return PUZZLES.filter(p => p.difficulty === difficulty);
}
