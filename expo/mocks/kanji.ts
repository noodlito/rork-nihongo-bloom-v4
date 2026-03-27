export interface KanjiWord {
  id: string;
  english: string;
  kanji: string;
  kana: string;
  romaji: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface KanjiOption {
  kanji: string;
  meaning: string;
  isCorrect: boolean;
}

export const KANJI_WORDS: KanjiWord[] = [
  { id: 'k1', english: 'Mountain', kanji: '山', kana: 'やま', romaji: 'yama', difficulty: 'beginner', category: 'nature' },
  { id: 'k2', english: 'River', kanji: '川', kana: 'かわ', romaji: 'kawa', difficulty: 'beginner', category: 'nature' },
  { id: 'k3', english: 'Fire', kanji: '火', kana: 'ひ', romaji: 'hi', difficulty: 'beginner', category: 'nature' },
  { id: 'k4', english: 'Water', kanji: '水', kana: 'みず', romaji: 'mizu', difficulty: 'beginner', category: 'nature' },
  { id: 'k5', english: 'Tree', kanji: '木', kana: 'き', romaji: 'ki', difficulty: 'beginner', category: 'nature' },
  { id: 'k6', english: 'Moon', kanji: '月', kana: 'つき', romaji: 'tsuki', difficulty: 'beginner', category: 'nature' },
  { id: 'k7', english: 'Sun', kanji: '日', kana: 'ひ', romaji: 'hi', difficulty: 'beginner', category: 'nature' },
  { id: 'k8', english: 'Earth', kanji: '土', kana: 'つち', romaji: 'tsuchi', difficulty: 'beginner', category: 'nature' },
  { id: 'k9', english: 'Rain', kanji: '雨', kana: 'あめ', romaji: 'ame', difficulty: 'beginner', category: 'nature' },
  { id: 'k10', english: 'Flower', kanji: '花', kana: 'はな', romaji: 'hana', difficulty: 'beginner', category: 'nature' },
  { id: 'k11', english: 'Love', kanji: '愛', kana: 'あい', romaji: 'ai', difficulty: 'intermediate', category: 'emotion' },
  { id: 'k12', english: 'Dream', kanji: '夢', kana: 'ゆめ', romaji: 'yume', difficulty: 'intermediate', category: 'emotion' },
  { id: 'k13', english: 'Heart', kanji: '心', kana: 'こころ', romaji: 'kokoro', difficulty: 'intermediate', category: 'body' },
  { id: 'k14', english: 'Sky', kanji: '空', kana: 'そら', romaji: 'sora', difficulty: 'intermediate', category: 'nature' },
  { id: 'k15', english: 'Star', kanji: '星', kana: 'ほし', romaji: 'hoshi', difficulty: 'intermediate', category: 'nature' },
  { id: 'k16', english: 'Wind', kanji: '風', kana: 'かぜ', romaji: 'kaze', difficulty: 'intermediate', category: 'nature' },
  { id: 'k17', english: 'Snow', kanji: '雪', kana: 'ゆき', romaji: 'yuki', difficulty: 'intermediate', category: 'nature' },
  { id: 'k18', english: 'Light', kanji: '光', kana: 'ひかり', romaji: 'hikari', difficulty: 'intermediate', category: 'nature' },
  { id: 'k19', english: 'Sound', kanji: '音', kana: 'おと', romaji: 'oto', difficulty: 'intermediate', category: 'sense' },
  { id: 'k20', english: 'Color', kanji: '色', kana: 'いろ', romaji: 'iro', difficulty: 'intermediate', category: 'sense' },
  { id: 'k21', english: 'Courage', kanji: '勇', kana: 'ゆう', romaji: 'yuu', difficulty: 'advanced', category: 'emotion' },
  { id: 'k22', english: 'Wisdom', kanji: '智', kana: 'ち', romaji: 'chi', difficulty: 'advanced', category: 'virtue' },
  { id: 'k23', english: 'Eternity', kanji: '永', kana: 'えい', romaji: 'ei', difficulty: 'advanced', category: 'concept' },
  { id: 'k24', english: 'Harmony', kanji: '和', kana: 'わ', romaji: 'wa', difficulty: 'advanced', category: 'concept' },
  { id: 'k25', english: 'Strength', kanji: '力', kana: 'ちから', romaji: 'chikara', difficulty: 'advanced', category: 'concept' },
  { id: 'k26', english: 'Truth', kanji: '真', kana: 'しん', romaji: 'shin', difficulty: 'advanced', category: 'concept' },
  { id: 'k27', english: 'Beauty', kanji: '美', kana: 'び', romaji: 'bi', difficulty: 'advanced', category: 'concept' },
  { id: 'k28', english: 'Dragon', kanji: '竜', kana: 'りゅう', romaji: 'ryuu', difficulty: 'advanced', category: 'creature' },
  { id: 'k29', english: 'Spirit', kanji: '魂', kana: 'たましい', romaji: 'tamashii', difficulty: 'advanced', category: 'concept' },
  { id: 'k30', english: 'Shadow', kanji: '影', kana: 'かげ', romaji: 'kage', difficulty: 'advanced', category: 'nature' },
];

const DISTRACTOR_KANJI: { kanji: string; meaning: string }[] = [
  { kanji: '犬', meaning: 'Dog' },
  { kanji: '猫', meaning: 'Cat' },
  { kanji: '人', meaning: 'Person' },
  { kanji: '大', meaning: 'Big' },
  { kanji: '小', meaning: 'Small' },
  { kanji: '上', meaning: 'Up' },
  { kanji: '下', meaning: 'Down' },
  { kanji: '左', meaning: 'Left' },
  { kanji: '右', meaning: 'Right' },
  { kanji: '中', meaning: 'Middle' },
  { kanji: '口', meaning: 'Mouth' },
  { kanji: '目', meaning: 'Eye' },
  { kanji: '手', meaning: 'Hand' },
  { kanji: '足', meaning: 'Foot' },
  { kanji: '車', meaning: 'Car' },
  { kanji: '門', meaning: 'Gate' },
  { kanji: '金', meaning: 'Gold' },
  { kanji: '石', meaning: 'Stone' },
  { kanji: '田', meaning: 'Rice Field' },
  { kanji: '白', meaning: 'White' },
  { kanji: '黒', meaning: 'Black' },
  { kanji: '赤', meaning: 'Red' },
  { kanji: '青', meaning: 'Blue' },
  { kanji: '年', meaning: 'Year' },
  { kanji: '生', meaning: 'Life' },
  { kanji: '学', meaning: 'Study' },
  { kanji: '食', meaning: 'Eat' },
  { kanji: '飲', meaning: 'Drink' },
  { kanji: '見', meaning: 'See' },
  { kanji: '聞', meaning: 'Listen' },
];

export function getKanjiChallenge(
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  excludeIds: string[] = []
): { word: KanjiWord; options: KanjiOption[] } | null {
  const pool = KANJI_WORDS.filter(w => w.difficulty === difficulty && !excludeIds.includes(w.id));
  if (pool.length === 0) {
    const fallback = KANJI_WORDS.filter(w => !excludeIds.includes(w.id));
    if (fallback.length === 0) return null;
    const word = fallback[Math.floor(Math.random() * fallback.length)];
    return { word, options: buildOptions(word) };
  }
  const word = pool[Math.floor(Math.random() * pool.length)];
  return { word, options: buildOptions(word) };
}

function buildOptions(word: KanjiWord): KanjiOption[] {
  const correct: KanjiOption = { kanji: word.kanji, meaning: word.english, isCorrect: true };
  const distractorPool = DISTRACTOR_KANJI.filter(d => d.kanji !== word.kanji);
  const otherKanji = KANJI_WORDS.filter(k => k.kanji !== word.kanji);

  const allDistractors = [
    ...otherKanji.map(k => ({ kanji: k.kanji, meaning: k.english })),
    ...distractorPool,
  ];

  const shuffled = allDistractors.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5).map(d => ({
    kanji: d.kanji,
    meaning: d.meaning,
    isCorrect: false,
  }));

  const options = [correct, ...selected].sort(() => Math.random() - 0.5);
  return options;
}

export function getKanjiReverseChallenge(
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  excludeIds: string[] = []
): { word: KanjiWord; options: { text: string; isCorrect: boolean }[] } | null {
  const pool = KANJI_WORDS.filter(w => w.difficulty === difficulty && !excludeIds.includes(w.id));
  if (pool.length === 0) return null;
  const word = pool[Math.floor(Math.random() * pool.length)];

  const otherWords = KANJI_WORDS.filter(k => k.id !== word.id);
  const shuffledOthers = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);

  const options = [
    { text: word.english, isCorrect: true },
    ...shuffledOthers.map(o => ({ text: o.english, isCorrect: false })),
  ].sort(() => Math.random() - 0.5);

  return { word, options };
}
