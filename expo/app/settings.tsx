import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe, Clock, Star, Moon, Sun, Palette } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getQuestionCount } from '@/mocks/trivia';
import { MASTER_KANJI } from '@/mocks/kanji-database';
import { FloralOverlay } from '@/components/FloralOverlay';
import type { AppThemeName } from '@/constants/colors';

const THEME_OPTIONS: { key: AppThemeName; label: string; color: string }[] = [
  { key: 'ocean', label: '青', color: '#5B9BD5' },
  { key: 'sunset', label: '橙', color: '#F5A623' },
  { key: 'neon', label: '桃', color: '#D65B8A' },
  { key: 'green', label: '緑', color: '#4CAF50' },
];

export default function SettingsScreen() {
  const game = useGame();
  const { colors, isDark, toggleTheme, appTheme, changeAppTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const toggleSetting = (key: string, value: boolean | string) => {
    game.updateSettings({ [key]: value } as any);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
  const diffLabels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Settings', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(176,136,224,0.12)' : '#F0E6FA' }]}>
                {isDark ? <Moon size={16} color={colors.lavender} /> : <Sun size={16} color={colors.warning} />}
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                toggleTheme();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              trackColor={{ false: colors.switchTrack, true: colors.sakuraPinkLight }}
              thumbColor={isDark ? colors.sakuraPink : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Theme</Text>
        <View style={[styles.card, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(176,136,224,0.12)' : '#F0E6FA' }]}>
                <Palette size={16} color={colors.lavender} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>App Theme</Text>
            </View>
          </View>
          <View style={styles.themeGrid}>
            {THEME_OPTIONS.map(theme => (
              <TouchableOpacity
                key={theme.key}
                style={[
                  styles.themeBtn,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: appTheme === theme.key ? colors.sakuraPink : 'transparent' },
                ]}
                onPress={() => {
                  changeAppTheme(theme.key);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.themeColorDot, { backgroundColor: theme.color }]} />
                <Text style={[styles.themeBtnText, { color: colors.text }]}>{theme.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Language</Text>
        <View style={[styles.card, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(176,136,224,0.12)' : '#F0E6FA' }]}>
                <Globe size={16} color={colors.lavender} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Language</Text>
            </View>
            <View style={[styles.toggleGroup, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
              {(['english', 'japanese'] as const).map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.toggleBtn, game.settings.language === lang && { backgroundColor: colors.sakuraPink }]}
                  onPress={() => toggleSetting('language', lang)}
                >
                  <Text style={[styles.toggleBtnText, { color: colors.textMuted }, game.settings.language === lang && styles.toggleBtnTextActive]}>
                    {lang === 'english' ? 'EN' : 'JP'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Difficulty</Text>
        <View style={[styles.card, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <View style={styles.diffRow}>
            {difficulties.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.diffBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }, game.settings.difficulty === d && { backgroundColor: colors.sakuraPink }]}
                onPress={() => toggleSetting('difficulty', d)}
              >
                <Star size={13} color={game.settings.difficulty === d ? '#fff' : colors.textMuted} />
                <Text style={[styles.diffBtnText, { color: colors.textMuted }, game.settings.difficulty === d && styles.diffBtnTextActive]}>
                  {diffLabels[d]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Timer</Text>
        <View style={[styles.card, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(176,136,224,0.12)' : '#F0E6FA' }]}>
                <Clock size={16} color={colors.lavender} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Timer</Text>
            </View>
            <Switch
              value={game.settings.timerEnabled}
              onValueChange={(v) => toggleSetting('timerEnabled', v)}
              trackColor={{ false: colors.switchTrack, true: colors.sakuraPinkLight }}
              thumbColor={game.settings.timerEnabled ? colors.sakuraPink : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Mastery</Text>
        <View style={[styles.card, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Kanji Mastered</Text>
            <Text style={[styles.statValue, { color: colors.sakuraPink }]}>You know {game.totalKanjiCorrect ?? 0} of {MASTER_KANJI.length} kanji!</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Trivia Mastered</Text>
            <Text style={[styles.statValue, { color: colors.sakuraPink }]}>{game.totalTriviaCorrect} / {getQuestionCount()} conquered</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Word Matches Won</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{game.totalMatchGamesCompleted ?? 0} cleared</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Sudoku Cleared</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{game.totalSudokuGamesCompleted ?? 0} puzzles</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Daily Streak 🔥</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>{game.currentStreak} days (best: {game.longestStreak})</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Total Loot 🪙</Text>
            <Text style={[styles.statValue, { color: colors.gold }]}>{game.coins} coins</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Nihongo Bloom v1.0</Text>
          <Text style={[styles.footerSubtext, { color: colors.textMuted }]}>Made with 🌸 by anime fans, for anime fans</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  separator: {
    height: 1,
    marginHorizontal: 14,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  toggleBtnTextActive: {
    color: '#fff',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  diffBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 10,
  },
  diffBtnText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  diffBtnTextActive: {
    color: '#fff',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    padding: 16,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
});
