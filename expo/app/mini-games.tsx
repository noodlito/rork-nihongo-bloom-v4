import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gamepad2, Grid3X3, HelpCircle, ChevronRight, Sparkles, Home } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FloralOverlay } from '@/components/FloralOverlay';

const { width } = Dimensions.get('window');

interface GameOption {
  icon: typeof Gamepad2;
  label: string;
  sublabel: string;
  route: string;
  gradient: [string, string];
}

export default function MiniGamesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const game = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(40)).current;
  const card2Anim = useRef(new Animated.Value(40)).current;
  const card3Anim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(card1Anim, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      Animated.timing(card2Anim, { toValue: 0, duration: 500, delay: 200, useNativeDriver: true }),
      Animated.timing(card3Anim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const games: GameOption[] = [
    {
      icon: Gamepad2,
      label: 'Match',
      sublabel: 'Match JP words • Earn loot',
      route: '/mini-game',
      gradient: [colors.sakuraPink, colors.sakuraPinkDark],
    },
    {
      icon: HelpCircle,
      label: 'Trivia',
      sublabel: 'Anime & culture • Power quiz',
      route: '/trivia',
      gradient: [colors.accent, colors.sakuraPinkDark],
    },
    {
      icon: Grid3X3,
      label: 'Sudoku',
      sublabel: 'Number puzzle • Kanji mode',
      route: '/sudoku',
      gradient: [colors.accent, colors.sakuraPinkDark],
    },
  ];

  const cardAnims = [card1Anim, card2Anim, card3Anim];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Mini Games', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true, headerRight: () => (<TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}><Home size={22} color={colors.text} /></TouchableOpacity>) }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 70, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.titleArea, { opacity: fadeAnim }]}>
          <View style={[styles.titleIconWrap, { backgroundColor: colors.accentLight }]}>
            <Sparkles size={28} color={colors.accent} />
          </View>
          <Text style={[styles.titleText, { color: colors.text }]}>Side Quests</Text>
          <Text style={[styles.subtitleText, { color: colors.textMuted }]}>Grind coins & XP • Unlock rewards</Text>
        </Animated.View>

        {games.map((g, index) => (
          <Animated.View
            key={g.label}
            style={{ opacity: fadeAnim, transform: [{ translateY: cardAnims[index] }], marginBottom: 14 }}
          >
            <TouchableOpacity
              style={[styles.gameCard, { borderColor: colors.widgetBorder }]}
              onPress={() => router.push(g.route as never)}
              activeOpacity={0.85}
              testID={`minigame-${g.label.toLowerCase()}`}
            >
              <LinearGradient
                colors={g.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gameCardGradient}
              >
                <View style={styles.gameCardLeft}>
                  <View style={styles.gameCardIconWrap}>
                    <g.icon size={30} color="#fff" />
                  </View>
                  <View style={styles.gameCardTextWrap}>
                    <Text style={styles.gameCardLabel}>{g.label}</Text>
                    <Text style={styles.gameCardSublabel}>{g.sublabel}</Text>
                  </View>
                </View>
                <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          <View style={[styles.statCard, { backgroundColor: colors.widgetBg, borderColor: colors.widgetBorder }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{game.totalMiniGamesPlayed ?? 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Quests Cleared</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.widgetBg, borderColor: colors.widgetBorder }]}>
            <Text style={[styles.statValue, { color: colors.gold }]}>{game.coins}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Loot</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
  },
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  gameCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  gameCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 19,
  },
  gameCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  gameCardIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameCardTextWrap: {
    flex: 1,
  },
  gameCardLabel: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 3,
  },
  gameCardSublabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
