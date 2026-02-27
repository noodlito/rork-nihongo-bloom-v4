import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Globe, Home, ArrowRight } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getRandomTrivia,
  getQuestionCount,
  type TriviaQuestion,
  type TriviaCategory,
  type TriviaDifficulty,
} from '@/mocks/trivia';
import { ReinaCharacter } from '@/components/ReinaCharacter';
import type { ReinaExpression } from '@/constants/reina';
import { FloralOverlay } from '@/components/FloralOverlay';

const ROUND_SIZE = 5;

type CategoryOption = TriviaCategory | 'all';

const CATEGORY_CONFIG: { key: CategoryOption; label: string; labelJp: string; emoji: string }[] = [
  { key: 'all', label: 'All Mix', labelJp: '一般', emoji: '🌟' },
  { key: 'culture', label: 'Culture', labelJp: '文化', emoji: '🎌' },
  { key: 'anime', label: 'Anime & Manga', labelJp: 'アニメ', emoji: '🎬' },
  { key: 'entertainment', label: 'Otaku Lore', labelJp: 'エンタメ', emoji: '🎮' },
];

const DIFFICULTY_CONFIG: { key: TriviaDifficulty; label: string; labelJp: string; stars: number }[] = [
  { key: 'beginner', label: 'Beginner', labelJp: '初級', stars: 1 },
  { key: 'intermediate', label: 'Intermediate', labelJp: '中級', stars: 2 },
  { key: 'advanced', label: 'Advanced', labelJp: '上級', stars: 3 },
];

export default function TriviaScreen() {
  const router = useRouter();
  const game = useGame();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [reinaExpression, setReinaExpression] = useState<ReinaExpression>('happy');
  const [triviaLang, setTriviaLang] = useState<'english' | 'japanese'>(game.settings.language);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const continueAnim = useRef(new Animated.Value(0)).current;

  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(Array.from({ length: 4 }, () => new Animated.Value(0))).current;
  const categoryAnim = useRef(new Animated.Value(0)).current;
  const explanationAnim = useRef(new Animated.Value(0)).current;

  const isJp = triviaLang === 'japanese';

  useEffect(() => {
    Animated.timing(categoryAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const currentQuestion = questions[currentIndex];

  const startTrivia = useCallback((category: CategoryOption) => {
    setSelectedCategory(category);
    const q = getRandomTrivia(ROUND_SIZE, category, game.settings.difficulty, usedIds);
    setQuestions(q);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setTotalCoins(0);
    setIsFinished(false);
    setGameStarted(true);
    setShowExplanation(false);
    setReinaExpression('thinking');
    animateIn();
  }, [usedIds, game.settings.difficulty]);

  useEffect(() => {
    if (selectedCategory && currentIndex > 0) {
      animateIn();
    }
  }, [currentIndex]);

  const animateIn = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    explanationAnim.setValue(0);
    optionAnims.forEach(a => a.setValue(0));

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ...optionAnims.map((anim, i) =>
        Animated.timing(anim, { toValue: 1, duration: 300, delay: 150 + i * 80, useNativeDriver: true })
      ),
    ]).start();
  }, [fadeAnim, slideAnim, optionAnims, explanationAnim]);

  const showExplanationAnim = useCallback(() => {
    setShowExplanation(true);
    explanationAnim.setValue(0);
    Animated.timing(explanationAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [explanationAnim]);

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setTotalCoins(prev => prev + currentQuestion.coinReward);
      game.addCoins(currentQuestion.coinReward);
      game.addXp(5);
      game.incrementTrivia();
      setReinaExpression('happy');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setReinaExpression('concerned');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    showExplanationAnim();
    setShowContinueBtn(true);
    continueAnim.setValue(0);
    Animated.timing(continueAnim, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }).start();

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [selectedAnswer, currentQuestion, currentIndex, questions, game, correctCount, showExplanationAnim, continueAnim]);

  const handleContinue = useCallback(() => {
    setShowContinueBtn(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < questions.length - 1) {
      setSelectedAnswer(null);
      setShowExplanation(false);
      setCurrentIndex(prev => prev + 1);
      setReinaExpression('thinking');
    } else {
      setIsFinished(true);
      setUsedIds(prev => [...prev, ...questions.map(q => q.id)]);
      setReinaExpression(correctCount >= 5 ? 'proud' : correctCount >= 3 ? 'happy' : correctCount >= 2 ? 'smirk' : 'concerned');
    }
  }, [currentIndex, questions, correctCount]);

  const getOptionStyle = useCallback((index: number) => {
    const base = [styles.option, { backgroundColor: colors.cardGlass, borderColor: colors.border }] as any[];
    if (selectedAnswer === null) return base;
    if (index === currentQuestion?.correctIndex) return [...base, { borderColor: colors.success, backgroundColor: colors.successLight }];
    if (index === selectedAnswer && index !== currentQuestion?.correctIndex) return [...base, { borderColor: colors.error, backgroundColor: colors.errorLight }];
    return [...base, styles.optionDimmed];
  }, [selectedAnswer, currentQuestion, colors]);

  const diffLabel = useMemo(() => {
    const d = DIFFICULTY_CONFIG.find(dc => dc.key === game.settings.difficulty);
    return isJp ? (d?.labelJp ?? '') : (d?.label ?? '');
  }, [game.settings.difficulty, isJp]);

  const catLabel = useMemo(() => {
    if (!selectedCategory) return '';
    const c = CATEGORY_CONFIG.find(cc => cc.key === selectedCategory);
    return isJp ? (c?.labelJp ?? '') : (c?.label ?? '');
  }, [selectedCategory, isJp]);

  const catColor = useMemo(() => {
    const idx = CATEGORY_CONFIG.findIndex(c => c.key === selectedCategory);
    const catColors = [colors.sakuraPink, colors.warning, colors.lavender, colors.success];
    return catColors[idx] ?? colors.sakuraPink;
  }, [selectedCategory, colors]);

  const langToggle = (
    <TouchableOpacity
      style={[styles.langToggle, { backgroundColor: colors.lavenderLight }]}
      onPress={() => {
        setTriviaLang(prev => prev === 'english' ? 'japanese' : 'english');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      activeOpacity={0.7}
    >
      <Globe size={14} color={colors.lavenderDark} />
      <Text style={[styles.langToggleText, { color: colors.lavenderDark }]}>{isJp ? 'JP' : 'EN'}</Text>
    </TouchableOpacity>
  );

  if (!gameStarted) {
    const catColors = [colors.sakuraPink, colors.warning, colors.lavender, colors.success];
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: isJp ? 'トリビア' : 'Trivia', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
        <FloralOverlay />
        <ScrollView contentContainerStyle={[styles.categoryScreen, { paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.categoryHeader, { opacity: categoryAnim, transform: [{ translateY: categoryAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <ReinaCharacter expression="happy" size="medium" enableFloat={true} />
            <View style={[styles.categorySpeech, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
              <Text style={[styles.categorySpeechText, { color: colors.text }]}>
                {isJp ? 'カテゴリを選んでね！🌸' : 'Choose your trivia arena! Each one drops different loot~ 🌸'}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>{isJp ? 'カテゴリ' : 'Category'}</Text>
            {langToggle}
          </View>

          <View style={styles.categoryGrid}>
            {CATEGORY_CONFIG.map((cat, idx) => {
              const cc = catColors[idx];
              return (
                <Animated.View key={cat.key} style={{ opacity: categoryAnim, transform: [{ translateY: categoryAnim.interpolate({ inputRange: [0, 1], outputRange: [30 + idx * 10, 0] }) }] }}>
                  <TouchableOpacity
                    style={[styles.categoryCard, { backgroundColor: colors.widgetBg, borderColor: selectedCategory === cat.key ? colors.sakuraPink : colors.widgetBorder }]}
                    onPress={() => {
                      setSelectedCategory(cat.key);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryIconCircle, { backgroundColor: cc + '20' }]}>
                      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    </View>
                    <View style={styles.categoryTextArea}>
                      <Text style={[styles.categoryLabel, { color: colors.text }]}>{isJp ? cat.labelJp : cat.label}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {selectedCategory && (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => startTrivia(selectedCategory)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={[colors.sakuraPink, colors.sakuraPinkDark]} style={styles.startBtnGrad}>
                <Text style={styles.startBtnText}>{isJp ? 'スタート！' : 'Begin Challenge!'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  if (isFinished) {
    const finalCorrect = correctCount;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: isJp ? '結果' : 'Results', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
        <FloralOverlay />
        <View style={styles.resultScreen}>
          <View style={[styles.resultCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
            <ReinaCharacter expression={reinaExpression} size="small" enableFloat={false} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              {finalCorrect >= 5
                ? (isJp ? 'すごい！' : 'S-Rank! Sasuga~!')
                : finalCorrect >= 3
                  ? (isJp ? 'いいね！' : 'Nice Combo!')
                  : finalCorrect >= 2
                    ? (isJp ? 'まあまあ！' : 'Not Bad!')
                    : (isJp ? 'がんばって！' : 'Power Through!')}
            </Text>
            <Text style={[styles.resultScore, { color: colors.textLight }]}>{finalCorrect}/{questions.length} {isJp ? '正解' : 'correct'}</Text>
            <Text style={[styles.resultCoins, { color: colors.gold }]}>+{totalCoins} 🪙 {isJp ? '獲得' : 'earned'}</Text>

            <View style={styles.resultMeta}>
              <View style={[styles.resultMetaChip, { backgroundColor: colors.lavenderLight }]}>
                <Text style={[styles.resultMetaText, { color: colors.lavenderDark }]}>{catLabel}</Text>
              </View>
              <View style={[styles.resultMetaChip, { backgroundColor: colors.lavenderLight }]}>
                <Text style={[styles.resultMetaText, { color: colors.lavenderDark }]}>{diffLabel}</Text>
              </View>
            </View>

            <View style={styles.resultDots}>
              {questions.map((_, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i < finalCorrect ? colors.success : colors.error }]} />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.resultBtn, { backgroundColor: colors.sakuraPink }]}
              onPress={() => {
                setSelectedCategory(null);
                setGameStarted(false);
                setReinaExpression('happy');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.resultBtnText}>{isJp ? 'もう一度' : 'Rematch!'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resultBackBtn, { backgroundColor: colors.lavenderLight }]} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={[styles.resultBackText, { color: colors.lavenderDark }]}>{isJp ? 'メニューに戻る' : 'Return to Base'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: isJp ? 'トリビア' : 'Trivia', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <Text style={[styles.errorText, { color: colors.textMuted }]}>{isJp ? '読み込み中...' : 'Loading...'}</Text>
      </View>
    );
  }

  const questionText = isJp ? currentQuestion.questionJp : currentQuestion.question;
  const options = isJp ? currentQuestion.optionsJp : currentQuestion.options;
  const explanationText = isJp ? currentQuestion.explanationJp : currentQuestion.explanation;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: isJp ? 'トリビア' : 'Trivia', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />

      <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, { paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.progressRow}>
            {questions.map((_, i) => (
              <View key={i} style={[styles.progressDot, { backgroundColor: colors.border }, i === currentIndex && { backgroundColor: colors.sakuraPink }, i < currentIndex && { backgroundColor: colors.success }]} />
            ))}
          </View>
          {langToggle}
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.metaChip, { backgroundColor: catColor + '20' }]}>
            <Text style={[styles.metaChipText, { color: colors.text }]}>{catLabel}</Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: colors.lavenderLight }]}>
            <Text style={[styles.metaChipText, { color: colors.text }]}>{diffLabel}</Text>
          </View>
        </View>

        <View style={styles.reinaQuestionRow}>
          <ReinaCharacter expression={reinaExpression} size="small" enableFloat={false} />
        </View>

        <Animated.View style={[styles.questionCard, { backgroundColor: colors.cardGlass, borderColor: colors.border, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.questionNumber, { color: colors.textMuted }]}>
            {isJp ? `問題 ${currentIndex + 1}/${questions.length}` : `Question ${currentIndex + 1}/${questions.length}`}
          </Text>
          <Text style={[styles.questionText, { color: colors.text }]}>{questionText}</Text>
        </Animated.View>

        <View style={styles.optionsGrid}>
          {options.map((option, i) => (
            <Animated.View key={i} style={{ opacity: optionAnims[i] ?? new Animated.Value(1), transform: [{ translateY: (optionAnims[i] ?? new Animated.Value(1)).interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
              <TouchableOpacity
                style={getOptionStyle(i)}
                onPress={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                activeOpacity={0.7}
              >
                <View style={[styles.optionLetter, { backgroundColor: colors.lavenderLight }]}>
                  <Text style={[styles.optionLetterText, { color: colors.lavenderDark }]}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
                {selectedAnswer !== null && i === currentQuestion.correctIndex && (
                  <Text style={[styles.checkMark, { color: colors.success }]}>✓</Text>
                )}
                {selectedAnswer === i && i !== currentQuestion.correctIndex && (
                  <Text style={[styles.crossMark, { color: colors.error }]}>✗</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {showExplanation && (
          <Animated.View style={[styles.explanationCard, { backgroundColor: colors.goldLight, borderColor: colors.gold + '30', opacity: explanationAnim, transform: [{ translateY: explanationAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
            <Text style={[styles.explanationLabel, { color: colors.warning }]}>{isJp ? '解説' : 'Explanation'}</Text>
            <Text style={[styles.explanationText, { color: colors.text }]}>{explanationText}</Text>
          </Animated.View>
        )}

        {showContinueBtn && (
          <Animated.View style={[styles.continueRow, { opacity: continueAnim, transform: [{ translateY: continueAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
            <TouchableOpacity
              style={[styles.continueBtn, { backgroundColor: colors.sakuraPink }]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueBtnText}>{isJp ? '次へ' : 'Continue'}</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.scoreRow}>
          <Text style={[styles.scoreInfo, { color: colors.textLight }]}>{correctCount} {isJp ? '正解' : 'correct'} · +{totalCoins} 🪙</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 18, paddingBottom: 40 },
  errorText: { textAlign: 'center', marginTop: 100, fontSize: 16 },
  categoryScreen: { padding: 18, paddingBottom: 40 },
  categoryHeader: { alignItems: 'center', marginBottom: 20 },
  categorySpeech: { borderRadius: 16, padding: 14, marginTop: 12, width: '100%', borderWidth: 1 },
  categorySpeechText: { fontSize: 15, textAlign: 'center', fontWeight: '500' as const, lineHeight: 22 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  categoryTitle: { fontSize: 18, fontWeight: '800' as const },
  categoryGrid: { gap: 10 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1.5, gap: 14 },
  categoryIconCircle: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryTextArea: { flex: 1 },
  categoryEmoji: { fontSize: 26 },
  categoryLabel: { fontSize: 16, fontWeight: '700' as const },
  categoryCount: { fontSize: 12, fontWeight: '500' as const, marginTop: 2 },
  startBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  startBtnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' as const, letterSpacing: 0.5 },
  langToggle: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  langToggleText: { fontSize: 13, fontWeight: '700' as const },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 4 },
  progressRow: { flexDirection: 'row', gap: 5, flex: 1, marginRight: 12 },
  progressDot: { flex: 1, height: 6, borderRadius: 3 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metaChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  metaChipText: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.5 },
  reinaQuestionRow: { alignItems: 'center', marginBottom: 12 },
  questionCard: { borderRadius: 20, padding: 22, marginBottom: 20, borderWidth: 1 },
  questionNumber: { fontSize: 12, fontWeight: '600' as const, marginBottom: 8 },
  questionText: { fontSize: 17, fontWeight: '700' as const, lineHeight: 26 },
  optionsGrid: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, borderWidth: 1.5, gap: 12 },
  optionDimmed: { opacity: 0.5 },
  optionLetter: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 14, fontWeight: '700' as const },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600' as const },
  checkMark: { fontSize: 18, fontWeight: '700' as const },
  crossMark: { fontSize: 18, fontWeight: '700' as const },
  explanationCard: { borderRadius: 14, padding: 16, marginTop: 14, borderWidth: 1 },
  explanationLabel: { fontSize: 12, fontWeight: '800' as const, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 4 },
  explanationText: { fontSize: 14, fontWeight: '500' as const, lineHeight: 21 },
  scoreRow: { alignItems: 'center', marginTop: 16 },
  scoreInfo: { fontSize: 14, fontWeight: '600' as const },
  continueRow: { alignItems: 'center', marginTop: 18 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  resultScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', borderWidth: 1 },
  resultTitle: { fontSize: 24, fontWeight: '800' as const, marginTop: 12, marginBottom: 6 },
  resultScore: { fontSize: 16, fontWeight: '600' as const },
  resultCoins: { fontSize: 20, fontWeight: '700' as const, marginBottom: 12 },
  resultMeta: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  resultMetaChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  resultMetaText: { fontSize: 12, fontWeight: '600' as const },
  resultDots: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  resultBtn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14, width: '100%', alignItems: 'center', marginBottom: 10 },
  resultBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  resultBackBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  resultBackText: { fontSize: 14, fontWeight: '600' as const },
});
