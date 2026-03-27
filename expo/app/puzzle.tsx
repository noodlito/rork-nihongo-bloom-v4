import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated, Dimensions, Modal, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookmarkPlus, RotateCcw, Zap, ArrowRight, Globe, BookOpen, Eye, Ear, Filter, Check, X, Home, ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getMeaningDrillQuestion,
  getVocabQuestion,
  getReadingQuestion,
  TOPIC_LABELS,
  kanaToRomaji,
  type TopicTag,
  type VocabEntry,
  type MasterKanji,
} from '@/mocks/kanji-database';
import { ReinaCharacter } from '@/components/ReinaCharacter';
import type { ReinaExpression } from '@/constants/reina';
import { FloralOverlay } from '@/components/FloralOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type KanjiMode = 'meaning-drill' | 'vocabulary' | 'reading';
type VocabSubMode = 'word-to-meaning' | 'meaning-to-word';

const ROUND_SIZE = 8;

const ALL_TOPICS: TopicTag[] = [
  'personal_information', 'daily_life', 'home_environment', 'food_drink',
  'community', 'health_body', 'interests_hobbies', 'academic', 'communication',
];

export default function PuzzleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const { colors, isDark } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const optionAnims = useRef(Array.from({ length: 4 }, () => new Animated.Value(0))).current;
  const explanationAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const modeAnim = useRef(new Animated.Value(0)).current;

  const MODE_CONFIG: { key: KanjiMode; label: string; labelJp: string; emoji: string; desc: string; descJp: string; color: string }[] = [
    { key: 'meaning-drill', label: 'Meaning Drill', labelJp: '意味ドリル', emoji: '⚡', desc: 'Speed round • Rare kanji drops', descJp: '漢字の意味を素早くクイズ', color: colors.sakuraPink },
    { key: 'vocabulary', label: 'Vocabulary', labelJp: '語彙', emoji: '📚', desc: 'Unlock words • Build your deck', descJp: '単語と漢字を学ぶ', color: colors.gemBlue },
    { key: 'reading', label: 'Reading', labelJp: '読み方', emoji: '👁', desc: 'Match readings • Level up', descJp: '漢字の読み方を当てる', color: colors.success },
  ];

  const [selectedMode, setSelectedMode] = useState<KanjiMode | null>(null);
  const [vocabSubMode, setVocabSubMode] = useState<VocabSubMode>('word-to-meaning');
  const [selectedTopics, setSelectedTopics] = useState<TopicTag[]>([]);
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('kanji_selected_topics').then(val => {
      if (val) {
        try {
          const parsed = JSON.parse(val) as TopicTag[];
          setSelectedTopics(parsed);
        } catch {}
      }
      setTopicsLoaded(true);
    }).catch(() => setTopicsLoaded(true));
  }, []);

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [usedKanji, setUsedKanji] = useState<string[]>([]);
  const [usedVocabIds, setUsedVocabIds] = useState<string[]>([]);
  const [roundComplete, setRoundComplete] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<{
    prompt: string;
    promptSub?: string;
    pronunciation?: string;
    options: { text: string; isCorrect: boolean }[];
    explanation?: string;
    breakdown?: string;
  } | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reinaExpression, setReinaExpression] = useState<ReinaExpression>('happy');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const continueAnim = useRef(new Animated.Value(0)).current;

  const isJp = game.settings.language === 'japanese';
  const difficulty = game.settings.difficulty;

  useEffect(() => {
    Animated.timing(modeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const toggleTopic = useCallback((topic: TopicTag) => {
    setSelectedTopics(prev => {
      const next = prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic];
      AsyncStorage.setItem('kanji_selected_topics', JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const loadQuestion = useCallback(() => {
    if (questionsAnswered >= ROUND_SIZE) {
      const coins = correctCount * 15;
      const xp = correctCount * 5;
      if (coins > 0) {
        game.addCoins(coins);
        game.addXp(xp);
      }
      game.incrementKanji();
      setRoundComplete(true);
      setReinaExpression(correctCount >= 6 ? 'proud' : correctCount >= 3 ? 'happy' : 'concerned');
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true }).start();
      return;
    }

    let question: typeof currentQuestion = null;

    if (selectedMode === 'meaning-drill') {
      const result = getMeaningDrillQuestion(difficulty, usedKanji, isJp);
      if (result) {
        setUsedKanji(prev => [...prev, result.kanji.kanji]);
        const readingStr = result.kanji.kunyomi.length > 0
          ? `${result.kanji.kunyomi[0]} (${result.kanji.onyomi.join(', ')})`
          : result.kanji.onyomi.join(', ');
        const primaryKana = result.kanji.kunyomi[0] || result.kanji.onyomi[0] || '';
        const romaji = kanaToRomaji(primaryKana);
        question = {
          prompt: result.kanji.kanji,
          promptSub: isJp ? '意味を選んでください' : 'Choose the meaning',
          pronunciation: romaji ? `${primaryKana} (${romaji})` : '',
          options: result.options,
          explanation: isJp
            ? `${result.kanji.kanji} → ${result.kanji.meaningJp}\n読み: ${readingStr}\n発音: ${romaji}\n画数: ${result.kanji.strokeCount}`
            : `${result.kanji.kanji} → ${result.kanji.meaningEn}\nReadings: ${readingStr}\nPronunciation: ${romaji}\nStrokes: ${result.kanji.strokeCount}`,
        };
      }
    } else if (selectedMode === 'vocabulary') {
      const result = getVocabQuestion(difficulty, selectedTopics, usedVocabIds, vocabSubMode, isJp);
      if (result) {
        setUsedVocabIds(prev => [...prev, result.vocab.id]);
        const kanjiBreakdown = result.vocab.componentKanji.length > 0
          ? result.vocab.componentKanji.join(' + ')
          : result.vocab.word;
        const vocabRomaji = kanaToRomaji(result.vocab.reading);
        question = {
          prompt: result.question,
          promptSub: vocabSubMode === 'word-to-meaning'
            ? (isJp ? '意味を選んでください' : 'Choose the meaning')
            : (isJp ? '正しい単語を選んでください' : 'Choose the correct word'),
          pronunciation: vocabRomaji ? `${result.vocab.reading} (${vocabRomaji})` : '',
          options: result.options,
          explanation: isJp
            ? `${result.vocab.word} (${result.vocab.reading})\n${result.vocab.meaningJp}\n英語: ${result.vocab.meaningEn}\n漢字: ${kanjiBreakdown}`
            : `${result.vocab.word} (${result.vocab.reading})\n${result.vocab.meaningEn}\nPronunciation: ${vocabRomaji}\nKanji: ${kanjiBreakdown}`,
          breakdown: kanjiBreakdown,
        };
      }
    } else if (selectedMode === 'reading') {
      const result = getReadingQuestion(difficulty, selectedTopics, usedVocabIds);
      if (result) {
        setUsedVocabIds(prev => [...prev, result.vocab.id]);
        const readRomaji = kanaToRomaji(result.vocab.reading);
        question = {
          prompt: result.vocab.word,
          promptSub: isJp ? '正しい読み方を選んでください' : 'Choose the correct reading',
          pronunciation: readRomaji ? `${result.vocab.reading} (${readRomaji})` : '',
          options: result.options,
          explanation: isJp
            ? `${result.vocab.word} → ${result.vocab.reading}\n${result.vocab.meaningJp}\n英語: ${result.vocab.meaningEn}`
            : `${result.vocab.word} → ${result.vocab.reading}\n${result.vocab.meaningEn}\nPronunciation: ${readRomaji}`,
        };
      }
    }

    if (!question) {
      setUsedKanji([]);
      setUsedVocabIds([]);
      question = {
        prompt: '?',
        promptSub: isJp ? '問題を読み込めませんでした' : 'Could not load question',
        options: [],
      };
    }

    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setReinaExpression('thinking');
    animateIn();
  }, [selectedMode, difficulty, isJp, usedKanji, usedVocabIds, selectedTopics, vocabSubMode, questionsAnswered, correctCount, game, resultAnim]);

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

  const startGame = useCallback(() => {
    setGameStarted(true);
    setQuestionsAnswered(0);
    setCorrectCount(0);
    setScore(0);
    setUsedKanji([]);
    setUsedVocabIds([]);
    setRoundComplete(false);
    resultAnim.setValue(0);
  }, [resultAnim]);

  useEffect(() => {
    if (gameStarted && !roundComplete) {
      loadQuestion();
    }
  }, [gameStarted, questionsAnswered]);

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;
    setSelectedAnswer(index);

    const isCorrect = currentQuestion.options[index]?.isCorrect ?? false;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + 10);
      setReinaExpression('happy');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      game.incrementKanjiCorrect();
    } else {
      setReinaExpression('concerned');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const modeNames: Record<string, string> = { 'meaning-drill': 'Meaning Drill', 'vocabulary': 'Vocabulary', 'reading': 'Reading' };
      game.addMissedWord({
        word: currentQuestion.prompt,
        meaning: currentQuestion.explanation ?? '',
        reading: currentQuestion.promptSub,
        mode: modeNames[selectedMode ?? ''] ?? 'Kanji',
        missedAt: Date.now(),
      });
    }

    setShowExplanation(true);
    setShowContinueBtn(true);
    explanationAnim.setValue(0);
    continueAnim.setValue(0);
    Animated.timing(explanationAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    Animated.timing(continueAnim, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }).start();

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [selectedAnswer, currentQuestion, explanationAnim, continueAnim, game]);

  const handleContinue = useCallback(() => {
    setShowContinueBtn(false);
    setQuestionsAnswered(prev => prev + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleSaveWord = useCallback(() => {
    if (!currentQuestion) return;
    game.addToStudyList({
      word: currentQuestion.prompt,
      meaning: currentQuestion.explanation ?? '',
      addedAt: Date.now(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(isJp ? '保存しました' : 'Saved!', isJp ? 'スタディリストに追加しました' : 'Added to your study list.');
  }, [currentQuestion, game, isJp]);

  const handleNewRound = useCallback(() => {
    setGameStarted(false);
    setSelectedMode(null);
    setRoundComplete(false);
    setReinaExpression('happy');
    resultAnim.setValue(0);
    modeAnim.setValue(0);
    Animated.timing(modeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [resultAnim, modeAnim]);

  const getOptionStyle = useCallback((index: number) => {
    const base = [styles.option, { backgroundColor: colors.cardGlass, borderColor: colors.border }] as any[];
    if (selectedAnswer === null) return base;
    if (currentQuestion?.options[index]?.isCorrect) return [...base, { borderColor: colors.success, backgroundColor: colors.successLight }];
    if (index === selectedAnswer && !currentQuestion?.options[index]?.isCorrect) return [...base, { borderColor: colors.error, backgroundColor: colors.errorLight }];
    return [...base, styles.optionDimmed];
  }, [selectedAnswer, currentQuestion, colors]);

  const coinsEarned = correctCount * 15;

  const diffLabel = difficulty === 'beginner'
    ? (isJp ? '初級' : 'Beginner')
    : difficulty === 'intermediate'
      ? (isJp ? '中級' : 'Intermediate')
      : (isJp ? '上級' : 'Advanced');

  const modeLabel = selectedMode
    ? (isJp ? MODE_CONFIG.find(m => m.key === selectedMode)?.labelJp : MODE_CONFIG.find(m => m.key === selectedMode)?.label) ?? ''
    : '';

  if (!gameStarted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: isJp ? '漢字チャレンジ' : 'Kanji Challenge', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
        <FloralOverlay />
        <ScrollView contentContainerStyle={[styles.modeScreen, { paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.modeHeader, { opacity: modeAnim, transform: [{ translateY: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <ReinaCharacter expression="happy" size="medium" enableFloat={true} />
            <View style={[styles.modeSpeech, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
              <Text style={[styles.modeSpeechText, { color: colors.text }]}>
                {isJp ? 'モードを選んでね！📚' : 'Choose your battle mode! Which kanji will you conquer? 📚'}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{isJp ? 'モード' : 'Mode'}</Text>
            <View style={[styles.diffChip, { backgroundColor: colors.lavenderLight }]}>
              <Text style={[styles.diffChipText, { color: colors.lavenderDark }]}>{diffLabel}</Text>
            </View>
          </View>

          <View style={styles.modeGrid}>
            {MODE_CONFIG.map((mode, idx) => (
              <Animated.View key={mode.key} style={{ opacity: modeAnim, transform: [{ translateY: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [30 + idx * 10, 0] }) }] }}>
                <TouchableOpacity
                  style={[styles.modeCard, { backgroundColor: colors.widgetBg, borderColor: selectedMode === mode.key ? colors.sakuraPink : colors.widgetBorder }]}
                  onPress={() => {
                    setSelectedMode(mode.key);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.modeIconCircle, { backgroundColor: mode.color + '20' }]}>
                    <Text style={styles.modeEmoji}>{mode.emoji}</Text>
                  </View>
                  <View style={styles.modeTextArea}>
                    <Text style={[styles.modeLabel, { color: colors.text }]}>{isJp ? mode.labelJp : mode.label}</Text>
                    <Text style={[styles.modeDesc, { color: colors.textMuted }]}>{isJp ? mode.descJp : mode.desc}</Text>
                  </View>
                  {selectedMode === mode.key && (
                    <View style={[styles.modeCheck, { backgroundColor: mode.color }]}>
                      <Check size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {selectedMode === 'vocabulary' && (
            <View style={styles.vocabSubSection}>
              <Text style={[styles.subSectionTitle, { color: colors.textLight }]}>{isJp ? '出題形式' : 'Question Type'}</Text>
              <View style={styles.subModeRow}>
                <TouchableOpacity
                  style={[styles.subModeBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }, vocabSubMode === 'word-to-meaning' && { borderColor: colors.sakuraPink, backgroundColor: colors.sakuraPinkLight }]}
                  onPress={() => setVocabSubMode('word-to-meaning')}
                >
                  <Text style={[styles.subModeBtnText, { color: colors.textMuted }, vocabSubMode === 'word-to-meaning' && { color: colors.sakuraPinkDark }]}>
                    {isJp ? '単語→意味' : 'Word → Meaning'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.subModeBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }, vocabSubMode === 'meaning-to-word' && { borderColor: colors.sakuraPink, backgroundColor: colors.sakuraPinkLight }]}
                  onPress={() => setVocabSubMode('meaning-to-word')}
                >
                  <Text style={[styles.subModeBtnText, { color: colors.textMuted }, vocabSubMode === 'meaning-to-word' && { color: colors.sakuraPinkDark }]}>
                    {isJp ? '意味→単語' : 'Meaning → Word'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {selectedMode && (
            <View style={styles.topicSection}>
              <View style={styles.topicHeader}>
                <Text style={[styles.subSectionTitle, { color: colors.textLight }]}>{isJp ? 'トピック' : 'Topics'}</Text>
                <TouchableOpacity onPress={() => setShowTopicFilter(true)} style={[styles.filterBtn, { backgroundColor: colors.lavenderLight }]}>
                  <Filter size={14} color={colors.lavenderDark} />
                  <Text style={[styles.filterBtnText, { color: colors.lavenderDark }]}>
                    {selectedTopics.length === 0
                      ? (isJp ? '全て' : 'All')
                      : `${selectedTopics.length} ${isJp ? '選択中' : 'selected'}`}
                  </Text>
                </TouchableOpacity>
              </View>
              {selectedTopics.length > 0 && (
                <View style={styles.topicChips}>
                  {selectedTopics.map(t => (
                    <View key={t} style={[styles.topicChip, { backgroundColor: colors.sakuraPinkLight }]}>
                      <Text style={[styles.topicChipText, { color: colors.sakuraPinkDark }]}>{isJp ? TOPIC_LABELS[t].jp : TOPIC_LABELS[t].en}</Text>
                      <TouchableOpacity onPress={() => toggleTopic(t)}>
                        <X size={12} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {selectedMode && (
            <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.8}>
              <LinearGradient colors={[colors.sakuraPink, colors.sakuraPinkDark]} style={styles.startBtnGrad}>
                <Text style={styles.startBtnText}>{isJp ? 'スタート！' : 'Begin Quest!'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>

        <Modal visible={showTopicFilter} animationType="slide" transparent>
          <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.topicModal, { backgroundColor: isDark ? colors.card : '#FFFFFF' }]}>
              <View style={[styles.topicModalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.topicModalTitle, { color: colors.text }]}>{isJp ? 'トピックを選択' : 'Select Topics'}</Text>
                <TouchableOpacity onPress={() => setShowTopicFilter(false)}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.topicModalList}>
                {ALL_TOPICS.map(topic => (
                  <TouchableOpacity
                    key={topic}
                    style={[styles.topicRow, selectedTopics.includes(topic) && { backgroundColor: colors.sakuraPinkLight }]}
                    onPress={() => toggleTopic(topic)}
                  >
                    <Text style={[styles.topicRowText, { color: colors.text }, selectedTopics.includes(topic) && { color: colors.sakuraPinkDark }]}>
                      {isJp ? TOPIC_LABELS[topic].jp : TOPIC_LABELS[topic].en}
                    </Text>
                    {selectedTopics.includes(topic) && <Check size={16} color={colors.sakuraPink} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={[styles.topicModalActions, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.topicClearBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                  onPress={() => setSelectedTopics([])}
                >
                  <Text style={[styles.topicClearText, { color: colors.textLight }]}>{isJp ? '全解除' : 'Clear All'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.topicDoneBtn, { backgroundColor: colors.sakuraPink }]}
                  onPress={() => setShowTopicFilter(false)}
                >
                  <Text style={styles.topicDoneText}>{isJp ? '完了' : 'Done'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (roundComplete) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: isJp ? '結果' : 'Results', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
        <FloralOverlay />
        <Animated.View style={[styles.resultScreen, { opacity: resultAnim, transform: [{ scale: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
          <View style={[styles.resultCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
            <ReinaCharacter expression={reinaExpression} size="small" enableFloat={false} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              {correctCount >= 6 ? (isJp ? 'すばらしい！' : 'S-Rank! Sugoi!') : correctCount >= 3 ? (isJp ? 'いいね！' : 'Nice Combo!') : (isJp ? 'がんばって！' : 'Power Through!')}
            </Text>
            <Text style={[styles.resultScore, { color: colors.textLight }]}>{correctCount}/{ROUND_SIZE} {isJp ? '正解' : 'correct'}</Text>
            <Text style={[styles.resultCoins, { color: colors.gold }]}>+{coinsEarned} 🪙 {isJp ? '獲得' : 'earned'}</Text>

            <View style={styles.resultMeta}>
              <View style={[styles.resultMetaChip, { backgroundColor: colors.lavenderLight }]}>
                <Text style={[styles.resultMetaText, { color: colors.lavenderDark }]}>{modeLabel}</Text>
              </View>
              <View style={[styles.resultMetaChip, { backgroundColor: colors.lavenderLight }]}>
                <Text style={[styles.resultMetaText, { color: colors.lavenderDark }]}>{diffLabel}</Text>
              </View>
            </View>

            <View style={styles.resultDots}>
              {Array.from({ length: ROUND_SIZE }).map((_, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i < correctCount ? colors.success : colors.error }]} />
              ))}
            </View>

            <TouchableOpacity style={[styles.resultBtn, { backgroundColor: colors.sakuraPink }]} onPress={handleNewRound} activeOpacity={0.8}>
              <Text style={styles.resultBtnText}>{isJp ? 'もう一度' : 'Rematch!'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.lavenderLight }]} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={[styles.backBtnText, { color: colors.lavenderDark }]}>{isJp ? 'メニューに戻る' : 'Return to Base'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (!currentQuestion || currentQuestion.options.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: isJp ? '漢字チャレンジ' : 'Kanji Challenge', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true }} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>{isJp ? '読み込み中...' : 'Loading...'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{
        title: isJp ? '漢字チャレンジ' : 'Kanji Challenge',
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTransparent: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => setShowLeaveModal(true)} style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 8 }}>
            <ChevronLeft size={22} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: 16 }}>{isJp ? '戻る' : 'Back'}</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}>
            <Home size={22} color={colors.text} />
          </TouchableOpacity>
        ),
      }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />

      <ScrollView ref={scrollRef} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20, paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.progressRow}>
            {Array.from({ length: ROUND_SIZE }).map((_, i) => (
              <View key={i} style={[styles.progressDot, { backgroundColor: colors.border }, i === questionsAnswered && { backgroundColor: colors.sakuraPink }, i < questionsAnswered && { backgroundColor: colors.success }]} />
            ))}
          </View>
          <View style={[styles.scoreChip, { backgroundColor: colors.goldLight }]}>
            <Zap size={14} color={colors.gold} />
            <Text style={[styles.scoreText, { color: colors.text }]}>{score}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.metaChip, { backgroundColor: (MODE_CONFIG.find(m => m.key === selectedMode)?.color ?? colors.sakuraPink) + '20' }]}>
            <Text style={[styles.metaChipText, { color: colors.text }]}>{modeLabel}</Text>
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
            {isJp ? `問題 ${questionsAnswered + 1}/${ROUND_SIZE}` : `Question ${questionsAnswered + 1}/${ROUND_SIZE}`}
          </Text>
          {currentQuestion.promptSub && (
            <Text style={[styles.questionSub, { color: colors.textLight }]}>{currentQuestion.promptSub}</Text>
          )}
          <Text style={[styles.questionPrompt, { color: colors.text }, selectedMode === 'meaning-drill' && styles.questionPromptLarge]}>
            {currentQuestion.prompt}
          </Text>
          {currentQuestion.pronunciation ? (
            <Text style={[styles.pronunciationText, { color: colors.textMuted }]}>{currentQuestion.pronunciation}</Text>
          ) : null}
        </Animated.View>

        <View style={styles.optionsGrid}>
          {currentQuestion.options.map((option, i) => (
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
                <Text style={[styles.optionText, { color: colors.text }]}>{option.text}</Text>
                {selectedAnswer !== null && option.isCorrect && (
                  <Text style={[styles.checkMark, { color: colors.success }]}>✓</Text>
                )}
                {selectedAnswer === i && !option.isCorrect && (
                  <Text style={[styles.crossMark, { color: colors.error }]}>✗</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {showExplanation && currentQuestion.explanation && (
          <Animated.View style={[styles.explanationCard, { backgroundColor: colors.goldLight, borderColor: colors.gold + '30', opacity: explanationAnim, transform: [{ translateY: explanationAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
            <Text style={[styles.explanationLabel, { color: colors.warning }]}>{isJp ? '解説' : 'Explanation'}</Text>
            <Text style={[styles.explanationText, { color: colors.text }]}>{currentQuestion.explanation}</Text>
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

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }]} onPress={handleSaveWord}>
            <BookmarkPlus size={16} color={colors.sakuraPink} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>{isJp ? '保存' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scoreRow}>
          <Text style={[styles.scoreInfo, { color: colors.textLight }]}>{correctCount} {isJp ? '正解' : 'correct'} · +{score} 🪙</Text>
        </View>
      </ScrollView>

      <Modal visible={showLeaveModal} animationType="fade" transparent>
        <View style={[styles.leaveModalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.leaveModal, { backgroundColor: isDark ? colors.card : '#FFFFFF' }]}>
            <Text style={[styles.leaveTitle, { color: colors.text }]}>{isJp ? '漢字チャレンジを終了？' : 'Leave Kanji Challenge?'}</Text>
            <Text style={[styles.leaveMessage, { color: colors.textLight }]}>{isJp ? 'このラウンドの進捗は保存されません。' : 'Progress for this round will not be saved.'}</Text>
            <View style={styles.leaveActions}>
              <TouchableOpacity
                style={[styles.leaveCancelBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                onPress={() => setShowLeaveModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.leaveCancelText, { color: colors.text }]}>{isJp ? 'キャンセル' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.leaveConfirmBtn, { backgroundColor: colors.error }]}
                onPress={() => {
                  setShowLeaveModal(false);
                  setGameStarted(false);
                  setSelectedMode(null);
                  setRoundComplete(false);
                  setReinaExpression('happy');
                  resultAnim.setValue(0);
                  modeAnim.setValue(0);
                  Animated.timing(modeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.leaveConfirmText}>{isJp ? '終了する' : 'Leave'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modeScreen: { padding: 18, paddingBottom: 40 },
  modeHeader: { alignItems: 'center', marginBottom: 20 },
  modeSpeech: { borderRadius: 16, padding: 14, marginTop: 12, width: '100%', borderWidth: 1 },
  modeSpeechText: { fontSize: 15, textAlign: 'center', fontWeight: '500' as const, lineHeight: 22 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const },
  diffChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  diffChipText: { fontSize: 12, fontWeight: '700' as const },
  modeGrid: { gap: 10 },
  modeCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1.5, gap: 14 },
  modeIconCircle: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modeEmoji: { fontSize: 30 },
  modeTextArea: { flex: 1 },
  modeLabel: { fontSize: 16, fontWeight: '700' as const },
  modeDesc: { fontSize: 12, fontWeight: '500' as const, marginTop: 2 },
  modeCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  vocabSubSection: { marginTop: 16 },
  subSectionTitle: { fontSize: 14, fontWeight: '700' as const, marginBottom: 8 },
  subModeRow: { flexDirection: 'row', gap: 8 },
  subModeBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5 },
  subModeBtnText: { fontSize: 13, fontWeight: '600' as const },
  topicSection: { marginTop: 16 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  filterBtnText: { fontSize: 12, fontWeight: '600' as const },
  topicChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  topicChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  topicChipText: { fontSize: 11, fontWeight: '600' as const },
  startBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  startBtnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' as const, letterSpacing: 0.5 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  topicModal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  topicModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1 },
  topicModalTitle: { fontSize: 18, fontWeight: '800' as const },
  topicModalList: { padding: 12 },
  topicRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, marginBottom: 4 },
  topicRowText: { fontSize: 15, fontWeight: '600' as const },
  topicModalActions: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1 },
  topicClearBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  topicClearText: { fontSize: 14, fontWeight: '600' as const },
  topicDoneBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  topicDoneText: { fontSize: 14, fontWeight: '700' as const, color: '#fff' },
  scrollContent: { padding: 16 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, fontWeight: '500' as const },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  progressRow: { flexDirection: 'row', gap: 5, flex: 1, marginRight: 12 },
  progressDot: { flex: 1, height: 6, borderRadius: 3 },
  scoreChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  scoreText: { fontSize: 14, fontWeight: '700' as const },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metaChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  metaChipText: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.5 },
  reinaQuestionRow: { alignItems: 'center', marginBottom: 12 },
  questionCard: { borderRadius: 20, padding: 22, marginBottom: 20, borderWidth: 1, alignItems: 'center' },
  questionNumber: { fontSize: 12, fontWeight: '600' as const, marginBottom: 4 },
  questionSub: { fontSize: 13, fontWeight: '500' as const, marginBottom: 8 },
  questionPrompt: { fontSize: 20, fontWeight: '700' as const, textAlign: 'center', lineHeight: 30 },
  questionPromptLarge: { fontSize: 56, lineHeight: 68 },
  pronunciationText: { fontSize: 14, fontWeight: '500' as const, marginTop: 6, letterSpacing: 0.3 },
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
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontSize: 13, fontWeight: '600' as const },
  scoreRow: { alignItems: 'center', marginTop: 14 },
  scoreInfo: { fontSize: 14, fontWeight: '600' as const },
  continueRow: { alignItems: 'center', marginTop: 18 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  leaveModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  leaveModal: { borderRadius: 20, padding: 24, width: '85%', alignItems: 'center' },
  leaveTitle: { fontSize: 18, fontWeight: '800' as const, marginBottom: 8, textAlign: 'center' },
  leaveMessage: { fontSize: 14, fontWeight: '500' as const, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  leaveActions: { flexDirection: 'row', gap: 12, width: '100%' },
  leaveCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  leaveCancelText: { fontSize: 14, fontWeight: '600' as const },
  leaveConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  leaveConfirmText: { color: '#fff', fontSize: 14, fontWeight: '700' as const },
  resultScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', borderWidth: 1 },
  resultTitle: { fontSize: 24, fontWeight: '800' as const, marginTop: 12, marginBottom: 6 },
  resultScore: { fontSize: 16, fontWeight: '600' as const },
  resultCoins: { fontSize: 20, fontWeight: '700' as const, marginBottom: 12 },
  resultMeta: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  resultMetaChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  resultMetaText: { fontSize: 12, fontWeight: '600' as const },
  resultDots: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  resultBtn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14, marginBottom: 10, width: '100%', alignItems: 'center' },
  resultBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  backBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  backBtnText: { fontSize: 14, fontWeight: '600' as const },
});
