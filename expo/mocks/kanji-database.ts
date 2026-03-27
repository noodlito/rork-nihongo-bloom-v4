export type KanjiGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type KanjiDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type TopicTag =
  | 'personal_information'
  | 'daily_life'
  | 'home_environment'
  | 'food_drink'
  | 'community'
  | 'health_body'
  | 'interests_hobbies'
  | 'academic'
  | 'communication';

export const TOPIC_LABELS: Record<TopicTag, { en: string; jp: string }> = {
  personal_information: { en: 'Personal Info', jp: '個人情報' },
  daily_life: { en: 'Daily Life', jp: '日常生活' },
  home_environment: { en: 'Home & Environment', jp: '家と環境' },
  food_drink: { en: 'Food & Drink', jp: '食べ物と飲み物' },
  community: { en: 'Community', jp: '地域社会' },
  health_body: { en: 'Health & Body', jp: '健康と体' },
  interests_hobbies: { en: 'Interests & Hobbies', jp: '趣味' },
  academic: { en: 'Academic', jp: '学術' },
  communication: { en: 'Communication', jp: 'コミュニケーション' },
};

export interface MasterKanji {
  kanji: string;
  meaningEn: string;
  meaningJp: string;
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
  grade: KanjiGrade;
  jlpt: JLPTLevel;
}

export interface VocabEntry {
  id: string;
  word: string;
  reading: string;
  meaningEn: string;
  meaningJp: string;
  topic: TopicTag;
  difficulty: KanjiDifficulty;
  jlpt: JLPTLevel;
  componentKanji: string[];
}

export const MASTER_KANJI: MasterKanji[] = [
  { kanji: '一', meaningEn: 'One', meaningJp: 'ひとつ', onyomi: ['イチ'], kunyomi: ['ひと'], strokeCount: 1, grade: 1, jlpt: 'N5' },
  { kanji: '二', meaningEn: 'Two', meaningJp: 'ふたつ', onyomi: ['ニ'], kunyomi: ['ふた'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '三', meaningEn: 'Three', meaningJp: 'みっつ', onyomi: ['サン'], kunyomi: ['み'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '四', meaningEn: 'Four', meaningJp: 'よっつ', onyomi: ['シ'], kunyomi: ['よ', 'よん'], strokeCount: 5, grade: 1, jlpt: 'N5' },
  { kanji: '五', meaningEn: 'Five', meaningJp: 'いつつ', onyomi: ['ゴ'], kunyomi: ['いつ'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '六', meaningEn: 'Six', meaningJp: 'むっつ', onyomi: ['ロク'], kunyomi: ['む'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '七', meaningEn: 'Seven', meaningJp: 'ななつ', onyomi: ['シチ'], kunyomi: ['なな'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '八', meaningEn: 'Eight', meaningJp: 'やっつ', onyomi: ['ハチ'], kunyomi: ['や'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '九', meaningEn: 'Nine', meaningJp: 'ここのつ', onyomi: ['キュウ', 'ク'], kunyomi: ['ここの'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '十', meaningEn: 'Ten', meaningJp: 'とお', onyomi: ['ジュウ'], kunyomi: ['と'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '百', meaningEn: 'Hundred', meaningJp: 'ひゃく', onyomi: ['ヒャク'], kunyomi: [], strokeCount: 6, grade: 1, jlpt: 'N5' },
  { kanji: '千', meaningEn: 'Thousand', meaningJp: 'せん', onyomi: ['セン'], kunyomi: ['ち'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '万', meaningEn: 'Ten thousand', meaningJp: 'まん', onyomi: ['マン', 'バン'], kunyomi: [], strokeCount: 3, grade: 2, jlpt: 'N5' },
  { kanji: '日', meaningEn: 'Day / Sun', meaningJp: '日・太陽', onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '月', meaningEn: 'Month / Moon', meaningJp: '月・つき', onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '火', meaningEn: 'Fire', meaningJp: '火', onyomi: ['カ'], kunyomi: ['ひ'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '水', meaningEn: 'Water', meaningJp: '水', onyomi: ['スイ'], kunyomi: ['みず'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '木', meaningEn: 'Tree / Wood', meaningJp: '木', onyomi: ['モク', 'ボク'], kunyomi: ['き', 'こ'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '金', meaningEn: 'Gold / Money', meaningJp: '金・お金', onyomi: ['キン', 'コン'], kunyomi: ['かね', 'かな'], strokeCount: 8, grade: 1, jlpt: 'N5' },
  { kanji: '土', meaningEn: 'Earth / Soil', meaningJp: '土', onyomi: ['ド', 'ト'], kunyomi: ['つち'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '人', meaningEn: 'Person', meaningJp: '人', onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '大', meaningEn: 'Big / Large', meaningJp: '大きい', onyomi: ['ダイ', 'タイ'], kunyomi: ['おお'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '小', meaningEn: 'Small / Little', meaningJp: '小さい', onyomi: ['ショウ'], kunyomi: ['ちい', 'こ', 'お'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '中', meaningEn: 'Middle / Inside', meaningJp: '中', onyomi: ['チュウ'], kunyomi: ['なか'], strokeCount: 4, grade: 1, jlpt: 'N5' },
  { kanji: '上', meaningEn: 'Up / Above', meaningJp: '上', onyomi: ['ジョウ'], kunyomi: ['うえ', 'あ', 'のぼ'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '下', meaningEn: 'Down / Below', meaningJp: '下', onyomi: ['カ', 'ゲ'], kunyomi: ['した', 'さ', 'くだ', 'お'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '左', meaningEn: 'Left', meaningJp: '左', onyomi: ['サ'], kunyomi: ['ひだり'], strokeCount: 5, grade: 1, jlpt: 'N5' },
  { kanji: '右', meaningEn: 'Right', meaningJp: '右', onyomi: ['ウ', 'ユウ'], kunyomi: ['みぎ'], strokeCount: 5, grade: 1, jlpt: 'N5' },
  { kanji: '山', meaningEn: 'Mountain', meaningJp: '山', onyomi: ['サン'], kunyomi: ['やま'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '川', meaningEn: 'River', meaningJp: '川', onyomi: ['セン'], kunyomi: ['かわ'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '田', meaningEn: 'Rice field', meaningJp: '田んぼ', onyomi: ['デン'], kunyomi: ['た'], strokeCount: 5, grade: 1, jlpt: 'N4' },
  { kanji: '口', meaningEn: 'Mouth', meaningJp: '口', onyomi: ['コウ', 'ク'], kunyomi: ['くち'], strokeCount: 3, grade: 1, jlpt: 'N4' },
  { kanji: '目', meaningEn: 'Eye', meaningJp: '目', onyomi: ['モク'], kunyomi: ['め'], strokeCount: 5, grade: 1, jlpt: 'N4' },
  { kanji: '耳', meaningEn: 'Ear', meaningJp: '耳', onyomi: ['ジ'], kunyomi: ['みみ'], strokeCount: 6, grade: 1, jlpt: 'N4' },
  { kanji: '手', meaningEn: 'Hand', meaningJp: '手', onyomi: ['シュ'], kunyomi: ['て'], strokeCount: 4, grade: 1, jlpt: 'N4' },
  { kanji: '足', meaningEn: 'Foot / Leg', meaningJp: '足', onyomi: ['ソク'], kunyomi: ['あし', 'た'], strokeCount: 7, grade: 1, jlpt: 'N4' },
  { kanji: '力', meaningEn: 'Power / Strength', meaningJp: '力', onyomi: ['リョク', 'リキ'], kunyomi: ['ちから'], strokeCount: 2, grade: 1, jlpt: 'N4' },
  { kanji: '男', meaningEn: 'Man / Male', meaningJp: '男', onyomi: ['ダン', 'ナン'], kunyomi: ['おとこ'], strokeCount: 7, grade: 1, jlpt: 'N5' },
  { kanji: '女', meaningEn: 'Woman / Female', meaningJp: '女', onyomi: ['ジョ', 'ニョ'], kunyomi: ['おんな'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '子', meaningEn: 'Child', meaningJp: '子供', onyomi: ['シ', 'ス'], kunyomi: ['こ'], strokeCount: 3, grade: 1, jlpt: 'N5' },
  { kanji: '犬', meaningEn: 'Dog', meaningJp: '犬', onyomi: ['ケン'], kunyomi: ['いぬ'], strokeCount: 4, grade: 1, jlpt: 'N4' },
  { kanji: '虫', meaningEn: 'Insect', meaningJp: '虫', onyomi: ['チュウ'], kunyomi: ['むし'], strokeCount: 6, grade: 1, jlpt: 'N3' },
  { kanji: '花', meaningEn: 'Flower', meaningJp: '花', onyomi: ['カ'], kunyomi: ['はな'], strokeCount: 7, grade: 1, jlpt: 'N4' },
  { kanji: '草', meaningEn: 'Grass', meaningJp: '草', onyomi: ['ソウ'], kunyomi: ['くさ'], strokeCount: 9, grade: 1, jlpt: 'N3' },
  { kanji: '竹', meaningEn: 'Bamboo', meaningJp: '竹', onyomi: ['チク'], kunyomi: ['たけ'], strokeCount: 6, grade: 1, jlpt: 'N3' },
  { kanji: '石', meaningEn: 'Stone', meaningJp: '石', onyomi: ['セキ', 'シャク'], kunyomi: ['いし'], strokeCount: 5, grade: 1, jlpt: 'N3' },
  { kanji: '空', meaningEn: 'Sky / Empty', meaningJp: '空', onyomi: ['クウ'], kunyomi: ['そら', 'あ', 'から'], strokeCount: 8, grade: 1, jlpt: 'N4' },
  { kanji: '雨', meaningEn: 'Rain', meaningJp: '雨', onyomi: ['ウ'], kunyomi: ['あめ', 'あま'], strokeCount: 8, grade: 1, jlpt: 'N5' },
  { kanji: '天', meaningEn: 'Heaven / Sky', meaningJp: '天', onyomi: ['テン'], kunyomi: ['あめ', 'あま'], strokeCount: 4, grade: 1, jlpt: 'N4' },
  { kanji: '気', meaningEn: 'Spirit / Air', meaningJp: '気', onyomi: ['キ', 'ケ'], kunyomi: [], strokeCount: 6, grade: 1, jlpt: 'N5' },
  { kanji: '年', meaningEn: 'Year', meaningJp: '年', onyomi: ['ネン'], kunyomi: ['とし'], strokeCount: 6, grade: 1, jlpt: 'N5' },
  { kanji: '学', meaningEn: 'Study / Learning', meaningJp: '学ぶ', onyomi: ['ガク'], kunyomi: ['まな'], strokeCount: 8, grade: 1, jlpt: 'N5' },
  { kanji: '校', meaningEn: 'School', meaningJp: '学校', onyomi: ['コウ'], kunyomi: [], strokeCount: 10, grade: 1, jlpt: 'N5' },
  { kanji: '先', meaningEn: 'Previous / Ahead', meaningJp: '先', onyomi: ['セン'], kunyomi: ['さき'], strokeCount: 6, grade: 1, jlpt: 'N5' },
  { kanji: '生', meaningEn: 'Life / Birth', meaningJp: '生きる', onyomi: ['セイ', 'ショウ'], kunyomi: ['い', 'う', 'は', 'なま'], strokeCount: 5, grade: 1, jlpt: 'N5' },
  { kanji: '王', meaningEn: 'King', meaningJp: '王', onyomi: ['オウ'], kunyomi: [], strokeCount: 4, grade: 1, jlpt: 'N3' },
  { kanji: '玉', meaningEn: 'Jewel / Ball', meaningJp: '玉', onyomi: ['ギョク'], kunyomi: ['たま'], strokeCount: 5, grade: 1, jlpt: 'N3' },
  { kanji: '白', meaningEn: 'White', meaningJp: '白い', onyomi: ['ハク', 'ビャク'], kunyomi: ['しろ', 'しら'], strokeCount: 5, grade: 1, jlpt: 'N5' },
  { kanji: '赤', meaningEn: 'Red', meaningJp: '赤い', onyomi: ['セキ', 'シャク'], kunyomi: ['あか'], strokeCount: 7, grade: 1, jlpt: 'N4' },
  { kanji: '青', meaningEn: 'Blue / Green', meaningJp: '青い', onyomi: ['セイ', 'ショウ'], kunyomi: ['あお'], strokeCount: 8, grade: 1, jlpt: 'N4' },
  { kanji: '名', meaningEn: 'Name', meaningJp: '名前', onyomi: ['メイ', 'ミョウ'], kunyomi: ['な'], strokeCount: 6, grade: 1, jlpt: 'N5' },
  { kanji: '正', meaningEn: 'Correct / Right', meaningJp: '正しい', onyomi: ['セイ', 'ショウ'], kunyomi: ['ただ', 'まさ'], strokeCount: 5, grade: 1, jlpt: 'N4' },
  { kanji: '出', meaningEn: 'Exit / Leave', meaningJp: '出る', onyomi: ['シュツ'], kunyomi: ['で', 'だ'], strokeCount: 5, grade: 1, jlpt: 'N5' },
  { kanji: '入', meaningEn: 'Enter', meaningJp: '入る', onyomi: ['ニュウ'], kunyomi: ['い', 'はい'], strokeCount: 2, grade: 1, jlpt: 'N5' },
  { kanji: '立', meaningEn: 'Stand', meaningJp: '立つ', onyomi: ['リツ', 'リュウ'], kunyomi: ['た'], strokeCount: 5, grade: 1, jlpt: 'N4' },
  { kanji: '休', meaningEn: 'Rest', meaningJp: '休む', onyomi: ['キュウ'], kunyomi: ['やす'], strokeCount: 6, grade: 1, jlpt: 'N5' },
  { kanji: '見', meaningEn: 'See / Look', meaningJp: '見る', onyomi: ['ケン'], kunyomi: ['み'], strokeCount: 7, grade: 1, jlpt: 'N5' },
  { kanji: '食', meaningEn: 'Eat / Food', meaningJp: '食べる', onyomi: ['ショク', 'ジキ'], kunyomi: ['た', 'く'], strokeCount: 9, grade: 2, jlpt: 'N5' },
  { kanji: '飲', meaningEn: 'Drink', meaningJp: '飲む', onyomi: ['イン'], kunyomi: ['の'], strokeCount: 12, grade: 3, jlpt: 'N5' },
  { kanji: '読', meaningEn: 'Read', meaningJp: '読む', onyomi: ['ドク', 'トク'], kunyomi: ['よ'], strokeCount: 14, grade: 2, jlpt: 'N5' },
  { kanji: '書', meaningEn: 'Write', meaningJp: '書く', onyomi: ['ショ'], kunyomi: ['か'], strokeCount: 10, grade: 2, jlpt: 'N5' },
  { kanji: '話', meaningEn: 'Talk / Story', meaningJp: '話す', onyomi: ['ワ'], kunyomi: ['はな', 'はなし'], strokeCount: 13, grade: 2, jlpt: 'N5' },
  { kanji: '聞', meaningEn: 'Listen / Hear', meaningJp: '聞く', onyomi: ['ブン', 'モン'], kunyomi: ['き'], strokeCount: 14, grade: 2, jlpt: 'N5' },
  { kanji: '言', meaningEn: 'Say / Word', meaningJp: '言う', onyomi: ['ゲン', 'ゴン'], kunyomi: ['い', 'こと'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '語', meaningEn: 'Language / Word', meaningJp: '語る', onyomi: ['ゴ'], kunyomi: ['かた'], strokeCount: 14, grade: 2, jlpt: 'N5' },
  { kanji: '行', meaningEn: 'Go / Conduct', meaningJp: '行く', onyomi: ['コウ', 'ギョウ'], kunyomi: ['い', 'ゆ', 'おこな'], strokeCount: 6, grade: 2, jlpt: 'N5' },
  { kanji: '来', meaningEn: 'Come', meaningJp: '来る', onyomi: ['ライ'], kunyomi: ['く', 'き', 'こ'], strokeCount: 7, grade: 2, jlpt: 'N5' },
  { kanji: '帰', meaningEn: 'Return home', meaningJp: '帰る', onyomi: ['キ'], kunyomi: ['かえ'], strokeCount: 10, grade: 2, jlpt: 'N5' },
  { kanji: '買', meaningEn: 'Buy', meaningJp: '買う', onyomi: ['バイ'], kunyomi: ['か'], strokeCount: 12, grade: 2, jlpt: 'N5' },
  { kanji: '売', meaningEn: 'Sell', meaningJp: '売る', onyomi: ['バイ'], kunyomi: ['う'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '東', meaningEn: 'East', meaningJp: '東', onyomi: ['トウ'], kunyomi: ['ひがし'], strokeCount: 8, grade: 2, jlpt: 'N5' },
  { kanji: '西', meaningEn: 'West', meaningJp: '西', onyomi: ['セイ', 'サイ'], kunyomi: ['にし'], strokeCount: 6, grade: 2, jlpt: 'N5' },
  { kanji: '南', meaningEn: 'South', meaningJp: '南', onyomi: ['ナン'], kunyomi: ['みなみ'], strokeCount: 9, grade: 2, jlpt: 'N5' },
  { kanji: '北', meaningEn: 'North', meaningJp: '北', onyomi: ['ホク'], kunyomi: ['きた'], strokeCount: 5, grade: 2, jlpt: 'N5' },
  { kanji: '時', meaningEn: 'Time / Hour', meaningJp: '時間', onyomi: ['ジ'], kunyomi: ['とき'], strokeCount: 10, grade: 2, jlpt: 'N5' },
  { kanji: '間', meaningEn: 'Interval / Space', meaningJp: '間', onyomi: ['カン', 'ケン'], kunyomi: ['あいだ', 'ま'], strokeCount: 12, grade: 2, jlpt: 'N5' },
  { kanji: '分', meaningEn: 'Minute / Part', meaningJp: '分ける', onyomi: ['ブン', 'フン'], kunyomi: ['わ'], strokeCount: 4, grade: 2, jlpt: 'N5' },
  { kanji: '前', meaningEn: 'Before / Front', meaningJp: '前', onyomi: ['ゼン'], kunyomi: ['まえ'], strokeCount: 9, grade: 2, jlpt: 'N5' },
  { kanji: '後', meaningEn: 'After / Behind', meaningJp: '後ろ', onyomi: ['ゴ', 'コウ'], kunyomi: ['あと', 'うし', 'のち'], strokeCount: 9, grade: 2, jlpt: 'N5' },
  { kanji: '午', meaningEn: 'Noon', meaningJp: '午後', onyomi: ['ゴ'], kunyomi: [], strokeCount: 4, grade: 2, jlpt: 'N5' },
  { kanji: '朝', meaningEn: 'Morning', meaningJp: '朝', onyomi: ['チョウ'], kunyomi: ['あさ'], strokeCount: 12, grade: 2, jlpt: 'N4' },
  { kanji: '昼', meaningEn: 'Daytime / Noon', meaningJp: '昼', onyomi: ['チュウ'], kunyomi: ['ひる'], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '夜', meaningEn: 'Night', meaningJp: '夜', onyomi: ['ヤ'], kunyomi: ['よ', 'よる'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '週', meaningEn: 'Week', meaningJp: '週', onyomi: ['シュウ'], kunyomi: [], strokeCount: 11, grade: 2, jlpt: 'N5' },
  { kanji: '今', meaningEn: 'Now', meaningJp: '今', onyomi: ['コン', 'キン'], kunyomi: ['いま'], strokeCount: 4, grade: 2, jlpt: 'N5' },
  { kanji: '何', meaningEn: 'What', meaningJp: '何', onyomi: ['カ'], kunyomi: ['なに', 'なん'], strokeCount: 7, grade: 2, jlpt: 'N5' },
  { kanji: '家', meaningEn: 'House / Home', meaningJp: '家', onyomi: ['カ', 'ケ'], kunyomi: ['いえ', 'や'], strokeCount: 10, grade: 2, jlpt: 'N4' },
  { kanji: '室', meaningEn: 'Room', meaningJp: '部屋', onyomi: ['シツ'], kunyomi: ['むろ'], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '店', meaningEn: 'Shop / Store', meaningJp: '店', onyomi: ['テン'], kunyomi: ['みせ'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '駅', meaningEn: 'Station', meaningJp: '駅', onyomi: ['エキ'], kunyomi: [], strokeCount: 14, grade: 3, jlpt: 'N4' },
  { kanji: '道', meaningEn: 'Road / Way', meaningJp: '道', onyomi: ['ドウ'], kunyomi: ['みち'], strokeCount: 12, grade: 2, jlpt: 'N4' },
  { kanji: '車', meaningEn: 'Car / Vehicle', meaningJp: '車', onyomi: ['シャ'], kunyomi: ['くるま'], strokeCount: 7, grade: 1, jlpt: 'N5' },
  { kanji: '電', meaningEn: 'Electricity', meaningJp: '電気', onyomi: ['デン'], kunyomi: [], strokeCount: 13, grade: 2, jlpt: 'N5' },
  { kanji: '魚', meaningEn: 'Fish', meaningJp: '魚', onyomi: ['ギョ'], kunyomi: ['うお', 'さかな'], strokeCount: 11, grade: 2, jlpt: 'N4' },
  { kanji: '肉', meaningEn: 'Meat', meaningJp: '肉', onyomi: ['ニク'], kunyomi: [], strokeCount: 6, grade: 2, jlpt: 'N4' },
  { kanji: '茶', meaningEn: 'Tea', meaningJp: 'お茶', onyomi: ['チャ', 'サ'], kunyomi: [], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '米', meaningEn: 'Rice', meaningJp: '米', onyomi: ['ベイ', 'マイ'], kunyomi: ['こめ'], strokeCount: 6, grade: 2, jlpt: 'N3' },
  { kanji: '多', meaningEn: 'Many / Much', meaningJp: '多い', onyomi: ['タ'], kunyomi: ['おお'], strokeCount: 6, grade: 2, jlpt: 'N4' },
  { kanji: '少', meaningEn: 'Few / Little', meaningJp: '少ない', onyomi: ['ショウ'], kunyomi: ['すく', 'すこ'], strokeCount: 4, grade: 2, jlpt: 'N4' },
  { kanji: '新', meaningEn: 'New', meaningJp: '新しい', onyomi: ['シン'], kunyomi: ['あたら', 'あら', 'にい'], strokeCount: 13, grade: 2, jlpt: 'N4' },
  { kanji: '古', meaningEn: 'Old', meaningJp: '古い', onyomi: ['コ'], kunyomi: ['ふる'], strokeCount: 5, grade: 2, jlpt: 'N4' },
  { kanji: '長', meaningEn: 'Long / Chief', meaningJp: '長い', onyomi: ['チョウ'], kunyomi: ['なが'], strokeCount: 8, grade: 2, jlpt: 'N5' },
  { kanji: '高', meaningEn: 'High / Expensive', meaningJp: '高い', onyomi: ['コウ'], kunyomi: ['たか'], strokeCount: 10, grade: 2, jlpt: 'N5' },
  { kanji: '安', meaningEn: 'Cheap / Safe', meaningJp: '安い', onyomi: ['アン'], kunyomi: ['やす'], strokeCount: 6, grade: 3, jlpt: 'N5' },
  { kanji: '近', meaningEn: 'Near / Close', meaningJp: '近い', onyomi: ['キン'], kunyomi: ['ちか'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '遠', meaningEn: 'Far / Distant', meaningJp: '遠い', onyomi: ['エン', 'オン'], kunyomi: ['とお'], strokeCount: 13, grade: 2, jlpt: 'N4' },
  { kanji: '明', meaningEn: 'Bright / Clear', meaningJp: '明るい', onyomi: ['メイ', 'ミョウ'], kunyomi: ['あか', 'あき'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '暗', meaningEn: 'Dark', meaningJp: '暗い', onyomi: ['アン'], kunyomi: ['くら'], strokeCount: 13, grade: 3, jlpt: 'N3' },
  { kanji: '黒', meaningEn: 'Black', meaningJp: '黒い', onyomi: ['コク'], kunyomi: ['くろ'], strokeCount: 11, grade: 2, jlpt: 'N4' },
  { kanji: '色', meaningEn: 'Color', meaningJp: '色', onyomi: ['ショク', 'シキ'], kunyomi: ['いろ'], strokeCount: 6, grade: 2, jlpt: 'N4' },
  { kanji: '国', meaningEn: 'Country', meaningJp: '国', onyomi: ['コク'], kunyomi: ['くに'], strokeCount: 8, grade: 2, jlpt: 'N5' },
  { kanji: '外', meaningEn: 'Outside', meaningJp: '外', onyomi: ['ガイ', 'ゲ'], kunyomi: ['そと', 'ほか', 'はず'], strokeCount: 5, grade: 2, jlpt: 'N5' },
  { kanji: '母', meaningEn: 'Mother', meaningJp: '母', onyomi: ['ボ'], kunyomi: ['はは'], strokeCount: 5, grade: 2, jlpt: 'N5' },
  { kanji: '父', meaningEn: 'Father', meaningJp: '父', onyomi: ['フ'], kunyomi: ['ちち'], strokeCount: 4, grade: 2, jlpt: 'N5' },
  { kanji: '兄', meaningEn: 'Older brother', meaningJp: '兄', onyomi: ['ケイ', 'キョウ'], kunyomi: ['あに'], strokeCount: 5, grade: 2, jlpt: 'N4' },
  { kanji: '姉', meaningEn: 'Older sister', meaningJp: '姉', onyomi: ['シ'], kunyomi: ['あね'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '弟', meaningEn: 'Younger brother', meaningJp: '弟', onyomi: ['テイ', 'ダイ'], kunyomi: ['おとうと'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '妹', meaningEn: 'Younger sister', meaningJp: '妹', onyomi: ['マイ'], kunyomi: ['いもうと'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '友', meaningEn: 'Friend', meaningJp: '友達', onyomi: ['ユウ'], kunyomi: ['とも'], strokeCount: 4, grade: 2, jlpt: 'N5' },
  { kanji: '体', meaningEn: 'Body', meaningJp: '体', onyomi: ['タイ', 'テイ'], kunyomi: ['からだ'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '頭', meaningEn: 'Head', meaningJp: '頭', onyomi: ['トウ', 'ズ'], kunyomi: ['あたま'], strokeCount: 16, grade: 2, jlpt: 'N3' },
  { kanji: '心', meaningEn: 'Heart / Mind', meaningJp: '心', onyomi: ['シン'], kunyomi: ['こころ'], strokeCount: 4, grade: 2, jlpt: 'N4' },
  { kanji: '思', meaningEn: 'Think', meaningJp: '思う', onyomi: ['シ'], kunyomi: ['おも'], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '知', meaningEn: 'Know', meaningJp: '知る', onyomi: ['チ'], kunyomi: ['し'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '元', meaningEn: 'Origin / Original', meaningJp: '元', onyomi: ['ゲン', 'ガン'], kunyomi: ['もと'], strokeCount: 4, grade: 2, jlpt: 'N4' },
  { kanji: '会', meaningEn: 'Meet / Society', meaningJp: '会う', onyomi: ['カイ', 'エ'], kunyomi: ['あ'], strokeCount: 6, grade: 2, jlpt: 'N4' },
  { kanji: '社', meaningEn: 'Company / Shrine', meaningJp: '会社', onyomi: ['シャ'], kunyomi: ['やしろ'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '教', meaningEn: 'Teach', meaningJp: '教える', onyomi: ['キョウ'], kunyomi: ['おし', 'おそ'], strokeCount: 11, grade: 2, jlpt: 'N4' },
  { kanji: '病', meaningEn: 'Illness / Sick', meaningJp: '病気', onyomi: ['ビョウ'], kunyomi: ['やまい', 'や'], strokeCount: 10, grade: 3, jlpt: 'N4' },
  { kanji: '薬', meaningEn: 'Medicine', meaningJp: '薬', onyomi: ['ヤク'], kunyomi: ['くすり'], strokeCount: 16, grade: 3, jlpt: 'N3' },
  { kanji: '医', meaningEn: 'Doctor / Medicine', meaningJp: '医者', onyomi: ['イ'], kunyomi: [], strokeCount: 7, grade: 3, jlpt: 'N4' },
  { kanji: '歌', meaningEn: 'Song / Sing', meaningJp: '歌', onyomi: ['カ'], kunyomi: ['うた', 'うた'], strokeCount: 14, grade: 2, jlpt: 'N4' },
  { kanji: '楽', meaningEn: 'Fun / Music', meaningJp: '楽しい', onyomi: ['ガク', 'ラク'], kunyomi: ['たの'], strokeCount: 13, grade: 2, jlpt: 'N4' },
  { kanji: '音', meaningEn: 'Sound', meaningJp: '音', onyomi: ['オン', 'イン'], kunyomi: ['おと', 'ね'], strokeCount: 9, grade: 1, jlpt: 'N4' },
  { kanji: '画', meaningEn: 'Picture / Drawing', meaningJp: '絵画', onyomi: ['ガ', 'カク'], kunyomi: [], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '映', meaningEn: 'Reflect / Movie', meaningJp: '映画', onyomi: ['エイ'], kunyomi: ['うつ', 'は'], strokeCount: 9, grade: 6, jlpt: 'N4' },
  { kanji: '写', meaningEn: 'Copy / Photo', meaningJp: '写真', onyomi: ['シャ'], kunyomi: ['うつ'], strokeCount: 5, grade: 3, jlpt: 'N4' },
  { kanji: '旅', meaningEn: 'Travel', meaningJp: '旅行', onyomi: ['リョ'], kunyomi: ['たび'], strokeCount: 10, grade: 3, jlpt: 'N4' },
  { kanji: '走', meaningEn: 'Run', meaningJp: '走る', onyomi: ['ソウ'], kunyomi: ['はし'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '泳', meaningEn: 'Swim', meaningJp: '泳ぐ', onyomi: ['エイ'], kunyomi: ['およ'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '春', meaningEn: 'Spring', meaningJp: '春', onyomi: ['シュン'], kunyomi: ['はる'], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '夏', meaningEn: 'Summer', meaningJp: '夏', onyomi: ['カ', 'ゲ'], kunyomi: ['なつ'], strokeCount: 10, grade: 2, jlpt: 'N4' },
  { kanji: '秋', meaningEn: 'Autumn', meaningJp: '秋', onyomi: ['シュウ'], kunyomi: ['あき'], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '冬', meaningEn: 'Winter', meaningJp: '冬', onyomi: ['トウ'], kunyomi: ['ふゆ'], strokeCount: 5, grade: 2, jlpt: 'N4' },
  { kanji: '雪', meaningEn: 'Snow', meaningJp: '雪', onyomi: ['セツ'], kunyomi: ['ゆき'], strokeCount: 11, grade: 2, jlpt: 'N3' },
  { kanji: '風', meaningEn: 'Wind', meaningJp: '風', onyomi: ['フウ', 'フ'], kunyomi: ['かぜ', 'かざ'], strokeCount: 9, grade: 2, jlpt: 'N3' },
  { kanji: '星', meaningEn: 'Star', meaningJp: '星', onyomi: ['セイ', 'ショウ'], kunyomi: ['ほし'], strokeCount: 9, grade: 2, jlpt: 'N3' },
  { kanji: '光', meaningEn: 'Light / Shine', meaningJp: '光', onyomi: ['コウ'], kunyomi: ['ひかり', 'ひか'], strokeCount: 6, grade: 2, jlpt: 'N3' },
  { kanji: '海', meaningEn: 'Sea / Ocean', meaningJp: '海', onyomi: ['カイ'], kunyomi: ['うみ'], strokeCount: 9, grade: 2, jlpt: 'N4' },
  { kanji: '森', meaningEn: 'Forest', meaningJp: '森', onyomi: ['シン'], kunyomi: ['もり'], strokeCount: 12, grade: 1, jlpt: 'N3' },
  { kanji: '林', meaningEn: 'Grove / Forest', meaningJp: '林', onyomi: ['リン'], kunyomi: ['はやし'], strokeCount: 8, grade: 1, jlpt: 'N3' },
  { kanji: '数', meaningEn: 'Number / Count', meaningJp: '数える', onyomi: ['スウ'], kunyomi: ['かず', 'かぞ'], strokeCount: 13, grade: 2, jlpt: 'N3' },
  { kanji: '理', meaningEn: 'Reason / Logic', meaningJp: '理由', onyomi: ['リ'], kunyomi: [], strokeCount: 11, grade: 2, jlpt: 'N3' },
  { kanji: '科', meaningEn: 'Science / Subject', meaningJp: '科学', onyomi: ['カ'], kunyomi: [], strokeCount: 9, grade: 2, jlpt: 'N3' },
  { kanji: '算', meaningEn: 'Calculate', meaningJp: '計算', onyomi: ['サン'], kunyomi: [], strokeCount: 14, grade: 2, jlpt: 'N3' },
  { kanji: '答', meaningEn: 'Answer', meaningJp: '答え', onyomi: ['トウ'], kunyomi: ['こた'], strokeCount: 12, grade: 2, jlpt: 'N4' },
  { kanji: '問', meaningEn: 'Question / Ask', meaningJp: '質問', onyomi: ['モン'], kunyomi: ['と'], strokeCount: 11, grade: 3, jlpt: 'N4' },
  { kanji: '電', meaningEn: 'Electricity', meaningJp: '電気', onyomi: ['デン'], kunyomi: [], strokeCount: 13, grade: 2, jlpt: 'N5' },
  { kanji: '話', meaningEn: 'Talk / Story', meaningJp: '話す', onyomi: ['ワ'], kunyomi: ['はな', 'はなし'], strokeCount: 13, grade: 2, jlpt: 'N5' },
  { kanji: '愛', meaningEn: 'Love', meaningJp: '愛', onyomi: ['アイ'], kunyomi: [], strokeCount: 13, grade: 4, jlpt: 'N3' },
  { kanji: '夢', meaningEn: 'Dream', meaningJp: '夢', onyomi: ['ム'], kunyomi: ['ゆめ'], strokeCount: 13, grade: 5, jlpt: 'N2' },
  { kanji: '勇', meaningEn: 'Courage / Brave', meaningJp: '勇気', onyomi: ['ユウ'], kunyomi: ['いさ'], strokeCount: 9, grade: 4, jlpt: 'N2' },
  { kanji: '智', meaningEn: 'Wisdom', meaningJp: '知恵', onyomi: ['チ'], kunyomi: [], strokeCount: 12, grade: 7, jlpt: 'N1' },
  { kanji: '永', meaningEn: 'Eternity', meaningJp: '永遠', onyomi: ['エイ'], kunyomi: ['なが'], strokeCount: 5, grade: 5, jlpt: 'N2' },
  { kanji: '和', meaningEn: 'Harmony / Peace', meaningJp: '平和', onyomi: ['ワ'], kunyomi: ['やわ', 'なご'], strokeCount: 8, grade: 3, jlpt: 'N3' },
  { kanji: '真', meaningEn: 'True / Real', meaningJp: '真実', onyomi: ['シン'], kunyomi: ['ま'], strokeCount: 10, grade: 3, jlpt: 'N3' },
  { kanji: '美', meaningEn: 'Beautiful', meaningJp: '美しい', onyomi: ['ビ'], kunyomi: ['うつく'], strokeCount: 9, grade: 3, jlpt: 'N3' },
  { kanji: '竜', meaningEn: 'Dragon', meaningJp: '竜', onyomi: ['リュウ'], kunyomi: ['たつ'], strokeCount: 10, grade: 7, jlpt: 'N1' },
  { kanji: '魂', meaningEn: 'Soul / Spirit', meaningJp: '魂', onyomi: ['コン'], kunyomi: ['たましい'], strokeCount: 14, grade: 7, jlpt: 'N1' },
  { kanji: '影', meaningEn: 'Shadow', meaningJp: '影', onyomi: ['エイ'], kunyomi: ['かげ'], strokeCount: 15, grade: 7, jlpt: 'N2' },
  { kanji: '運', meaningEn: 'Luck / Carry', meaningJp: '運ぶ', onyomi: ['ウン'], kunyomi: ['はこ'], strokeCount: 12, grade: 3, jlpt: 'N3' },
  { kanji: '動', meaningEn: 'Move', meaningJp: '動く', onyomi: ['ドウ'], kunyomi: ['うご'], strokeCount: 11, grade: 3, jlpt: 'N4' },
  { kanji: '働', meaningEn: 'Work', meaningJp: '働く', onyomi: ['ドウ'], kunyomi: ['はたら'], strokeCount: 13, grade: 4, jlpt: 'N4' },
  { kanji: '持', meaningEn: 'Hold / Have', meaningJp: '持つ', onyomi: ['ジ'], kunyomi: ['も'], strokeCount: 9, grade: 3, jlpt: 'N4' },
  { kanji: '待', meaningEn: 'Wait', meaningJp: '待つ', onyomi: ['タイ'], kunyomi: ['ま'], strokeCount: 9, grade: 3, jlpt: 'N4' },
  { kanji: '使', meaningEn: 'Use', meaningJp: '使う', onyomi: ['シ'], kunyomi: ['つか'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '送', meaningEn: 'Send', meaningJp: '送る', onyomi: ['ソウ'], kunyomi: ['おく'], strokeCount: 9, grade: 3, jlpt: 'N4' },
  { kanji: '届', meaningEn: 'Deliver / Reach', meaningJp: '届く', onyomi: ['カイ'], kunyomi: ['とど'], strokeCount: 8, grade: 6, jlpt: 'N2' },
  { kanji: '開', meaningEn: 'Open', meaningJp: '開ける', onyomi: ['カイ'], kunyomi: ['あ', 'ひら'], strokeCount: 12, grade: 3, jlpt: 'N4' },
  { kanji: '閉', meaningEn: 'Close / Shut', meaningJp: '閉める', onyomi: ['ヘイ'], kunyomi: ['し', 'と'], strokeCount: 11, grade: 6, jlpt: 'N3' },
  { kanji: '始', meaningEn: 'Begin / Start', meaningJp: '始まる', onyomi: ['シ'], kunyomi: ['はじ'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '終', meaningEn: 'End / Finish', meaningJp: '終わる', onyomi: ['シュウ'], kunyomi: ['お'], strokeCount: 11, grade: 3, jlpt: 'N4' },
  { kanji: '習', meaningEn: 'Learn / Practice', meaningJp: '習う', onyomi: ['シュウ'], kunyomi: ['なら'], strokeCount: 11, grade: 3, jlpt: 'N4' },
  { kanji: '練', meaningEn: 'Practice / Train', meaningJp: '練習', onyomi: ['レン'], kunyomi: ['ね'], strokeCount: 14, grade: 3, jlpt: 'N3' },
  { kanji: '試', meaningEn: 'Try / Test', meaningJp: '試す', onyomi: ['シ'], kunyomi: ['ため', 'こころ'], strokeCount: 13, grade: 4, jlpt: 'N3' },
  { kanji: '験', meaningEn: 'Examination', meaningJp: '試験', onyomi: ['ケン', 'ゲン'], kunyomi: [], strokeCount: 18, grade: 4, jlpt: 'N3' },
  { kanji: '質', meaningEn: 'Quality / Question', meaningJp: '質問', onyomi: ['シツ', 'シチ'], kunyomi: [], strokeCount: 15, grade: 5, jlpt: 'N3' },
  { kanji: '変', meaningEn: 'Change / Strange', meaningJp: '変わる', onyomi: ['ヘン'], kunyomi: ['か'], strokeCount: 9, grade: 4, jlpt: 'N3' },
  { kanji: '特', meaningEn: 'Special', meaningJp: '特別', onyomi: ['トク'], kunyomi: [], strokeCount: 10, grade: 4, jlpt: 'N3' },
  { kanji: '別', meaningEn: 'Separate / Different', meaningJp: '別', onyomi: ['ベツ'], kunyomi: ['わか'], strokeCount: 7, grade: 4, jlpt: 'N4' },
  { kanji: '必', meaningEn: 'Necessary / Must', meaningJp: '必要', onyomi: ['ヒツ'], kunyomi: ['かなら'], strokeCount: 5, grade: 4, jlpt: 'N3' },
  { kanji: '要', meaningEn: 'Need / Essential', meaningJp: '必要', onyomi: ['ヨウ'], kunyomi: ['い'], strokeCount: 9, grade: 4, jlpt: 'N3' },
  { kanji: '急', meaningEn: 'Hurry / Urgent', meaningJp: '急ぐ', onyomi: ['キュウ'], kunyomi: ['いそ'], strokeCount: 9, grade: 3, jlpt: 'N3' },
  { kanji: '度', meaningEn: 'Degree / Time', meaningJp: '温度', onyomi: ['ド', 'タク'], kunyomi: ['たび'], strokeCount: 9, grade: 3, jlpt: 'N4' },
  { kanji: '集', meaningEn: 'Gather / Collect', meaningJp: '集める', onyomi: ['シュウ'], kunyomi: ['あつ'], strokeCount: 12, grade: 3, jlpt: 'N4' },
  { kanji: '止', meaningEn: 'Stop', meaningJp: '止まる', onyomi: ['シ'], kunyomi: ['と', 'や'], strokeCount: 4, grade: 2, jlpt: 'N4' },
  { kanji: '歩', meaningEn: 'Walk / Step', meaningJp: '歩く', onyomi: ['ホ', 'ブ'], kunyomi: ['ある', 'あゆ'], strokeCount: 8, grade: 2, jlpt: 'N4' },
  { kanji: '着', meaningEn: 'Arrive / Wear', meaningJp: '着く', onyomi: ['チャク', 'ジャク'], kunyomi: ['つ', 'き'], strokeCount: 12, grade: 3, jlpt: 'N4' },
  { kanji: '払', meaningEn: 'Pay', meaningJp: '払う', onyomi: ['フツ'], kunyomi: ['はら'], strokeCount: 5, grade: 7, jlpt: 'N3' },
  { kanji: '借', meaningEn: 'Borrow', meaningJp: '借りる', onyomi: ['シャク'], kunyomi: ['か'], strokeCount: 10, grade: 4, jlpt: 'N4' },
  { kanji: '貸', meaningEn: 'Lend', meaningJp: '貸す', onyomi: ['タイ'], kunyomi: ['か'], strokeCount: 12, grade: 5, jlpt: 'N4' },
  { kanji: '返', meaningEn: 'Return / Give back', meaningJp: '返す', onyomi: ['ヘン'], kunyomi: ['かえ'], strokeCount: 7, grade: 3, jlpt: 'N3' },
  { kanji: '場', meaningEn: 'Place', meaningJp: '場所', onyomi: ['ジョウ'], kunyomi: ['ば'], strokeCount: 12, grade: 2, jlpt: 'N4' },
  { kanji: '所', meaningEn: 'Place / Location', meaningJp: '場所', onyomi: ['ショ'], kunyomi: ['ところ'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '地', meaningEn: 'Ground / Earth', meaningJp: '地面', onyomi: ['チ', 'ジ'], kunyomi: [], strokeCount: 6, grade: 2, jlpt: 'N4' },
  { kanji: '図', meaningEn: 'Map / Drawing', meaningJp: '地図', onyomi: ['ズ', 'ト'], kunyomi: ['はか'], strokeCount: 7, grade: 2, jlpt: 'N4' },
  { kanji: '世', meaningEn: 'World / Generation', meaningJp: '世界', onyomi: ['セイ', 'セ'], kunyomi: ['よ'], strokeCount: 5, grade: 3, jlpt: 'N4' },
  { kanji: '界', meaningEn: 'World / Boundary', meaningJp: '世界', onyomi: ['カイ'], kunyomi: [], strokeCount: 9, grade: 3, jlpt: 'N4' },
  { kanji: '意', meaningEn: 'Meaning / Idea', meaningJp: '意味', onyomi: ['イ'], kunyomi: [], strokeCount: 13, grade: 3, jlpt: 'N4' },
  { kanji: '味', meaningEn: 'Taste / Flavor', meaningJp: '味', onyomi: ['ミ'], kunyomi: ['あじ'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '服', meaningEn: 'Clothes', meaningJp: '服', onyomi: ['フク'], kunyomi: [], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '洋', meaningEn: 'Western / Ocean', meaningJp: '洋服', onyomi: ['ヨウ'], kunyomi: [], strokeCount: 9, grade: 3, jlpt: 'N4' },
  { kanji: '料', meaningEn: 'Fee / Material', meaningJp: '料理', onyomi: ['リョウ'], kunyomi: [], strokeCount: 10, grade: 4, jlpt: 'N4' },
  { kanji: '理', meaningEn: 'Reason / Logic', meaningJp: '料理', onyomi: ['リ'], kunyomi: [], strokeCount: 11, grade: 2, jlpt: 'N4' },
  { kanji: '野', meaningEn: 'Field / Plain', meaningJp: '野菜', onyomi: ['ヤ'], kunyomi: ['の'], strokeCount: 11, grade: 2, jlpt: 'N4' },
  { kanji: '菜', meaningEn: 'Vegetable', meaningJp: '野菜', onyomi: ['サイ'], kunyomi: ['な'], strokeCount: 11, grade: 4, jlpt: 'N4' },
  { kanji: '果', meaningEn: 'Fruit / Result', meaningJp: '果物', onyomi: ['カ'], kunyomi: ['は'], strokeCount: 8, grade: 4, jlpt: 'N3' },
  { kanji: '物', meaningEn: 'Thing / Object', meaningJp: '物', onyomi: ['ブツ', 'モツ'], kunyomi: ['もの'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '事', meaningEn: 'Thing / Matter', meaningJp: '事', onyomi: ['ジ', 'ズ'], kunyomi: ['こと'], strokeCount: 8, grade: 3, jlpt: 'N4' },
  { kanji: '仕', meaningEn: 'Serve / Work', meaningJp: '仕事', onyomi: ['シ', 'ジ'], kunyomi: ['つか'], strokeCount: 5, grade: 3, jlpt: 'N4' },
  { kanji: '住', meaningEn: 'Live / Reside', meaningJp: '住む', onyomi: ['ジュウ'], kunyomi: ['す'], strokeCount: 7, grade: 3, jlpt: 'N4' },
  { kanji: '鳥', meaningEn: 'Bird', meaningJp: '鳥', onyomi: ['チョウ'], kunyomi: ['とり'], strokeCount: 11, grade: 2, jlpt: 'N3' },
  { kanji: '猫', meaningEn: 'Cat', meaningJp: '猫', onyomi: ['ビョウ'], kunyomi: ['ねこ'], strokeCount: 11, grade: 7, jlpt: 'N3' },
  { kanji: '馬', meaningEn: 'Horse', meaningJp: '馬', onyomi: ['バ'], kunyomi: ['うま', 'ま'], strokeCount: 10, grade: 2, jlpt: 'N3' },
  { kanji: '牛', meaningEn: 'Cow / Beef', meaningJp: '牛', onyomi: ['ギュウ'], kunyomi: ['うし'], strokeCount: 4, grade: 2, jlpt: 'N4' },
];

export const VOCABULARY: VocabEntry[] = [
  { id: 'v1', word: '名前', reading: 'なまえ', meaningEn: 'Name', meaningJp: '名前', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['名', '前'] },
  { id: 'v2', word: '家族', reading: 'かぞく', meaningEn: 'Family', meaningJp: '家族', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['家', '族'] },
  { id: 'v3', word: '友達', reading: 'ともだち', meaningEn: 'Friend', meaningJp: '友達', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['友', '達'] },
  { id: 'v4', word: '男の子', reading: 'おとこのこ', meaningEn: 'Boy', meaningJp: '男の子', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['男', '子'] },
  { id: 'v5', word: '女の子', reading: 'おんなのこ', meaningEn: 'Girl', meaningJp: '女の子', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['女', '子'] },
  { id: 'v6', word: '父親', reading: 'ちちおや', meaningEn: 'Father', meaningJp: '父親', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['父'] },
  { id: 'v7', word: '母親', reading: 'ははおや', meaningEn: 'Mother', meaningJp: '母親', topic: 'personal_information', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['母'] },
  { id: 'v8', word: '兄弟', reading: 'きょうだい', meaningEn: 'Siblings', meaningJp: '兄弟', topic: 'personal_information', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['兄', '弟'] },
  { id: 'v9', word: '姉妹', reading: 'しまい', meaningEn: 'Sisters', meaningJp: '姉妹', topic: 'personal_information', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['姉', '妹'] },
  { id: 'v10', word: '国籍', reading: 'こくせき', meaningEn: 'Nationality', meaningJp: '国籍', topic: 'personal_information', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['国'] },

  { id: 'v11', word: '時間', reading: 'じかん', meaningEn: 'Time', meaningJp: '時間', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['時', '間'] },
  { id: 'v12', word: '毎日', reading: 'まいにち', meaningEn: 'Every day', meaningJp: '毎日', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['日'] },
  { id: 'v13', word: '朝', reading: 'あさ', meaningEn: 'Morning', meaningJp: '朝', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['朝'] },
  { id: 'v14', word: '昼', reading: 'ひる', meaningEn: 'Noon / Daytime', meaningJp: '昼', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['昼'] },
  { id: 'v15', word: '夜', reading: 'よる', meaningEn: 'Night', meaningJp: '夜', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['夜'] },
  { id: 'v16', word: '午前', reading: 'ごぜん', meaningEn: 'AM / Morning', meaningJp: '午前', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['午', '前'] },
  { id: 'v17', word: '午後', reading: 'ごご', meaningEn: 'PM / Afternoon', meaningJp: '午後', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['午', '後'] },
  { id: 'v18', word: '今日', reading: 'きょう', meaningEn: 'Today', meaningJp: '今日', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['今', '日'] },
  { id: 'v19', word: '明日', reading: 'あした', meaningEn: 'Tomorrow', meaningJp: '明日', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['明', '日'] },
  { id: 'v20', word: '一週間', reading: 'いっしゅうかん', meaningEn: 'One week', meaningJp: '一週間', topic: 'daily_life', difficulty: 'intermediate', jlpt: 'N5', componentKanji: ['一', '週', '間'] },

  { id: 'v21', word: '家', reading: 'いえ', meaningEn: 'House', meaningJp: '家', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['家'] },
  { id: 'v22', word: '部屋', reading: 'へや', meaningEn: 'Room', meaningJp: '部屋', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['室'] },
  { id: 'v23', word: '入口', reading: 'いりぐち', meaningEn: 'Entrance', meaningJp: '入口', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['入', '口'] },
  { id: 'v24', word: '出口', reading: 'でぐち', meaningEn: 'Exit', meaningJp: '出口', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['出', '口'] },
  { id: 'v25', word: '庭', reading: 'にわ', meaningEn: 'Garden', meaningJp: '庭', topic: 'home_environment', difficulty: 'intermediate', jlpt: 'N3', componentKanji: [] },
  { id: 'v26', word: '窓', reading: 'まど', meaningEn: 'Window', meaningJp: '窓', topic: 'home_environment', difficulty: 'intermediate', jlpt: 'N3', componentKanji: [] },

  { id: 'v27', word: '食べ物', reading: 'たべもの', meaningEn: 'Food', meaningJp: '食べ物', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['食', '物'] },
  { id: 'v28', word: '飲み物', reading: 'のみもの', meaningEn: 'Drink / Beverage', meaningJp: '飲み物', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['飲', '物'] },
  { id: 'v29', word: '魚', reading: 'さかな', meaningEn: 'Fish', meaningJp: '魚', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['魚'] },
  { id: 'v30', word: '肉', reading: 'にく', meaningEn: 'Meat', meaningJp: '肉', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['肉'] },
  { id: 'v31', word: '野菜', reading: 'やさい', meaningEn: 'Vegetables', meaningJp: '野菜', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['野', '菜'] },
  { id: 'v32', word: '果物', reading: 'くだもの', meaningEn: 'Fruit', meaningJp: '果物', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['果', '物'] },
  { id: 'v33', word: 'お茶', reading: 'おちゃ', meaningEn: 'Tea', meaningJp: 'お茶', topic: 'food_drink', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['茶'] },
  { id: 'v34', word: '料理', reading: 'りょうり', meaningEn: 'Cooking / Cuisine', meaningJp: '料理', topic: 'food_drink', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['料', '理'] },
  { id: 'v35', word: '牛肉', reading: 'ぎゅうにく', meaningEn: 'Beef', meaningJp: '牛肉', topic: 'food_drink', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['牛', '肉'] },

  { id: 'v36', word: '駅', reading: 'えき', meaningEn: 'Station', meaningJp: '駅', topic: 'community', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['駅'] },
  { id: 'v37', word: '店', reading: 'みせ', meaningEn: 'Shop / Store', meaningJp: '店', topic: 'community', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['店'] },
  { id: 'v38', word: '道', reading: 'みち', meaningEn: 'Road / Way', meaningJp: '道', topic: 'community', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['道'] },
  { id: 'v39', word: '電車', reading: 'でんしゃ', meaningEn: 'Train', meaningJp: '電車', topic: 'community', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['電', '車'] },
  { id: 'v40', word: '自動車', reading: 'じどうしゃ', meaningEn: 'Automobile', meaningJp: '自動車', topic: 'community', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['動', '車'] },
  { id: 'v41', word: '会社', reading: 'かいしゃ', meaningEn: 'Company', meaningJp: '会社', topic: 'community', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['会', '社'] },
  { id: 'v42', word: '場所', reading: 'ばしょ', meaningEn: 'Place / Location', meaningJp: '場所', topic: 'community', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['場', '所'] },
  { id: 'v43', word: '仕事', reading: 'しごと', meaningEn: 'Work / Job', meaningJp: '仕事', topic: 'community', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['仕', '事'] },
  { id: 'v44', word: '旅行', reading: 'りょこう', meaningEn: 'Travel / Trip', meaningJp: '旅行', topic: 'community', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['旅', '行'] },

  { id: 'v45', word: '体', reading: 'からだ', meaningEn: 'Body', meaningJp: '体', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['体'] },
  { id: 'v46', word: '頭', reading: 'あたま', meaningEn: 'Head', meaningJp: '頭', topic: 'health_body', difficulty: 'beginner', jlpt: 'N3', componentKanji: ['頭'] },
  { id: 'v47', word: '目', reading: 'め', meaningEn: 'Eye', meaningJp: '目', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['目'] },
  { id: 'v48', word: '耳', reading: 'みみ', meaningEn: 'Ear', meaningJp: '耳', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['耳'] },
  { id: 'v49', word: '口', reading: 'くち', meaningEn: 'Mouth', meaningJp: '口', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['口'] },
  { id: 'v50', word: '手', reading: 'て', meaningEn: 'Hand', meaningJp: '手', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['手'] },
  { id: 'v51', word: '足', reading: 'あし', meaningEn: 'Foot / Leg', meaningJp: '足', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['足'] },
  { id: 'v52', word: '心', reading: 'こころ', meaningEn: 'Heart / Mind', meaningJp: '心', topic: 'health_body', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['心'] },
  { id: 'v53', word: '病気', reading: 'びょうき', meaningEn: 'Illness / Sickness', meaningJp: '病気', topic: 'health_body', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['病', '気'] },
  { id: 'v54', word: '薬', reading: 'くすり', meaningEn: 'Medicine', meaningJp: '薬', topic: 'health_body', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['薬'] },
  { id: 'v55', word: '医者', reading: 'いしゃ', meaningEn: 'Doctor', meaningJp: '医者', topic: 'health_body', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['医'] },
  { id: 'v56', word: '服', reading: 'ふく', meaningEn: 'Clothes', meaningJp: '服', topic: 'health_body', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['服'] },
  { id: 'v57', word: '洋服', reading: 'ようふく', meaningEn: 'Western clothes', meaningJp: '洋服', topic: 'health_body', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['洋', '服'] },

  { id: 'v58', word: '歌', reading: 'うた', meaningEn: 'Song', meaningJp: '歌', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['歌'] },
  { id: 'v59', word: '音楽', reading: 'おんがく', meaningEn: 'Music', meaningJp: '音楽', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['音', '楽'] },
  { id: 'v60', word: '映画', reading: 'えいが', meaningEn: 'Movie', meaningJp: '映画', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['映', '画'] },
  { id: 'v61', word: '写真', reading: 'しゃしん', meaningEn: 'Photograph', meaningJp: '写真', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['写', '真'] },
  { id: 'v62', word: '走る', reading: 'はしる', meaningEn: 'To run', meaningJp: '走る', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['走'] },
  { id: 'v63', word: '泳ぐ', reading: 'およぐ', meaningEn: 'To swim', meaningJp: '泳ぐ', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['泳'] },
  { id: 'v64', word: '散歩', reading: 'さんぽ', meaningEn: 'Walk / Stroll', meaningJp: '散歩', topic: 'interests_hobbies', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['歩'] },

  { id: 'v65', word: '学校', reading: 'がっこう', meaningEn: 'School', meaningJp: '学校', topic: 'academic', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['学', '校'] },
  { id: 'v66', word: '先生', reading: 'せんせい', meaningEn: 'Teacher', meaningJp: '先生', topic: 'academic', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['先', '生'] },
  { id: 'v67', word: '勉強', reading: 'べんきょう', meaningEn: 'Study', meaningJp: '勉強', topic: 'academic', difficulty: 'beginner', jlpt: 'N5', componentKanji: [] },
  { id: 'v68', word: '答え', reading: 'こたえ', meaningEn: 'Answer', meaningJp: '答え', topic: 'academic', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['答'] },
  { id: 'v69', word: '質問', reading: 'しつもん', meaningEn: 'Question', meaningJp: '質問', topic: 'academic', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['質', '問'] },
  { id: 'v70', word: '数学', reading: 'すうがく', meaningEn: 'Mathematics', meaningJp: '数学', topic: 'academic', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['数', '学'] },
  { id: 'v71', word: '科学', reading: 'かがく', meaningEn: 'Science', meaningJp: '科学', topic: 'academic', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['科', '学'] },
  { id: 'v72', word: '試験', reading: 'しけん', meaningEn: 'Examination / Test', meaningJp: '試験', topic: 'academic', difficulty: 'advanced', jlpt: 'N3', componentKanji: ['試', '験'] },
  { id: 'v73', word: '練習', reading: 'れんしゅう', meaningEn: 'Practice', meaningJp: '練習', topic: 'academic', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['練', '習'] },
  { id: 'v74', word: '教室', reading: 'きょうしつ', meaningEn: 'Classroom', meaningJp: '教室', topic: 'academic', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['教', '室'] },

  { id: 'v75', word: '電話', reading: 'でんわ', meaningEn: 'Telephone', meaningJp: '電話', topic: 'communication', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['電', '話'] },
  { id: 'v76', word: '手紙', reading: 'てがみ', meaningEn: 'Letter', meaningJp: '手紙', topic: 'communication', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['手'] },
  { id: 'v77', word: '買い物', reading: 'かいもの', meaningEn: 'Shopping', meaningJp: '買い物', topic: 'communication', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['買', '物'] },
  { id: 'v78', word: '意味', reading: 'いみ', meaningEn: 'Meaning', meaningJp: '意味', topic: 'communication', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['意', '味'] },
  { id: 'v79', word: '世界', reading: 'せかい', meaningEn: 'World', meaningJp: '世界', topic: 'communication', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['世', '界'] },
  { id: 'v80', word: '特別', reading: 'とくべつ', meaningEn: 'Special', meaningJp: '特別', topic: 'communication', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['特', '別'] },
  { id: 'v81', word: '必要', reading: 'ひつよう', meaningEn: 'Necessary', meaningJp: '必要', topic: 'communication', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['必', '要'] },
  { id: 'v82', word: '変化', reading: 'へんか', meaningEn: 'Change', meaningJp: '変化', topic: 'communication', difficulty: 'advanced', jlpt: 'N3', componentKanji: ['変'] },

  { id: 'v83', word: '春', reading: 'はる', meaningEn: 'Spring', meaningJp: '春', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['春'] },
  { id: 'v84', word: '夏', reading: 'なつ', meaningEn: 'Summer', meaningJp: '夏', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['夏'] },
  { id: 'v85', word: '秋', reading: 'あき', meaningEn: 'Autumn', meaningJp: '秋', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['秋'] },
  { id: 'v86', word: '冬', reading: 'ふゆ', meaningEn: 'Winter', meaningJp: '冬', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['冬'] },
  { id: 'v87', word: '天気', reading: 'てんき', meaningEn: 'Weather', meaningJp: '天気', topic: 'daily_life', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['天', '気'] },
  { id: 'v88', word: '平和', reading: 'へいわ', meaningEn: 'Peace', meaningJp: '平和', topic: 'communication', difficulty: 'advanced', jlpt: 'N3', componentKanji: ['和'] },
  { id: 'v89', word: '美しい', reading: 'うつくしい', meaningEn: 'Beautiful', meaningJp: '美しい', topic: 'communication', difficulty: 'advanced', jlpt: 'N3', componentKanji: ['美'] },
  { id: 'v90', word: '勇気', reading: 'ゆうき', meaningEn: 'Courage', meaningJp: '勇気', topic: 'communication', difficulty: 'advanced', jlpt: 'N2', componentKanji: ['勇', '気'] },
  { id: 'v91', word: '永遠', reading: 'えいえん', meaningEn: 'Eternity', meaningJp: '永遠', topic: 'communication', difficulty: 'advanced', jlpt: 'N2', componentKanji: ['永', '遠'] },
  { id: 'v92', word: '真実', reading: 'しんじつ', meaningEn: 'Truth', meaningJp: '真実', topic: 'communication', difficulty: 'advanced', jlpt: 'N2', componentKanji: ['真'] },
  { id: 'v93', word: '地図', reading: 'ちず', meaningEn: 'Map', meaningJp: '地図', topic: 'community', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['地', '図'] },
  { id: 'v94', word: '住所', reading: 'じゅうしょ', meaningEn: 'Address', meaningJp: '住所', topic: 'personal_information', difficulty: 'intermediate', jlpt: 'N4', componentKanji: ['住', '所'] },
  { id: 'v95', word: '日本語', reading: 'にほんご', meaningEn: 'Japanese language', meaningJp: '日本語', topic: 'academic', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['日', '語'] },
  { id: 'v96', word: '読書', reading: 'どくしょ', meaningEn: 'Reading (books)', meaningJp: '読書', topic: 'interests_hobbies', difficulty: 'intermediate', jlpt: 'N3', componentKanji: ['読', '書'] },
  { id: 'v97', word: '海', reading: 'うみ', meaningEn: 'Sea / Ocean', meaningJp: '海', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['海'] },
  { id: 'v98', word: '山', reading: 'やま', meaningEn: 'Mountain', meaningJp: '山', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N5', componentKanji: ['山'] },
  { id: 'v99', word: '花', reading: 'はな', meaningEn: 'Flower', meaningJp: '花', topic: 'home_environment', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['花'] },
  { id: 'v100', word: '動物', reading: 'どうぶつ', meaningEn: 'Animal', meaningJp: '動物', topic: 'interests_hobbies', difficulty: 'beginner', jlpt: 'N4', componentKanji: ['動', '物'] },
];

const KANA_TO_ROMAJI: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'っ': '',
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'di', 'ヅ': 'du', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
  'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
  'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
  'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
  'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
  'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
  'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
  'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
  'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
  'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
  'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
  'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
  'ッ': '',
  'ー': '',
};

export function kanaToRomaji(kana: string): string {
  let result = '';
  let i = 0;
  while (i < kana.length) {
    if (i + 1 < kana.length) {
      const pair = kana[i] + kana[i + 1];
      if (KANA_TO_ROMAJI[pair] !== undefined) {
        result += KANA_TO_ROMAJI[pair];
        i += 2;
        continue;
      }
    }
    const ch = kana[i];
    if ((ch === 'っ' || ch === 'ッ') && i + 1 < kana.length) {
      const nextChar = kana[i + 1];
      const nextRomaji = KANA_TO_ROMAJI[nextChar];
      if (nextRomaji && nextRomaji.length > 0) {
        result += nextRomaji[0];
      }
      i++;
      continue;
    }
    if (KANA_TO_ROMAJI[ch] !== undefined) {
      result += KANA_TO_ROMAJI[ch];
    } else {
      result += ch;
    }
    i++;
  }
  return result;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getKanjiByDifficulty(difficulty: KanjiDifficulty): MasterKanji[] {
  switch (difficulty) {
    case 'beginner':
      return MASTER_KANJI.filter(k => k.jlpt === 'N5' || k.jlpt === 'N4');
    case 'intermediate':
      return MASTER_KANJI.filter(k => k.jlpt === 'N3' || k.jlpt === 'N2');
    case 'advanced':
      return MASTER_KANJI.filter(k => k.jlpt === 'N2' || k.jlpt === 'N1');
    default:
      return MASTER_KANJI;
  }
}

export function getVocabByFilters(
  difficulty: KanjiDifficulty,
  topics: TopicTag[],
  excludeIds: string[] = []
): VocabEntry[] {
  let pool = VOCABULARY.filter(v => !excludeIds.includes(v.id));

  switch (difficulty) {
    case 'beginner':
      pool = pool.filter(v => v.jlpt === 'N5' || v.jlpt === 'N4');
      break;
    case 'intermediate':
      pool = pool.filter(v => v.jlpt === 'N4' || v.jlpt === 'N3');
      break;
    case 'advanced':
      pool = pool.filter(v => v.jlpt === 'N3' || v.jlpt === 'N2' || v.jlpt === 'N1');
      break;
  }

  if (topics.length > 0) {
    pool = pool.filter(v => topics.includes(v.topic));
  }

  return shuffleArray(pool);
}

export function getMeaningDrillQuestion(
  difficulty: KanjiDifficulty,
  excludeKanji: string[] = [],
  isJp: boolean = false
): {
  kanji: MasterKanji;
  options: { text: string; isCorrect: boolean }[];
} | null {
  const pool = getKanjiByDifficulty(difficulty).filter(k => !excludeKanji.includes(k.kanji));
  if (pool.length === 0) return null;

  const kanji = pool[Math.floor(Math.random() * pool.length)];
  const correctAnswer = isJp ? kanji.meaningJp : kanji.meaningEn;

  const distractorPool = MASTER_KANJI
    .filter(k => k.kanji !== kanji.kanji)
    .map(k => isJp ? k.meaningJp : k.meaningEn)
    .filter(m => m !== correctAnswer);

  const distractors = shuffleArray(distractorPool).slice(0, 3);

  const options = shuffleArray([
    { text: correctAnswer, isCorrect: true },
    ...distractors.map(d => ({ text: d, isCorrect: false })),
  ]);

  return { kanji, options };
}

export function getVocabQuestion(
  difficulty: KanjiDifficulty,
  topics: TopicTag[],
  excludeIds: string[] = [],
  mode: 'word-to-meaning' | 'meaning-to-word' = 'word-to-meaning',
  isJp: boolean = false
): {
  vocab: VocabEntry;
  question: string;
  options: { text: string; isCorrect: boolean }[];
} | null {
  const pool = getVocabByFilters(difficulty, topics, excludeIds);
  if (pool.length === 0) return null;

  const vocab = pool[0];

  if (mode === 'word-to-meaning') {
    const correctAnswer = isJp ? vocab.meaningJp : vocab.meaningEn;
    const question = vocab.word;

    const distractorPool = VOCABULARY
      .filter(v => v.id !== vocab.id)
      .map(v => isJp ? v.meaningJp : v.meaningEn)
      .filter(m => m !== correctAnswer);

    const distractors = shuffleArray(distractorPool).slice(0, 3);
    const options = shuffleArray([
      { text: correctAnswer, isCorrect: true },
      ...distractors.map(d => ({ text: d, isCorrect: false })),
    ]);

    return { vocab, question, options };
  } else {
    const question = isJp ? vocab.meaningJp : vocab.meaningEn;
    const correctAnswer = vocab.word;

    const distractorPool = VOCABULARY
      .filter(v => v.id !== vocab.id)
      .map(v => v.word)
      .filter(w => w !== correctAnswer);

    const distractors = shuffleArray(distractorPool).slice(0, 3);
    const options = shuffleArray([
      { text: correctAnswer, isCorrect: true },
      ...distractors.map(d => ({ text: d, isCorrect: false })),
    ]);

    return { vocab, question, options };
  }
}

export function getReadingQuestion(
  difficulty: KanjiDifficulty,
  topics: TopicTag[],
  excludeIds: string[] = []
): {
  vocab: VocabEntry;
  options: { text: string; isCorrect: boolean }[];
} | null {
  const pool = getVocabByFilters(difficulty, topics, excludeIds);
  if (pool.length === 0) return null;

  const vocab = pool[0];
  const correctAnswer = vocab.reading;

  const distractorPool = VOCABULARY
    .filter(v => v.id !== vocab.id)
    .map(v => v.reading)
    .filter(r => r !== correctAnswer);

  const distractors = shuffleArray(distractorPool).slice(0, 3);
  const options = shuffleArray([
    { text: correctAnswer, isCorrect: true },
    ...distractors.map(d => ({ text: d, isCorrect: false })),
  ]);

  return { vocab, options };
}
