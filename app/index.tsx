import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, BookOpen, Gamepad2, HelpCircle, Heart, Settings, ShoppingBag, Sparkles, Gift, Coins, Grid3X3, MessageCircle, ChevronRight } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { loadGreetingDialogue, resetGreetingCache, getDialogue, getXpLevel } from '@/mocks/companion';
import type { Dialogue } from '@/mocks/companion';
import { ReinaCharacter } from '@/components/ReinaCharacter';
import { FloralOverlay } from '@/components/FloralOverlay';
import { moodToExpression } from '@/constants/reina';

const { width } = Dimensions.get('window');
const GRID_PAD = 18;
const GRID_GAP = 10;
const HALF_W = (width - GRID_PAD * 2 - GRID_GAP) / 2;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function blendHex(hex1: string, hex2: string, ratio: number): string {
  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const companionSlide = useRef(new Animated.Value(50)).current;
  const kanjiScale = useRef(new Animated.Value(0.95)).current;

  const [greeting, setGreeting] = useState<Dialogue | null>(null);

  useEffect(() => {
    resetGreetingCache();
    loadGreetingDialogue().then(setGreeting).catch(() => {
      setGreeting(getDialogue('greeting'));
    });
  }, []);
  const xpInfo = useMemo(() => getXpLevel(game.xpLevel), [game.xpLevel]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(companionSlide, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
      Animated.spring(kanjiScale, { toValue: 1, friction: 6, tension: 80, delay: 300, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const widgetShades = useMemo(() => {
    const base = colors.sakuraPink;
    const dark = colors.sakuraPinkDark;
    const softBase = isDark ? base : blendHex(base, '#FFFFFF', 0.18);
    const softDark = isDark ? dark : blendHex(dark, '#FFFFFF', 0.18);
    const purpleTint = isDark ? '#9B6FD4' : '#7B5FB8';
    return {
      miniGames: {
        from: blendHex(softDark, purpleTint, 0.3),
        to: blendHex(softBase, purpleTint, 0.25),
      },
      companion: {
        from: blendHex(softDark, purpleTint, 0.3),
        to: blendHex(softBase, purpleTint, 0.25),
      },
      shop: {
        from: isDark ? '#B8860B' : '#E6C44D',
        to: isDark ? '#DAA520' : '#F0D868',
      },
      reina: {
        bg: blendHex(blendHex(softDark, '#FFFFFF', 0.5), blendHex(softBase, '#FFFFFF', 0.5), 0.5),
      },
    };
  }, [colors, isDark]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={[styles.streakBadge, { backgroundColor: isDark ? 'rgba(255,184,77,0.15)' : '#FFF6E6' }]}>
                <Flame size={15} color={colors.warning} />
                <Text style={[styles.streakText, { color: colors.text }]}>{game.currentStreak}🔥</Text>
              </View>
              <View style={[styles.statChip, { backgroundColor: isDark ? 'rgba(245,166,35,0.12)' : '#FFF8E8' }]}>
                <Coins size={13} color={colors.gold} />
                <Text style={[styles.statText, { color: colors.text }]}>{game.coins}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <View style={[styles.levelBadge, { backgroundColor: colors.sakuraPinkLight }]}>
                <Heart size={13} color={colors.sakuraPink} />
                <Text style={[styles.statText, { color: colors.text }]}>Lv.{xpInfo.level} ✨</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/settings' as never)}
                style={[styles.settingsBtn, { backgroundColor: colors.widgetBg }]}
                testID="settings-btn"
              >
                <Settings size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.companionCard, { opacity: fadeAnim, transform: [{ translateX: companionSlide }] }]}>
          <View style={[styles.companionGradient, { backgroundColor: widgetShades.reina.bg, borderColor: hexToRgba(colors.sakuraPink, 0.3) }]}>
            <View style={styles.companionContent}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <ReinaCharacter
                  expression={moodToExpression(greeting?.mood ?? 'happy')}
                  size="small"
                  enableFloat={false}
                />
              </Animated.View>
              <View style={styles.companionTextArea}>
                <View style={[styles.speechBubble, { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)' }]}>
                  <Text style={[styles.speechText, { color: isDark ? '#1A2A3E' : colors.text }]}>{greeting?.text ?? '...'}</Text>
                </View>
                <View style={styles.bondBar}>
                  <View style={[styles.bondBarBg, { backgroundColor: colors.sakuraPinkLight }]}>
                    <View style={[styles.bondBarFill, { width: `${xpInfo.progress * 100}%` as const, backgroundColor: colors.sakuraPink }]} />
                  </View>
                  <Text style={[styles.bondLabel, { color: colors.textMuted }]}>{xpInfo.xpForNext} XP to level up!</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {!game.dailyRewardClaimed && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity style={styles.dailyReward} onPress={() => game.claimDailyReward()} activeOpacity={0.8}>
              <LinearGradient colors={[colors.gold, colors.accent]} style={styles.dailyGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Gift size={18} color="#fff" />
                <Text style={styles.dailyText}>Daily Loot Drop!</Text>
                <View style={styles.dailyCoinBadge}>
                  <Text style={styles.dailyCoinText}>+25</Text>
                  <Coins size={11} color={colors.gold} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: kanjiScale }] }}>
          <TouchableOpacity
            style={[styles.heroWidget, { borderColor: colors.widgetBorder }]}
            onPress={() => router.push('/puzzle' as never)}
            activeOpacity={0.85}
            testID="menu-kanji"
          >
            <LinearGradient
              colors={isDark ? [colors.sakuraPinkDark, colors.sakuraPink] : [blendHex(colors.sakuraPink, '#FFFFFF', 0.18), blendHex(colors.sakuraPinkDark, '#FFFFFF', 0.18)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroLeft}>
                <View style={styles.heroIconWrap}>
                  <Sparkles size={26} color="#fff" />
                </View>
                <View style={styles.heroTextWrap}>
                  <Text style={styles.heroLabel}>Kanji</Text>
                  <Text style={styles.heroSublabel}>Power through rare kanji • Level up</Text>
                </View>
              </View>
              <View style={styles.heroRight}>
                <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
              </View>
              <TouchableOpacity
                style={styles.kanjiStudyListBtn}
                onPress={() => router.push('/study-list' as never)}
                activeOpacity={0.7}
                testID="menu-study-list-inline"
              >
                <BookOpen size={14} color="#fff" />
                <Text style={styles.kanjiStudyListText}>Study List</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity
            style={[styles.heroWidget, { borderColor: colors.widgetBorder }]}
            onPress={() => router.push('/mini-games' as never)}
            activeOpacity={0.85}
            testID="menu-mini-games"
          >
            <LinearGradient
              colors={[widgetShades.miniGames.from, widgetShades.miniGames.to]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroLeft}>
                <View style={styles.heroIconWrap}>
                  <Gamepad2 size={26} color="#fff" />
                </View>
                <View style={styles.heroTextWrap}>
                  <Text style={styles.heroLabel}>Mini Games</Text>
                  <Text style={styles.heroSublabel}>Side quests • Earn coins & XP</Text>
                </View>
              </View>
              <View style={styles.heroRight}>
                <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: companionSlide }] }}>
          <TouchableOpacity
            style={[styles.heroWidget, { borderColor: colors.widgetBorder }]}
            onPress={() => router.push('/companion' as never)}
            activeOpacity={0.85}
            testID="menu-companion"
          >
            <LinearGradient
              colors={[widgetShades.companion.from, widgetShades.companion.to]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroLeft}>
                <View style={styles.heroIconWrap}>
                  <MessageCircle size={26} color="#fff" />
                </View>
                <View style={styles.heroTextWrap}>
                  <Text style={styles.heroLabel}>Companion</Text>
                  <Text style={styles.heroSublabel}>Chat • Unlock knowledge • Bond</Text>
                </View>
              </View>
              <View style={styles.heroRight}>
                <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity
            style={[styles.heroWidget, { borderColor: colors.widgetBorder }]}
            onPress={() => router.push('/shop' as never)}
            activeOpacity={0.85}
            testID="menu-shop"
          >
            <LinearGradient
              colors={[widgetShades.shop.from, widgetShades.shop.to]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroLeft}>
                <View style={[styles.heroIconWrap, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <ShoppingBag size={26} color={isDark ? '#fff' : '#7A5A00'} />
                </View>
                <View style={styles.heroTextWrap}>
                  <Text style={[styles.heroLabel, !isDark && { color: '#5A4000' }]}>Shop</Text>
                  <Text style={[styles.heroSublabel, !isDark && { color: 'rgba(90,64,0,0.7)' }]}>Loot • Power-ups • Premium</Text>
                </View>
              </View>
              <View style={styles.heroRight}>
                <ChevronRight size={22} color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(90,64,0,0.5)'} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: GRID_PAD,
  },
  header: {
    marginBottom: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  settingsBtn: {
    padding: 8,
    borderRadius: 12,
  },
  companionCard: {
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  companionGradient: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  companionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companionTextArea: {
    flex: 1,
  },
  speechBubble: {
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    position: 'relative',
    borderWidth: 1,
  },
  speechText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  bondBar: {
    gap: 3,
  },
  bondBarBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bondBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  bondLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
  },
  dailyReward: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  dailyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    gap: 10,
    borderRadius: 14,
  },
  dailyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
  },
  dailyCoinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dailyCoinText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  heroWidget: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 17,
    flexWrap: 'wrap' as const,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  heroIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextWrap: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 19,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  heroSublabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.75)',
  },
  heroRight: {
    paddingLeft: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroWidgetHalf: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 10,
  },
  heroGradientCompact: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 19,
    alignItems: 'flex-start',
  },
  heroIconWrapSmall: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroLabelSmall: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 2,
  },
  heroSublabelSmall: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.8)',
  },
  kanjiStudyListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
    justifyContent: 'center',
  },
  kanjiStudyListText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
