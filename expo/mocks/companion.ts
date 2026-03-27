import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Outfit {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  coinCost: number;
  emoji: string;
}

export interface Dialogue {
  id: string;
  trigger: 'greeting' | 'puzzle_complete' | 'fast_solve' | 'many_mistakes' | 'streak_broken' | 'level_up' | 'daily_login' | 'trivia_correct' | 'mini_game';
  text: string;
  mood: 'happy' | 'thinking' | 'surprised' | 'disappointed' | 'excited';
}

export interface BackgroundTheme {
  id: string;
  name: string;
  colors: [string, string];
  coinCost: number;
  levelRequired: number;
}

export const OUTFITS: Outfit[] = [
  { id: 'default', name: 'School Uniform', description: 'Classic sailor uniform', levelRequired: 0, coinCost: 0, emoji: '🎀' },

  { id: 'kimono', name: 'Spring Kimono', description: 'Beautiful floral kimono', levelRequired: 25, coinCost: 250, emoji: '🌸' },
  { id: 'maid', name: 'Cafe Uniform', description: 'Maid cafe work outfit', levelRequired: 40, coinCost: 400, emoji: '☕' },
  { id: 'idol', name: 'Idol Costume', description: 'Sparkling stage outfit', levelRequired: 60, coinCost: 600, emoji: '⭐' },
  { id: 'princess', name: 'Royal Gown', description: 'Elegant princess dress', levelRequired: 80, coinCost: 800, emoji: '👑' },
];

const GREETING_TEXTS: string[] = [
  'Oi, you actually showed up! ...N-not that I was waiting or anything. Let\'s level up your Japanese!',
  'Sugoi! You\'re back~ I unlocked a rare kanji fact for you: "sakura" (桜) blooms for only ONE week. Fleeting, like my patience when you miss questions~',
  'Mou~ I had to wait all day for you! ...Fine, here\'s a power-up: "itadakimasu" (いただきます) is what you say before eating. It\'s basically a buff for gratitude.',
  'Yatta! You came back! "Arigatō" (ありがとう) means thank you. ...D-don\'t make me say it too often though!',
  'Japan has over 6,800 islands. That\'s more side quests than any RPG! Let\'s explore them through kanji~',
  'The shinkansen (新幹線) is basically the IRL equivalent of fast travel. Sugoi, right?',
  '"Sensei" (先生) means teacher... but between us, I\'m more like your party leader. Don\'t fall behind!',
  'Fun fact: slurping ramen loudly is POLITE in Japan. Finally, an anime habit that\'s actually correct!',
  'Kyoto was Japan\'s capital for over 1,000 years. That\'s longer than most anime run... well, except One Piece.',
  'Ganbatte! (頑張って) — That\'s your power phrase! It means "Do your best!" ...And you BETTER.',
  'Fuji-san (富士山) — the "san" means mountain, not that it\'s being polite~ Though it IS majestic enough to deserve it.',
  'Japanese school starts in April when sakura bloom. Peak anime protagonist energy, honestly.',
  '"Kawaii" (かわいい) = cute. You\'ll hear it in literally every anime ever. ...W-why are you looking at me like that?',
  'Bushidō (武士道) = the way of the warrior. Basically the samurai equivalent of a character build guide.',
  'Japan\'s vending machines are insane — hot ramen, cold coffee, you name it. +10 convenience stat.',
  'Sugoi! (すごい) = amazing. That\'s gonna be your reaction when you master these kanji. Trust me~',
  'Origami = "folded paper." Sounds simple but it\'s basically a hidden skill tree. Respect the craft!',
  'Tokyo is the world\'s biggest metro area. It\'s like an open-world map with infinite NPCs.',
  '"Ohayō" (おはよう) = good morning! ...Though I bet you\'re more of a night owl, huh?',
  'Nani?! You didn\'t know "nani" means "what"? That\'s like... the most iconic anime word ever!',
  'The tea ceremony is called "sadō" (茶道). It\'s basically a healing ritual. +HP +calm.',
  '"Nakama" doesn\'t just mean friend — it means bonds forged through struggle. Like us, grinding through kanji together!',
  'Japan\'s national sport is sumo. Those guys have maxed-out stats in strength AND tradition.',
  '"Matsuri" (祭り) = festival. If you\'ve seen any summer anime episode, you know the vibe~',
  'Konbini (convenience stores) in Japan are OP. Onigiri, manga, tickets — they sell everything!',
  'The Great Wave off Kanagawa? Basically the OG anime aesthetic. Hokusai was ahead of his time.',
  '"Yatta!" (やった) = "I did it!" Save this one for when you clear a tough round. You\'ll need it~',
  'The Edo period = 250 years of peace. That\'s like the longest filler arc in history... but actually good.',
  '"Ikigai" (生きがい) = your reason for being. Mine? Making sure you don\'t skip practice. Mou~',
  '"Neko" (猫) = cat. Japan has cat cafés, cat islands, cat shrines... Basically a cat-themed expansion pack.',
  '"Senpai" (先輩) means someone senior to you. And yes, I AM your senpai here. Notice me!',
  '"Baka!" means foolish... I-I\'m not calling YOU that! ...Unless you skip too many days.',
  '"Kawaii" culture runs DEEP in Japan. Even police mascots are cute. It\'s a national passive skill.',
  '"Oishii!" (おいしい) = delicious. The food in anime always looks amazing for a reason — Japanese cuisine is S-tier.',
  '"Genki?" (元気？) = "How are you?" I\'m asking because I care! ...D-don\'t read into it too much.',
  '"Kampai!" (乾杯) = Cheers! Let\'s toast to your kanji progress~ ...Even if it\'s small. Every XP counts!',
  '"Natsukashii" = nostalgic. Like rewatching your first anime. What was yours? ...Just curious!',
  'Ramen has regional varieties across Japan. It\'s basically a whole skill tree of flavors.',
  '"Daisuki" (大好き) means I really like... er, I mean it means "really like" in general! Moving on!',
  'Anime and manga are Japan\'s ultimate cultural exports. And learning Japanese unlocks the RAW experience!',
  '"Ittekimasu" = said when leaving home. "Itterasshai" = the reply. It\'s like a save point for daily life.',
  '"Okaeri" = welcome back. ...Okaeri. There, I said it. Happy now?',
  'Japan values "wa" (和) = harmony. It\'s basically the meta strategy for Japanese society.',
  'Every kanji you learn is like unlocking a rare collectible. Keep grinding, and your collection will be legendary!',
  'I\'m... proud of you for showing up today. Ganbatte! ...Now don\'t let it go to your head!',
  '"Mottainai" = what a waste. Like when someone has talent but doesn\'t practice... *stares at you*',
  '"Chotto matte" = wait a moment. Very useful when your brain needs a sec to process new kanji~',
  'You know "tsundere"? It\'s when someone acts cold but is actually... N-NEVER MIND. Focus on studying!',
  'Pro tip: watching anime with JP subs is literally a hidden training mode. Power through it!',
  'Unlocked fun fact: the kanji for "dream" is 夢 (yume). What\'s YOUR dream? ...Learning Japanese, obviously!',
];

const GREETING_MOODS: Dialogue['mood'][] = ['happy', 'thinking', 'surprised', 'excited'];

function greetingMoodForIndex(index: number): Dialogue['mood'] {
  return GREETING_MOODS[index % GREETING_MOODS.length];
}

export const DIALOGUES: Dialogue[] = [
  ...GREETING_TEXTS.map((text, i) => ({
    id: `g${i + 1}`,
    trigger: 'greeting' as const,
    text,
    mood: greetingMoodForIndex(i),
  })),
  { id: 'd33', trigger: 'puzzle_complete', text: 'Yatta! You cleared it! ...I mean, I expected nothing less.', mood: 'excited' },
  { id: 'd34', trigger: 'puzzle_complete', text: 'Sugoi~! You actually did it! ...N-not that I doubted you!', mood: 'happy' },
  { id: 'd35', trigger: 'fast_solve', text: 'N-NANI?! That speed... Are you secretly a genius?!', mood: 'surprised' },
  { id: 'd36', trigger: 'many_mistakes', text: 'Mou~ That was rough... But every miss is XP for your brain! Power through!', mood: 'thinking' },
  { id: 'd37', trigger: 'streak_broken', text: 'Your streak... it\'s gone... *dramatic anime wind* ...B-but we can rebuild! Ganbatte!', mood: 'disappointed' },
  { id: 'd38', trigger: 'level_up', text: 'LEVEL UP! You unlocked new power! ...I-I\'m not crying, you\'re crying!', mood: 'excited' },
  { id: 'd39', trigger: 'daily_login', text: 'Okaeri~! You came back! Here\'s your daily loot drop!', mood: 'happy' },
  { id: 'd40', trigger: 'trivia_correct', text: 'Sasuga~! That big brain energy though! Keep it up!', mood: 'excited' },
  { id: 'd41', trigger: 'mini_game', text: 'Time for a side quest! Let\'s earn some coins~', mood: 'happy' },
];

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  { id: 'sakura', name: 'Sakura Garden', colors: ['#FFD4E8', '#FFF5F9'], coinCost: 0, levelRequired: 0 },
  { id: 'lavender', name: 'Lavender Fields', colors: ['#E8D5FF', '#F8F0FF'], coinCost: 100, levelRequired: 5 },
  { id: 'ocean', name: 'Ocean Theme', colors: ['#4A90D9', '#6BB3E0'], coinCost: 150, levelRequired: 15 },
  { id: 'sunset', name: 'Sunset Theme', colors: ['#E89060', '#F0A878'], coinCost: 200, levelRequired: 25 },
  { id: 'night', name: 'Neon Theme', colors: ['#E84080', '#FF60A0'], coinCost: 300, levelRequired: 35 },
  { id: 'forest', name: 'Enchanted Forest', colors: ['#D4F5E0', '#F0FFF5'], coinCost: 250, levelRequired: 30 },
];

const GREETING_STORAGE_KEY = 'sakura_greeting_seen_indices';

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let cachedGreetingDialogue: Dialogue | null = null;

export async function loadGreetingDialogue(): Promise<Dialogue> {
  if (cachedGreetingDialogue) return cachedGreetingDialogue;

  const greetings = DIALOGUES.filter(d => d.trigger === 'greeting');
  const total = greetings.length;

  try {
    const stored = await AsyncStorage.getItem(GREETING_STORAGE_KEY);
    let seenIndices: number[] = stored ? JSON.parse(stored) : [];

    const unseen = Array.from({ length: total }, (_, i) => i).filter(i => !seenIndices.includes(i));

    if (unseen.length === 0) {
      seenIndices = [];
      const allIndices = Array.from({ length: total }, (_, i) => i);
      const shuffled = shuffleArray(allIndices);
      const picked = shuffled[0];
      await AsyncStorage.setItem(GREETING_STORAGE_KEY, JSON.stringify([picked]));
      cachedGreetingDialogue = greetings[picked];
      return cachedGreetingDialogue;
    }

    const shuffled = shuffleArray(unseen);
    const picked = shuffled[0];
    seenIndices.push(picked);
    await AsyncStorage.setItem(GREETING_STORAGE_KEY, JSON.stringify(seenIndices));
    cachedGreetingDialogue = greetings[picked];
    return cachedGreetingDialogue;
  } catch (e) {
    console.log('Error loading greeting rotation:', e);
    const fallbackIdx = Math.floor(Math.random() * total);
    cachedGreetingDialogue = greetings[fallbackIdx];
    return cachedGreetingDialogue;
  }
}

export function resetGreetingCache(): void {
  cachedGreetingDialogue = null;
}

export function getDialogue(trigger: Dialogue['trigger']): Dialogue {
  if (trigger === 'greeting' && cachedGreetingDialogue) {
    return cachedGreetingDialogue;
  }
  const options = DIALOGUES.filter(d => d.trigger === trigger);
  return options[Math.floor(Math.random() * options.length)] || DIALOGUES[0];
}

export function getMoodEmoji(mood: Dialogue['mood']): string {
  const moods: Record<string, string> = {
    happy: '😊',
    thinking: '🤔',
    surprised: '😲',
    disappointed: '😢',
    excited: '🥰',
  };
  return moods[mood] || '😊';
}

export function getXpLevel(xp: number): { level: number; progress: number; xpForNext: number } {
  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel);
  const progress = (xp % xpPerLevel) / xpPerLevel;
  return { level, progress, xpForNext: xpPerLevel - (xp % xpPerLevel) };
}
