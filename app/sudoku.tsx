import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, ScrollView, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RotateCcw, Eraser, Lightbulb, Play, HelpCircle, Eye, X, Home, Grid2X2, Grid3X3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ReinaCharacter } from '@/components/ReinaCharacter';
import type { ReinaExpression } from '@/constants/reina';
import { FloralOverlay } from '@/components/FloralOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SudokuSize = 4 | 9;

const KANJI_NUMERALS: Record<number, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
  6: '六', 7: '七', 8: '八', 9: '九',
};

type SudokuCell = {
  value: number;
  isGiven: boolean;
  isWrong: boolean;
};

function generateSudoku(difficulty: string, size: SudokuSize): { puzzle: number[][]; solution: number[][] } {
  const solution = createSolvedGrid(size);
  const puzzle = solution.map(row => [...row]);
  let removals: number;
  if (size === 4) {
    removals = difficulty === 'beginner' ? 6 : difficulty === 'intermediate' ? 8 : 10;
  } else {
    removals = difficulty === 'beginner' ? 30 : difficulty === 'intermediate' ? 40 : 50;
  }
  const positions: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(removals, positions.length); i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = 0;
  }
  return { puzzle, solution };
}

function createSolvedGrid(size: SudokuSize): number[][] {
  const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  fillGrid(grid, size);
  return grid;
}

function fillGrid(grid: number[][], size: SudokuSize): boolean {
  const boxSize = size === 4 ? 2 : 3;
  const nums = Array.from({ length: size }, (_, i) => i + 1);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) {
        const shuffled = shuffle(nums);
        for (const num of shuffled) {
          if (isValid(grid, r, c, num, size, boxSize)) {
            grid[r][c] = num;
            if (fillGrid(grid, size)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid: number[][], row: number, col: number, num: number, size: number, boxSize: number): boolean {
  for (let c = 0; c < size; c++) { if (grid[row][c] === num) return false; }
  for (let r = 0; r < size; r++) { if (grid[r][col] === num) return false; }
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;
  for (let r = boxRow; r < boxRow + boxSize; r++) {
    for (let c = boxCol; c < boxCol + boxSize; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SudokuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const modeSelectAnim = useRef(new Animated.Value(0)).current;

  const [gridSize, setGridSize] = useState<SudokuSize | null>(null);
  const [sudokuData, setSudokuData] = useState<{ puzzle: number[][]; solution: number[][] } | null>(null);
  const [cells, setCells] = useState<SudokuCell[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [reinaExpression, setReinaExpression] = useState<ReinaExpression>('thinking');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSimulation, setIsSimulation] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [useKanjiNumerals, setUseKanjiNumerals] = useState(false);
  const continueAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(modeSelectAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const startGame = useCallback((size: SudokuSize, simulation: boolean = false) => {
    setGridSize(size);
    const data = generateSudoku(game.settings.difficulty, size);
    setSudokuData(data);
    setCells(data.puzzle.map(row => row.map(v => ({ value: v, isGiven: v !== 0, isWrong: false }))));
    setSelectedCell(null);
    setMistakes(0);
    setIsComplete(false);
    setHintsUsed(0);
    setReinaExpression('thinking');
    setIsSimulation(simulation);
    setIsSimulating(false);
    setCoinsEarned(0);
    setXpEarned(0);
    setShowContinue(false);
    setShowResult(false);
    resultAnim.setValue(0);
    continueAnim.setValue(0);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [game.settings.difficulty, fadeAnim, resultAnim, continueAnim]);

  const currentGridSize = gridSize ?? 9;
  const currentBoxSize = currentGridSize === 4 ? 2 : 3;
  const CELL_SIZE = Math.floor((SCREEN_WIDTH - 48) / currentGridSize);

  const handleCellPress = useCallback((row: number, col: number) => {
    if (!cells || cells[row][col].isGiven || isComplete || isSimulating) return;
    setSelectedCell({ row, col });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [cells, isComplete, isSimulating]);

  const handleNumberPress = useCallback((num: number) => {
    if (!selectedCell || isComplete || isSimulating || !cells || !sudokuData) return;
    const { row, col } = selectedCell;
    if (cells[row][col].isGiven) return;
    const correct = sudokuData.solution[row][col];
    const isCorrect = num === correct;
    setCells(prev => {
      if (!prev) return prev;
      const next = prev.map(r => r.map(c => ({ ...c })));
      next[row][col] = { value: num, isGiven: false, isWrong: !isCorrect };
      return next;
    });
    if (isCorrect) {
      setReinaExpression('happy');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setMistakes(prev => prev + 1);
      setReinaExpression('concerned');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(() => setReinaExpression('thinking'), 1500);
  }, [selectedCell, cells, sudokuData, isComplete, isSimulating]);

  useEffect(() => {
    if (isComplete || isSimulating || !cells || !sudokuData) return;
    const complete = cells.every((row, ri) =>
      row.every((cell, ci) => cell.value !== 0 && cell.value === sudokuData.solution[ri][ci])
    );
    if (complete) { finishGame(); }
  }, [cells]);

  const handleErase = useCallback(() => {
    if (!selectedCell || isComplete || isSimulating || !cells) return;
    const { row, col } = selectedCell;
    if (cells[row][col].isGiven) return;
    setCells(prev => {
      if (!prev) return prev;
      const next = prev.map(r => r.map(c => ({ ...c })));
      next[row][col] = { value: 0, isGiven: false, isWrong: false };
      return next;
    });
  }, [selectedCell, cells, isComplete, isSimulating]);

  const handleHint = useCallback(() => {
    if (!selectedCell || isComplete || isSimulating || !sudokuData || !cells) return;
    if (!isSimulation && !game.useHint()) {
      if (!game.isPremium) { Alert.alert('No Hints Left', 'Visit the shop to buy more hints!'); }
      return;
    }
    const { row, col } = selectedCell;
    const correct = sudokuData.solution[row][col];
    setCells(prev => {
      if (!prev) return prev;
      const next = prev.map(r => r.map(c => ({ ...c })));
      next[row][col] = { value: correct, isGiven: false, isWrong: false };
      return next;
    });
    setHintsUsed(prev => prev + 1);
    setReinaExpression('smirk');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => { setReinaExpression('thinking'); }, 500);
  }, [selectedCell, sudokuData, cells, isComplete, game, isSimulation, isSimulating]);

  const finishGame = useCallback(() => {
    setIsComplete(true);
    setShowContinue(true);
    setShowResult(false);
    if (!isSimulation) {
      const is4x4 = currentGridSize === 4;
      const baseCoins = is4x4 ? 20 : 50;
      const mistakePenalty = is4x4 ? 3 : 5;
      const hintPenalty = is4x4 ? 2 : 3;
      const minCoins = is4x4 ? 5 : 10;
      const coins = Math.max(baseCoins - mistakes * mistakePenalty - hintsUsed * hintPenalty, minCoins);
      const baseXp = is4x4 ? 12 : 30;
      const xp = Math.max(baseXp - mistakes * 2, is4x4 ? 3 : 5);
      setCoinsEarned(coins);
      setXpEarned(xp);
      game.addCoins(coins);
      game.addXp(xp);
      game.incrementMiniGames();
      game.incrementSudokuGames();
    } else {
      setCoinsEarned(0);
      setXpEarned(0);
    }
    setReinaExpression('proud');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    continueAnim.setValue(0);
    Animated.timing(continueAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [mistakes, hintsUsed, game, isSimulation, continueAnim, currentGridSize]);

  const handleContinuePress = useCallback(() => {
    setShowContinue(false);
    setShowResult(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resultAnim.setValue(0);
    Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true }).start();
  }, [resultAnim]);

  const handleNewGame = useCallback((simulation: boolean = false) => {
    if (!gridSize) return;
    startGame(gridSize, simulation);
  }, [gridSize, startGame]);

  const runSimulation = useCallback(() => {
    if (!cells || !sudokuData) return;
    setIsSimulating(true);
    setReinaExpression('thinking');
    const emptyCells: [number, number][] = [];
    cells.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (!cell.isGiven && cell.value === 0) { emptyCells.push([ri, ci]); }
      });
    });
    let index = 0;
    const interval = setInterval(() => {
      if (index >= emptyCells.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setReinaExpression('proud');
        return;
      }
      const [r, c] = emptyCells[index];
      const correct = sudokuData.solution[r][c];
      setCells(prev => {
        if (!prev) return prev;
        const next = prev.map(row => row.map(cell => ({ ...cell })));
        next[r][c] = { value: correct, isGiven: false, isWrong: false };
        const allDone = next.every((row, ri) => row.every((cell, ci) => cell.value === sudokuData.solution[ri][ci]));
        if (allDone) {
          setTimeout(() => {
            setIsComplete(true);
            setCoinsEarned(0);
            setXpEarned(0);
            setReinaExpression('proud');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            resultAnim.setValue(0);
            Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true }).start();
          }, 200);
        }
        return next;
      });
      index++;
    }, 80);
    return () => clearInterval(interval);
  }, [cells, sudokuData, resultAnim]);

  const isInSameGroup = useCallback((r1: number, c1: number, r2: number, c2: number) => {
    if (r1 === r2) return true;
    if (c1 === c2) return true;
    if (Math.floor(r1 / currentBoxSize) === Math.floor(r2 / currentBoxSize) && Math.floor(c1 / currentBoxSize) === Math.floor(c2 / currentBoxSize)) return true;
    return false;
  }, [currentBoxSize]);

  if (!gridSize || !sudokuData || !cells) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Sudoku', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
        <FloralOverlay />
        <ScrollView contentContainerStyle={[styles.modeSelectScreen, { paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.modeSelectHeader, { opacity: modeSelectAnim, transform: [{ translateY: modeSelectAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <ReinaCharacter expression="happy" size="medium" enableFloat={true} />
            <View style={[styles.modeSelectSpeech, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
              <Text style={[styles.modeSelectSpeechText, { color: colors.text }]}>Pick your grid size! You can toggle 漢字 mode during play~ 🧩</Text>
            </View>
          </Animated.View>

          <Text style={[styles.modeSelectTitle, { color: colors.text }]}>Grid Size</Text>

          <View style={styles.modeCards}>
            <Animated.View style={{ opacity: modeSelectAnim, transform: [{ translateY: modeSelectAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
              <TouchableOpacity
                style={[styles.modeCard, { backgroundColor: colors.widgetBg, borderColor: colors.widgetBorder }]}
                onPress={() => startGame(4)}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIconCircle, { backgroundColor: colors.sakuraPinkLight }]}>
                  <Grid2X2 size={28} color={colors.sakuraPink} />
                </View>
                <View style={styles.modeCardText}>
                  <Text style={[styles.modeCardTitle, { color: colors.text }]}>4×4 Mini</Text>
                  <Text style={[styles.modeCardDesc, { color: colors.textMuted }]}>Quick & easy, 2×2 boxes</Text>
                </View>
                <View style={[styles.modeRewardChip, { backgroundColor: colors.goldLight }]}>
                  <Text style={[styles.modeRewardText, { color: colors.gold }]}>~20 🪙</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ opacity: modeSelectAnim, transform: [{ translateY: modeSelectAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
              <TouchableOpacity
                style={[styles.modeCard, { backgroundColor: colors.widgetBg, borderColor: colors.widgetBorder }]}
                onPress={() => startGame(9)}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIconCircle, { backgroundColor: colors.accentLight }]}>
                  <Grid3X3 size={28} color={colors.gemBlue} />
                </View>
                <View style={styles.modeCardText}>
                  <Text style={[styles.modeCardTitle, { color: colors.text }]}>9×9 Classic</Text>
                  <Text style={[styles.modeCardDesc, { color: colors.textMuted }]}>Standard sudoku, 3×3 boxes</Text>
                </View>
                <View style={[styles.modeRewardChip, { backgroundColor: colors.goldLight }]}>
                  <Text style={[styles.modeRewardText, { color: colors.gold }]}>~50 🪙</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={[styles.modeInfoCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
            <Text style={[styles.modeInfoTitle, { color: colors.text }]}>Difficulty: {game.settings.difficulty.charAt(0).toUpperCase() + game.settings.difficulty.slice(1)}</Text>
            <Text style={[styles.modeInfoDesc, { color: colors.textMuted }]}>Change difficulty in Settings</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  const resultTitle = isSimulation ? 'Simulation Complete!' : mistakes === 0 ? 'Perfect!' : mistakes <= 2 ? 'Great Job!' : mistakes <= 4 ? 'Nice Work!' : 'Keep Practicing!';
  const resultExpression: ReinaExpression = isSimulation ? 'smirk' : mistakes === 0 ? 'proud' : mistakes <= 2 ? 'happy' : mistakes <= 4 ? 'smirk' : 'concerned';

  if (isComplete && showResult) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Sudoku', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
        <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
        <FloralOverlay />
        <Animated.View style={[styles.resultScreen, { opacity: resultAnim, transform: [{ scale: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
          <View style={[styles.resultCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
            <ReinaCharacter expression={resultExpression} size="small" enableFloat={false} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>{resultTitle}</Text>
            {isSimulation ? (
              <Text style={[styles.resultSubtitle, { color: colors.textMuted }]}>The computer solved the puzzle</Text>
            ) : (
              <>
                <Text style={[styles.resultScore, { color: colors.textLight }]}>{mistakes} mistakes · {hintsUsed} hints used</Text>
                <Text style={[styles.resultCoins, { color: colors.gold }]}>+{coinsEarned} 🪙 · +{xpEarned} XP</Text>
              </>
            )}
            {!isSimulation && (
              <View style={styles.resultDots}>
                {[0, 1, 2, 3, 4].map(i => (
                  <View key={i} style={[styles.dot, { backgroundColor: i < (5 - mistakes) ? colors.success : colors.error }]} />
                ))}
              </View>
            )}
            <View style={styles.resultMeta}>
              <View style={[styles.resultMetaChip, { backgroundColor: colors.lavenderLight }]}>
                <Text style={[styles.resultMetaText, { color: colors.lavenderDark }]}>
                  {game.settings.difficulty.charAt(0).toUpperCase() + game.settings.difficulty.slice(1)}
                </Text>
              </View>
              <View style={[styles.resultMetaChip, { backgroundColor: colors.sakuraPinkLight }]}>
                <Text style={[styles.resultMetaText, { color: colors.sakuraPink }]}>
                  {currentGridSize}×{currentGridSize}
                </Text>
              </View>
              {isSimulation && (
                <View style={[styles.resultMetaChip, { backgroundColor: colors.warningLight }]}>
                  <Text style={[styles.resultMetaText, { color: colors.warning }]}>Simulation</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={[styles.resultBtn, { backgroundColor: colors.sakuraPink }]} onPress={() => handleNewGame(false)} activeOpacity={0.8}>
              <Text style={styles.resultBtnText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resultSecondaryBtn, { backgroundColor: colors.lavenderLight }]} onPress={() => { setGridSize(null); setSudokuData(null); setCells(null); modeSelectAnim.setValue(0); Animated.timing(modeSelectAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start(); }} activeOpacity={0.8}>
              <Text style={[styles.resultSecondaryText, { color: colors.lavenderDark }]}>Change Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resultBackBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={[styles.resultBackText, { color: colors.textLight }]}>Back to Menu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: `Sudoku ${currentGridSize}×${currentGridSize}`, headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, paddingTop: insets.top + 50 }]}>
        <View style={styles.headerRow}>
          <View style={styles.reinaSmall}>
            <ReinaCharacter expression={reinaExpression} size="small" enableFloat={false} />
          </View>
          <View style={styles.statsArea}>
            <View style={[styles.statChip, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Mistakes</Text>
              <Text style={[styles.statValue, { color: colors.text }, mistakes >= 3 && { color: colors.error }]}>{mistakes}/5</Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Hints</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{game.isPremium ? '∞' : game.hints}</Text>
            </View>
            {isSimulation && (
              <View style={[styles.statChip, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
                <Text style={[styles.statLabel, { color: colors.warning }]}>SIM</Text>
                <Text style={[styles.statValue, { color: colors.warning }]}>0🪙</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.gridContainer, { backgroundColor: isDark ? 'rgba(200,180,220,0.15)' : 'rgba(45,27,78,0.08)' }]}>
          {Array.from({ length: currentGridSize }).map((_, row) => (
            <View key={row} style={[styles.gridRow, row % currentBoxSize === 0 && row !== 0 && { borderTopWidth: 2, borderTopColor: isDark ? 'rgba(200,180,220,0.3)' : 'rgba(45,27,78,0.2)' }]}>
              {Array.from({ length: currentGridSize }).map((_, col) => {
                const cell = cells[row][col];
                const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                const isHighlighted = selectedCell ? isInSameGroup(selectedCell.row, selectedCell.col, row, col) : false;
                const isSameNumber = selectedCell && cell.value !== 0 && cell.value === cells[selectedCell.row]?.[selectedCell.col]?.value;
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.cell,
                      { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: colors.gridCell, borderColor: colors.border },
                      col % currentBoxSize === 0 && col !== 0 && { borderLeftWidth: 2, borderLeftColor: isDark ? 'rgba(200,180,220,0.3)' : 'rgba(45,27,78,0.2)' },
                      isHighlighted && { backgroundColor: isDark ? 'rgba(176,136,224,0.08)' : 'rgba(155,111,212,0.06)' },
                      isSameNumber && { backgroundColor: isDark ? 'rgba(240,104,144,0.12)' : 'rgba(232,84,124,0.08)' },
                      isSelected && { backgroundColor: colors.gridCellSelected },
                      cell.isWrong && { backgroundColor: colors.gridCellWrong },
                    ]}
                    onPress={() => handleCellPress(row, col)}
                    activeOpacity={0.7}
                  >
                    {cell.value !== 0 && (
                      <Text style={[
                        styles.cellText,
                        { fontSize: currentGridSize === 4 ? (useKanjiNumerals ? 22 : 24) : (CELL_SIZE < 36 ? (useKanjiNumerals ? 14 : 16) : (useKanjiNumerals ? 18 : 20)) },
                        cell.isGiven && { color: colors.text, fontWeight: '700' as const },
                        cell.isWrong && { color: colors.error },
                        !cell.isGiven && !cell.isWrong && { color: colors.lavenderDark },
                      ]}>
                        {useKanjiNumerals ? KANJI_NUMERALS[cell.value] : cell.value}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {!isSimulating && (
          <View style={styles.controls}>
            <View style={styles.numberRow}>
              {Array.from({ length: currentGridSize }, (_, i) => i + 1).map(num => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numberBtn, { backgroundColor: colors.cardGlass, width: currentGridSize === 4 ? (SCREEN_WIDTH - 80) / 5 : (SCREEN_WIDTH - 80) / 9 }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.numberText, { color: colors.text }]}>{useKanjiNumerals ? KANJI_NUMERALS[num] : num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.toolRow}>
              <TouchableOpacity style={[styles.toolBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }]} onPress={handleErase}>
                <Eraser size={16} color={colors.textLight} />
                <Text style={[styles.toolText, { color: colors.text }]}>Erase</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toolBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }]} onPress={handleHint}>
                <Lightbulb size={16} color={colors.gold} />
                <Text style={[styles.toolText, { color: colors.text }]}>Hint</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toolBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }]} onPress={() => handleNewGame(false)}>
                <RotateCcw size={16} color={colors.lavender} />
                <Text style={[styles.toolText, { color: colors.text }]}>New</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.toolRow}>
              <TouchableOpacity style={[styles.toolBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }]} onPress={() => setShowTutorial(true)}>
                <HelpCircle size={16} color={colors.gemBlue} />
                <Text style={[styles.toolText, { color: colors.text }]}>Teach</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toolBtn, { backgroundColor: isSimulation ? colors.warningLight : colors.cardGlass, borderColor: isSimulation ? colors.warning : colors.border }]}
                onPress={() => { if (isSimulation) { runSimulation(); } else { handleNewGame(true); } }}
              >
                {isSimulation ? (
                  <>
                    <Play size={16} color={colors.warning} />
                    <Text style={[styles.toolText, { color: colors.warning }]}>Solve</Text>
                  </>
                ) : (
                  <>
                    <Eye size={16} color={colors.lavenderDark} />
                    <Text style={[styles.toolText, { color: colors.text }]}>Simulate</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toolBtn, { backgroundColor: useKanjiNumerals ? colors.sakuraPinkLight : colors.cardGlass, borderColor: useKanjiNumerals ? colors.sakuraPink : colors.border }]}
                onPress={() => { setUseKanjiNumerals(prev => !prev); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <Text style={[styles.toolText, { color: useKanjiNumerals ? colors.sakuraPink : colors.text, fontWeight: '700' as const }]}>漢字</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toolBtn, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
                onPress={() => { setGridSize(null); setSudokuData(null); setCells(null); modeSelectAnim.setValue(0); Animated.timing(modeSelectAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start(); }}
              >
                <Grid2X2 size={16} color={colors.textLight} />
                <Text style={[styles.toolText, { color: colors.text }]}>Mode</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isSimulating && (
          <View style={[styles.simulatingBanner, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
            <Text style={[styles.simulatingText, { color: colors.text }]}>🤖 Computer is solving...</Text>
          </View>
        )}

        {isComplete && showContinue && (
          <Animated.View style={[styles.continueSection, { opacity: continueAnim, transform: [{ translateY: continueAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <View style={[styles.completeBanner, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
              <Text style={[styles.completeText, { color: colors.success }]}>🎉 Puzzle Complete!</Text>
            </View>
            <TouchableOpacity
              style={[styles.continueBtn, { backgroundColor: colors.sakuraPink }]}
              onPress={handleContinuePress}
              activeOpacity={0.8}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      <Modal visible={showTutorial} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.tutorialCard, { backgroundColor: isDark ? 'rgba(40,25,65,0.95)' : '#FFFFFF' }]}>
            <View style={[styles.tutorialHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.tutorialTitle, { color: colors.text }]}>How to Play Sudoku</Text>
              <TouchableOpacity onPress={() => setShowTutorial(false)} style={styles.tutorialClose}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tutorialContent}>
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialHeading, { color: colors.text }]}>🎯 Goal</Text>
                <Text style={[styles.tutorialText, { color: colors.textLight }]}>
                  Fill every cell in the {currentGridSize}×{currentGridSize} grid with numbers 1-{currentGridSize} so that each number appears exactly once in every row, column, and {currentBoxSize}×{currentBoxSize} box.
                </Text>
              </View>
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialHeading, { color: colors.text }]}>📏 Rules</Text>
                <Text style={[styles.tutorialText, { color: colors.textLight }]}>
                  1. Each row must contain the numbers 1-{currentGridSize} with no repeats.{'\n'}
                  2. Each column must contain the numbers 1-{currentGridSize} with no repeats.{'\n'}
                  3. Each {currentBoxSize}×{currentBoxSize} box must contain 1-{currentGridSize} with no repeats.
                </Text>
              </View>
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialHeading, { color: colors.text }]}>⭐ Scoring</Text>
                <Text style={[styles.tutorialText, { color: colors.textLight }]}>
                  {currentGridSize === 4 ? (
                    `• Base reward: 20 coins\n• Each mistake: -3 coins\n• Each hint used: -2 coins\n• Minimum reward: 5 coins\n• Simulation mode: 0 coins`
                  ) : (
                    `• Base reward: 50 coins\n• Each mistake: -5 coins\n• Each hint used: -3 coins\n• Minimum reward: 10 coins\n• Simulation mode: 0 coins`
                  )}
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={[styles.tutorialBtn, { backgroundColor: colors.sakuraPink }]} onPress={() => setShowTutorial(false)} activeOpacity={0.8}>
              <Text style={styles.tutorialBtnText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  reinaSmall: { width: 70 },
  statsArea: { flex: 1, flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 10, fontWeight: '500' as const },
  statValue: { fontSize: 16, fontWeight: '800' as const },
  gridContainer: { alignSelf: 'center', padding: 1.5, borderRadius: 10 },
  gridRow: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  cellText: { fontWeight: '600' as const },
  controls: { paddingTop: 14, gap: 10 },
  numberRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  numberBtn: { height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 20, fontWeight: '700' as const },
  toolRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  toolBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  toolText: { fontSize: 12, fontWeight: '600' as const },
  simulatingBanner: { marginTop: 20, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1 },
  simulatingText: { fontSize: 15, fontWeight: '700' as const },
  continueSection: { paddingTop: 16, gap: 12, alignItems: 'center' },
  completeBanner: { borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, width: '100%' },
  completeText: { fontSize: 17, fontWeight: '800' as const },
  continueBtn: { paddingHorizontal: 48, paddingVertical: 14, borderRadius: 16 },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' as const },
  resultScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', borderWidth: 1 },
  resultTitle: { fontSize: 24, fontWeight: '800' as const, marginTop: 12, marginBottom: 6 },
  resultSubtitle: { fontSize: 14, fontWeight: '500' as const, marginBottom: 8 },
  resultScore: { fontSize: 14, fontWeight: '600' as const },
  resultCoins: { fontSize: 20, fontWeight: '700' as const, marginBottom: 12 },
  resultDots: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  resultMeta: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  resultMetaChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  resultMetaText: { fontSize: 12, fontWeight: '600' as const },
  resultBtn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14, marginBottom: 10, width: '100%', alignItems: 'center' },
  resultBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  resultSecondaryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 8 },
  resultSecondaryText: { fontSize: 14, fontWeight: '600' as const },
  resultBackBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  resultBackText: { fontSize: 14, fontWeight: '600' as const },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  tutorialCard: { borderRadius: 24, width: '100%', maxHeight: '80%', overflow: 'hidden' },
  tutorialHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1 },
  tutorialTitle: { fontSize: 18, fontWeight: '800' as const },
  tutorialClose: { padding: 4 },
  tutorialContent: { padding: 20, paddingBottom: 8 },
  tutorialSection: { marginBottom: 18 },
  tutorialHeading: { fontSize: 15, fontWeight: '700' as const, marginBottom: 6 },
  tutorialText: { fontSize: 14, lineHeight: 22, fontWeight: '500' as const },
  tutorialBtn: { marginHorizontal: 20, marginBottom: 20, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  tutorialBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
  modeSelectScreen: { padding: 18, paddingBottom: 40 },
  modeSelectHeader: { alignItems: 'center', marginBottom: 24 },
  modeSelectSpeech: { borderRadius: 16, padding: 14, marginTop: 12, width: '100%', borderWidth: 1 },
  modeSelectSpeechText: { fontSize: 15, textAlign: 'center', fontWeight: '500' as const, lineHeight: 22 },
  modeSelectTitle: { fontSize: 18, fontWeight: '800' as const, marginBottom: 14 },
  modeCards: { gap: 12, marginBottom: 20 },
  modeCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1, gap: 14 },
  modeIconCircle: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modeCardText: { flex: 1 },
  modeCardTitle: { fontSize: 16, fontWeight: '700' as const },
  modeCardDesc: { fontSize: 12, fontWeight: '500' as const, marginTop: 2 },
  modeRewardChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  modeRewardText: { fontSize: 12, fontWeight: '700' as const },
  modeInfoCard: { borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1 },
  modeInfoTitle: { fontSize: 14, fontWeight: '600' as const },
  modeInfoDesc: { fontSize: 12, fontWeight: '500' as const, marginTop: 2 },
});
