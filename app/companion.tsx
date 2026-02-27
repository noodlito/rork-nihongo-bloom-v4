import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Home, ChevronLeft, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FloralOverlay } from '@/components/FloralOverlay';
import { getXpLevel } from '@/mocks/companion';
import { ReinaCharacter } from '@/components/ReinaCharacter';
import type { ReinaExpression } from '@/constants/reina';
import {
  MAIN_TOPICS,
  getSubTopics,
  getTopicIntro,
  getResponseForSub,
  getSubIntro,
  type TopicKey,
  type SubKey,
  type BubbleOption,
} from '@/mocks/companion_chat';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'reina';
  expression?: ReinaExpression;
  timestamp: number;
}

type ConversationState =
  | { phase: 'main' }
  | { phase: 'subtopic'; topic: TopicKey }
  | { phase: 'result'; topic: TopicKey; sub: SubKey };

const EXPRESSIONS_CYCLE: ReinaExpression[] = ['happy', 'proud', 'smirk', 'happy', 'proud'];

export default function CompanionScreen() {
  const router = useRouter();
  const game = useGame();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const xpInfo = useMemo(() => getXpLevel(game.xpLevel), [game.xpLevel]);
  const heartAnim = useRef(new Animated.Value(1)).current;
  const expressionIdx = useRef(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Oi~! I'm Reina! 🌸 Your guide through the world of Japanese! Pick a topic and let's go on a side quest together~ ...Don't keep me waiting!",
      sender: 'reina',
      expression: 'happy',
      timestamp: Date.now(),
    },
  ]);
  const [convState, setConvState] = useState<ConversationState>({ phase: 'main' });
  const [reinaExpression, setReinaExpression] = useState<ReinaExpression>('happy');
  const [isTyping, setIsTyping] = useState(false);
  const bubbleFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(heartAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  }, []);

  const animateBubbles = useCallback(() => {
    bubbleFade.setValue(0);
    Animated.timing(bubbleFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [bubbleFade]);

  const nextExpression = useCallback((): ReinaExpression => {
    const expr = EXPRESSIONS_CYCLE[expressionIdx.current % EXPRESSIONS_CYCLE.length];
    expressionIdx.current += 1;
    return expr;
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollToBottom();
  }, [scrollToBottom]);

  const addReinaMessage = useCallback((text: string, expression: ReinaExpression, delay = 600) => {
    setIsTyping(true);
    setReinaExpression('thinking');
    scrollToBottom();

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const msg: ChatMessage = {
          id: `reina-${Date.now()}-${Math.random()}`,
          text,
          sender: 'reina',
          expression,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, msg]);
        setReinaExpression(expression);
        setIsTyping(false);
        game.addXp(1);
        scrollToBottom();
        resolve();
      }, delay + Math.random() * 400);
    });
  }, [scrollToBottom, game]);

  const handleTopicSelect = useCallback(async (topic: BubbleOption) => {
    addUserMessage(`${topic.emoji} ${topic.label}`);
    const topicKey = topic.id as TopicKey;
    const intro = getTopicIntro(topicKey);
    const expr = nextExpression();
    await addReinaMessage(intro, expr);
    setConvState({ phase: 'subtopic', topic: topicKey });
    animateBubbles();
  }, [addUserMessage, addReinaMessage, nextExpression, animateBubbles]);

  const handleSubSelect = useCallback(async (sub: BubbleOption, topic: TopicKey) => {
    addUserMessage(`${sub.emoji} ${sub.label}`);
    const subKey = sub.id as SubKey;
    const introExpr = nextExpression();
    await addReinaMessage(getSubIntro(subKey), introExpr);
    const response = getResponseForSub(subKey);
    const responseExpr = nextExpression();
    await addReinaMessage(response, responseExpr, 400);
    setConvState({ phase: 'result', topic, sub: subKey });
    animateBubbles();
  }, [addUserMessage, addReinaMessage, nextExpression, animateBubbles]);

  const handleAnotherFromSame = useCallback(async (topic: TopicKey, sub: SubKey) => {
    addUserMessage('🔄 Tell me another!');
    const response = getResponseForSub(sub);
    const expr = nextExpression();
    await addReinaMessage(response, expr);
    setConvState({ phase: 'result', topic, sub });
    animateBubbles();
  }, [addUserMessage, addReinaMessage, nextExpression, animateBubbles]);

  const handleBackToSub = useCallback(async (topic: TopicKey) => {
    addUserMessage('◀️ Other options');
    const expr = nextExpression();
    await addReinaMessage("Mou~ fine, what else do you wanna know? 🌸", expr);
    setConvState({ phase: 'subtopic', topic });
    animateBubbles();
  }, [addUserMessage, addReinaMessage, nextExpression, animateBubbles]);

  const handleBackToMain = useCallback(async () => {
    addUserMessage('🏠 Main topics');
    const expr = nextExpression();
    await addReinaMessage("Back to the main menu! Pick your next quest~ ✨", expr);
    setConvState({ phase: 'main' });
    animateBubbles();
  }, [addUserMessage, addReinaMessage, nextExpression, animateBubbles]);

  const currentBubbles = useMemo((): BubbleOption[] => {
    switch (convState.phase) {
      case 'main':
        return MAIN_TOPICS;
      case 'subtopic':
        return getSubTopics(convState.topic);
      case 'result':
        return [];
    }
  }, [convState]);

  const renderBubbles = () => {
    if (isTyping) return null;

    if (convState.phase === 'result') {
      const { topic, sub } = convState;
      return (
        <Animated.View style={[styles.bubblesContainer, { opacity: bubbleFade }]}>
          <TouchableOpacity
            style={[styles.actionBubble, { backgroundColor: colors.sakuraPink }]}
            onPress={() => handleAnotherFromSame(topic, sub)}
            activeOpacity={0.7}
            testID="btn-another"
          >
            <RotateCcw size={14} color="#fff" />
            <Text style={styles.actionBubbleText}>Tell me another!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBubble, { backgroundColor: colors.lavender }]}
            onPress={() => handleBackToSub(topic)}
            activeOpacity={0.7}
            testID="btn-back-sub"
          >
            <ChevronLeft size={14} color="#fff" />
            <Text style={styles.actionBubbleText}>Other options</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBubble, { backgroundColor: colors.cardGlass, borderWidth: 1, borderColor: colors.border }]}
            onPress={handleBackToMain}
            activeOpacity={0.7}
            testID="btn-back-main"
          >
            <Home size={14} color={colors.text} />
            <Text style={[styles.actionBubbleText, { color: colors.text }]}>Main topics</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[styles.bubblesContainer, { opacity: bubbleFade }]}>
        {currentBubbles.map((bubble) => (
          <TouchableOpacity
            key={bubble.id}
            style={[styles.topicBubble, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
            onPress={() => {
              if (convState.phase === 'main') {
                handleTopicSelect(bubble);
              } else if (convState.phase === 'subtopic') {
                handleSubSelect(bubble, convState.topic);
              }
            }}
            activeOpacity={0.7}
            testID={`bubble-${bubble.id}`}
          >
            <Text style={styles.topicEmoji}>{bubble.emoji}</Text>
            <Text style={[styles.topicLabel, { color: colors.text }]}>{bubble.label}</Text>
          </TouchableOpacity>
        ))}
        {convState.phase === 'subtopic' && (
          <TouchableOpacity
            style={[styles.backBubble, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)', borderColor: colors.border }]}
            onPress={handleBackToMain}
            activeOpacity={0.7}
            testID="btn-back-main-sub"
          >
            <ChevronLeft size={14} color={colors.textMuted} />
            <Text style={[styles.backBubbleText, { color: colors.textMuted }]}>Back to topics</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Reina',
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: colors.text,
          headerTransparent: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/')} style={{ paddingLeft: 8 }}>
              <Home size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />

      <View style={styles.flex}>
        <View style={[styles.bondBar, { backgroundColor: colors.cardGlass, borderBottomColor: colors.border, paddingTop: insets.top + 44 }]}>
          <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
            <Heart size={14} color={colors.sakuraPink} fill={colors.sakuraPink} />
          </Animated.View>
          <Text style={[styles.bondText, { color: colors.text }]}>XP Lv.{xpInfo.level}</Text>
          <View style={[styles.bondProgress, { backgroundColor: isDark ? 'rgba(240,104,144,0.12)' : 'rgba(232,84,124,0.1)' }]}>
            <View style={[styles.bondFill, { width: `${xpInfo.progress * 100}%` as const, backgroundColor: colors.sakuraPink }]} />
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={[styles.chatContent, { paddingBottom: 16 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.sender === 'user' && styles.msgRowUser]}>
              {msg.sender === 'reina' && (
                <View style={styles.avatarContainer}>
                  <ReinaCharacter
                    expression={msg.expression || 'neutral'}
                    size="small"
                    enableFloat={false}
                    faceZoom={true}
                  />
                </View>
              )}
              <View style={[
                styles.bubble,
                msg.sender === 'user'
                  ? [styles.bubbleUser, { backgroundColor: colors.sakuraPink }]
                  : [styles.bubbleReina, { backgroundColor: colors.cardGlass, borderColor: colors.border }],
              ]}>
                <Text style={[
                  styles.bubbleText,
                  { color: colors.text },
                  msg.sender === 'user' && styles.bubbleTextUser,
                ]}>{msg.text}</Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.msgRow}>
              <View style={styles.avatarContainer}>
                <ReinaCharacter expression="thinking" size="small" enableFloat={false} faceZoom={true} />
              </View>
              <View style={[styles.bubble, styles.bubbleReina, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
                <Text style={[styles.typingDots, { color: colors.textMuted }]}>...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: colors.cardGlass, borderTopColor: colors.border }]}>
          {renderBubbles()}
        </View>
      </View>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  bondBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  bondText: { fontSize: 12, fontWeight: '600' as const },
  bondProgress: { flex: 1, height: 5, borderRadius: 3, overflow: 'hidden' },
  bondFill: { height: '100%', borderRadius: 3 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16 },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: { justifyContent: 'flex-end' },
  avatarContainer: {
    width: 44,
    height: 44,
    overflow: 'hidden',
    borderRadius: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  bubble: {
    maxWidth: '72%',
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 14,
  },
  bubbleReina: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  bubbleTextUser: { color: '#fff' },
  typingDots: { fontSize: 20, fontWeight: '700' as const, letterSpacing: 3 },
  bottomArea: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  topicBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: SCREEN_WIDTH * 0.28,
  },
  topicEmoji: { fontSize: 18 },
  topicLabel: { fontSize: 14, fontWeight: '600' as const },
  actionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  actionBubbleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  backBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  backBubbleText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
});
