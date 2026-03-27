import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Home } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ReinaCharacter } from '@/components/ReinaCharacter';
import type { ReinaExpression } from '@/constants/reina';
import { FloralOverlay } from '@/components/FloralOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = 6;

interface WordPair {
  jp: string;
  en: string;
  kanji?: string;
}

const WORD_PAIRS: WordPair[] = [
  { jp: '山', en: 'Mountain', kanji: '山' },
  { jp: '川', en: 'River', kanji: '川' },
  { jp: '火', en: 'Fire', kanji: '火' },
  { jp: '水', en: 'Water', kanji: '水' },
  { jp: '木', en: 'Tree', kanji: '木' },
  { jp: '月', en: 'Moon', kanji: '月' },
  { jp: '日', en: 'Sun', kanji: '日' },
  { jp: '花', en: 'Flower', kanji: '花' },
  { jp: '星', en: 'Star', kanji: '星' },
  { jp: '雪', en: 'Snow', kanji: '雪' },
  { jp: '風', en: 'Wind', kanji: '風' },
  { jp: '雨', en: 'Rain', kanji: '雨' },
  { jp: '空', en: 'Sky', kanji: '空' },
  { jp: '海', en: 'Sea', kanji: '海' },
  { jp: '心', en: 'Heart', kanji: '心' },
  { jp: '夢', en: 'Dream', kanji: '夢' },
  { jp: '愛', en: 'Love', kanji: '愛' },
  { jp: '力', en: 'Power', kanji: '力' },
  { jp: '光', en: 'Light', kanji: '光' },
  { jp: '音', en: 'Sound', kanji: '音' },
];

type MatchCard = {
  id: string;
  pairIndex: number;
  isJp: boolean;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
  flipAnim: Animated.Value;
};

const PAIRS_COUNT = 8;
const GAME_DURATION = 60;

function createCards(): MatchCard[] {
  const shuffledPairs = [...WORD_PAIRS].sort(() => Math.random() - 0.5).slice(0, PAIRS_COUNT);
  const cards: MatchCard[] = [];
  shuffledPairs.forEach((pair, idx) => {
    cards.push({
      id: `jp-${idx}-${Date.now()}`,
      pairIndex: idx,
      isJp: true,
      text: pair.jp,
      isFlipped: false,
      isMatched: false,
      flipAnim: new Animated.Value(0),
    });
    cards.push({
      id: `en-${idx}-${Date.now()}`,
      pairIndex: idx,
      isJp: false,
      text: pair.en,
      isFlipped: false,
      isMatched: false,
      flipAnim: new Animated.Value(0),
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export default function MiniGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const { colors, isDark } = useTheme();
  const [cards, setCards] = useState<MatchCard[]>(() => createCards());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [reinaExpression, setReinaExpression] = useState<ReinaExpression>('happy');
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted) {
      Animated.timing(progressAnim, {
        toValue: timeLeft / GAME_DURATION,
        duration: 900,
        useNativeDriver: false,
      }).start();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && gameStarted) {
      setReinaExpression('concerned');
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (gameOver) {
      const coins = matchesFound * 8 + Math.max(0, (PAIRS_COUNT - attempts + matchesFound) * 2);
      if (coins > 0) {
        game.addCoins(coins);
        game.addXp(Math.floor(coins / 2));
      }
      game.incrementMiniGames();
      game.incrementMatchGames();
      if (matchesFound >= PAIRS_COUNT) { setReinaExpression('proud'); }
      else if (matchesFound >= PAIRS_COUNT / 2) { setReinaExpression('happy'); }
      else { setReinaExpression('smirk'); }
    }
  }, [gameOver]);

  useEffect(() => {
    if (matchesFound >= PAIRS_COUNT && gameStarted && !gameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameOver(true);
    }
  }, [matchesFound, gameStarted, gameOver]);

  const handleCardPress = useCallback((index: number) => {
    if (gameOver || !gameStarted || isProcessing) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    Animated.timing(newCards[index].flipAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setAttempts(prev => prev + 1);
      const [first, second] = newFlipped;
      const card1 = newCards[first];
      const card2 = newCards[second];

      if (card1.pairIndex === card2.pairIndex && card1.isJp !== card2.isJp) {
        setTimeout(() => {
          const matched = [...newCards];
          matched[first] = { ...matched[first], isMatched: true };
          matched[second] = { ...matched[second], isMatched: true };
          setCards(matched);
          setMatchesFound(prev => prev + 1);
          setScore(prev => prev + 20);
          setReinaExpression('happy');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setFlippedIndices([]);
          setIsProcessing(false);
          setTimeout(() => { if (timeLeft > 10) setReinaExpression('thinking'); }, 800);
        }, 500);
      } else {
        setReinaExpression('concerned');
        setTimeout(() => {
          const reset = [...newCards];
          reset[first] = { ...reset[first], isFlipped: false };
          reset[second] = { ...reset[second], isFlipped: false };
          Animated.parallel([
            Animated.timing(reset[first].flipAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            Animated.timing(reset[second].flipAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
          ]).start();
          setCards(reset);
          setFlippedIndices([]);
          setIsProcessing(false);
          setTimeout(() => { if (timeLeft > 10) setReinaExpression('thinking'); }, 400);
        }, 800);
      }
    }
  }, [cards, flippedIndices, gameOver, gameStarted, isProcessing, timeLeft]);

  const startGame = useCallback(() => {
    setCards(createCards());
    setScore(0);
    setMatchesFound(0);
    setAttempts(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setGameStarted(true);
    setFlippedIndices([]);
    setIsProcessing(false);
    setReinaExpression('thinking');
    progressAnim.setValue(1);
  }, [progressAnim]);

  const coinEarned = matchesFound * 8 + Math.max(0, (PAIRS_COUNT - attempts + matchesFound) * 2);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Word Match', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />

      {!gameStarted && !gameOver && (
        <View style={[styles.startScreen, { paddingTop: insets.top + 60 }]}>
          <ReinaCharacter expression="happy" size="medium" enableFloat={true} />
          <Text style={[styles.startTitle, { color: colors.text }]}>Word Match</Text>
          <Text style={[styles.startDesc, { color: colors.textLight }]}>Match Japanese words to their English meanings!{'\n'}Flip cards to find pairs. Sugoi~!</Text>
          <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.8}>
            <LinearGradient colors={[colors.sakuraPink, colors.lavender]} style={styles.startBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.startBtnText}>Begin Quest!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {gameStarted && !gameOver && (
        <View style={[styles.gameArea, { paddingTop: insets.top + 50 }]}>
          <View style={styles.gameHeader}>
            <View style={styles.reinaGameContainer}>
              <ReinaCharacter expression={reinaExpression} size="small" enableFloat={false} />
            </View>
            <View style={styles.gameStats}>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Matched</Text>
                <Text style={[styles.scoreValue, { color: colors.text }]}>{matchesFound}/{PAIRS_COUNT}</Text>
              </View>
              <View style={styles.timerBox}>
                <Text style={[styles.timerValue, { color: colors.text }]}>{timeLeft}s</Text>
                <View style={[styles.timerBarBg, { backgroundColor: isDark ? 'rgba(240,104,144,0.12)' : 'rgba(232,84,124,0.1)' }]}>
                  <Animated.View style={[styles.timerBarFill, {
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    backgroundColor: timeLeft <= 10 ? colors.error : colors.sakuraPink,
                  }]} />
                </View>
              </View>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Tries</Text>
                <Text style={[styles.scoreValue, { color: colors.text }]}>{attempts}</Text>
              </View>
            </View>
          </View>

          <View style={styles.gridWrapper}>
            <View style={[styles.matchGrid, { backgroundColor: isDark ? 'rgba(40,25,65,0.3)' : 'rgba(255,255,255,0.3)' }]}>
              {cards.map((card, idx) => {
                const isFlipped = card.isFlipped || card.isMatched;
                return (
                  <TouchableOpacity
                    key={card.id}
                    onPress={() => handleCardPress(idx)}
                    activeOpacity={0.7}
                    style={[
                      styles.matchCard,
                      {
                        backgroundColor: card.isMatched
                          ? colors.successLight
                          : isFlipped
                            ? (card.isJp ? colors.sakuraPinkLight : colors.lavenderLight)
                            : colors.cardGlass,
                        borderColor: card.isMatched
                          ? colors.success
                          : isFlipped
                            ? (card.isJp ? colors.sakuraPink : colors.lavender)
                            : colors.border,
                      },
                      card.isMatched && { opacity: 0.6 },
                    ]}
                  >
                    {isFlipped ? (
                      <>
                        <Text style={[
                          card.isJp ? styles.matchCardKanji : styles.matchCardEn,
                          { color: card.isMatched ? colors.success : colors.text },
                        ]}>
                          {card.text}
                        </Text>
                        <Text style={[styles.matchCardLabel, { color: colors.textMuted }]}>
                          {card.isJp ? 'JP' : 'EN'}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.matchCardHidden, { color: colors.textMuted }]}>?</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {gameOver && (
        <View style={styles.resultScreen}>
          <View style={[styles.resultCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
            <ReinaCharacter expression={reinaExpression} size="small" enableFloat={false} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              {matchesFound >= PAIRS_COUNT ? 'All Matched! Sugoi~!' : 'Time\'s Up!'}
            </Text>
            <Text style={[styles.resultScore, { color: colors.textLight }]}>{matchesFound}/{PAIRS_COUNT} pairs • {attempts} attempts</Text>
            <Text style={[styles.resultCoins, { color: colors.gold }]}>+{coinEarned} 🪙 earned</Text>
            <TouchableOpacity style={[styles.resultBtn, { backgroundColor: colors.sakuraPink }]} onPress={startGame} activeOpacity={0.8}>
              <Text style={styles.resultBtnText}>Rematch!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resultBackBtn, { backgroundColor: colors.lavenderLight }]} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={[styles.resultBackText, { color: colors.lavenderDark }]}>Return to Base</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  startScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  startTitle: { fontSize: 30, fontWeight: '800' as const, marginTop: 16, marginBottom: 8, letterSpacing: 0.5 },
  startDesc: { fontSize: 14, textAlign: 'center' as const, lineHeight: 20, marginBottom: 30 },
  startBtn: { borderRadius: 16, overflow: 'hidden' },
  startBtnGradient: { paddingHorizontal: 48, paddingVertical: 16, borderRadius: 16 },
  startBtnText: { fontSize: 18, fontWeight: '700' as const, color: '#fff' },
  gameArea: { flex: 1, paddingTop: 8 },
  gameHeader: { paddingHorizontal: 12, marginBottom: 8 },
  reinaGameContainer: { alignItems: 'center', marginBottom: 6 },
  gameStats: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreBox: { alignItems: 'center', flex: 1 },
  scoreLabel: { fontSize: 11, fontWeight: '500' as const },
  scoreValue: { fontSize: 18, fontWeight: '800' as const },
  timerBox: { flex: 2, alignItems: 'center' },
  timerValue: { fontSize: 22, fontWeight: '800' as const, marginBottom: 4 },
  timerBarBg: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
  timerBarFill: { height: '100%', borderRadius: 3 },
  comboBadge: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14, marginBottom: 8, borderWidth: 1 },
  comboText: { fontSize: 14, fontWeight: '700' as const },
  gridWrapper: { alignItems: 'center', paddingHorizontal: 16 },
  gridBoard: { borderRadius: 16, padding: 8, borderWidth: 1 },
  matchGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 8, borderRadius: 16, gap: 8 },
  matchCard: { width: (SCREEN_WIDTH - 80) / 4 - 6, height: (SCREEN_WIDTH - 80) / 4 + 8, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', padding: 4 },
  matchCardKanji: { fontSize: 28, fontWeight: '700' as const },
  matchCardEn: { fontSize: 13, fontWeight: '700' as const, textAlign: 'center' as const },
  matchCardLabel: { fontSize: 9, fontWeight: '600' as const, marginTop: 2 },
  matchCardHidden: { fontSize: 28, fontWeight: '700' as const },
  resultScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', borderWidth: 1 },
  resultTitle: { fontSize: 24, fontWeight: '800' as const, marginTop: 12, marginBottom: 8, letterSpacing: 0.3 },
  resultScore: { fontSize: 16, fontWeight: '600' as const, marginBottom: 4 },
  resultCoins: { fontSize: 20, fontWeight: '700' as const, marginBottom: 24 },
  resultBtn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14, marginBottom: 12, width: '100%', alignItems: 'center' },
  resultBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  resultBackBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  resultBackText: { fontSize: 14, fontWeight: '600' as const },
});
