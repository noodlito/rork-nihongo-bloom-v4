import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Star } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FloralOverlay } from '@/components/FloralOverlay';
import { PUZZLES } from '@/mocks/puzzles';

export default function PuzzleSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const { colors, isDark } = useTheme();

  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
  const difficultyColors: Record<string, { primary: string; bg: string; label: string }> = {
    beginner: { primary: colors.success, bg: colors.successLight, label: 'Beginner' },
    intermediate: { primary: colors.warning, bg: colors.warningLight, label: 'Intermediate' },
    advanced: { primary: colors.sakuraPinkDark, bg: colors.sakuraPinkLight, label: 'Advanced' },
  };

  const grouped = useMemo(() => {
    const map: Record<string, typeof PUZZLES> = {};
    difficulties.forEach(d => { map[d] = PUZZLES.filter(p => p.difficulty === d); });
    return map;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Select Puzzle', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20, paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
        {difficulties.map(diff => {
          const puzzles = grouped[diff] || [];
          const dc = difficultyColors[diff];
          return (
            <View key={diff} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.diffBadge, { backgroundColor: dc.bg }]}>
                  <Star size={14} color={dc.primary} />
                  <Text style={[styles.diffLabel, { color: dc.primary }]}>{dc.label}</Text>
                </View>
                <Text style={[styles.countLabel, { color: colors.textMuted }]}>{puzzles.length} puzzles</Text>
              </View>
              {puzzles.map(puzzle => {
                const completed = game.completedPuzzles.includes(puzzle.id);
                return (
                  <TouchableOpacity
                    key={puzzle.id}
                    style={[styles.puzzleCard, { backgroundColor: colors.cardGlass, borderColor: completed ? colors.success : colors.border }]}
                    onPress={() => router.push(`/puzzle?id=${puzzle.id}` as never)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.puzzleLeft}>
                      <View style={[styles.puzzleIcon, { backgroundColor: dc.bg }]}>
                        {completed ? (
                          <CheckCircle size={22} color={colors.success} />
                        ) : (
                          <Text style={styles.puzzleGridEmoji}>🧩</Text>
                        )}
                      </View>
                      <View>
                        <Text style={[styles.puzzleTitle, { color: colors.text }]}>{puzzle.title}</Text>
                        {puzzle.titleJa && (
                          <Text style={[styles.puzzleTitleJa, { color: colors.textLight }]}>{puzzle.titleJa}</Text>
                        )}
                        <View style={styles.puzzleMeta}>
                          <Text style={[styles.puzzleMetaText, { color: colors.textMuted }]}>{puzzle.gridSize}×{puzzle.gridSize}</Text>
                          <Text style={[styles.puzzleMetaDot, { color: colors.textMuted }]}>·</Text>
                          <Text style={[styles.puzzleMetaText, { color: colors.textMuted }]}>{puzzle.acrossClues.length + puzzle.downClues.length} clues</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.puzzleRight}>
                      <View style={[styles.coinReward, { backgroundColor: colors.goldLight }]}>
                        <Text style={[styles.coinRewardText, { color: colors.gold }]}>+{puzzle.coinReward}</Text>
                        <Text style={styles.coinEmoji}>🪙</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 18 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  diffBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  diffLabel: { fontSize: 14, fontWeight: '700' as const },
  countLabel: { fontSize: 12, fontWeight: '500' as const },
  puzzleCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1 },
  puzzleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  puzzleIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  puzzleGridEmoji: { fontSize: 22 },
  puzzleTitle: { fontSize: 15, fontWeight: '700' as const },
  puzzleTitleJa: { fontSize: 12, fontWeight: '500' as const },
  puzzleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  puzzleMetaText: { fontSize: 11 },
  puzzleMetaDot: { fontSize: 11 },
  puzzleRight: { alignItems: 'flex-end' },
  coinReward: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  coinRewardText: { fontSize: 12, fontWeight: '700' as const },
  coinEmoji: { fontSize: 12 },
});
