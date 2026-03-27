import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2, BookOpen, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useGame, type StudyWord, type MissedWord } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FloralOverlay } from '@/components/FloralOverlay';

type TabKey = 'saved' | 'missed';

interface RemoveModalState {
  visible: boolean;
  word: string;
  type: 'saved' | 'missed';
}

export default function StudyListScreen() {
  const game = useGame();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('saved');
  const [removeModal, setRemoveModal] = useState<RemoveModalState>({ visible: false, word: '', type: 'saved' });
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const showRemoveOverlay = (word: string, type: 'saved' | 'missed') => {
    setRemoveModal({ visible: true, word, type });
    overlayAnim.setValue(0);
    cardAnim.setValue(0);
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(cardAnim, { toValue: 1, friction: 8, tension: 65, useNativeDriver: true }),
    ]).start();
  };

  const hideRemoveOverlay = () => {
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setRemoveModal({ visible: false, word: '', type: 'saved' });
    });
  };

  const confirmRemove = () => {
    if (removeModal.type === 'saved') {
      game.removeFromStudyList(removeModal.word);
    } else {
      game.removeMissedWord(removeModal.word);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    hideRemoveOverlay();
  };

  const handleRemove = (word: string) => {
    showRemoveOverlay(word, 'saved');
  };

  const handleRemoveMissed = (word: string) => {
    showRemoveOverlay(word, 'missed');
  };

  const renderWord = ({ item }: { item: StudyWord }) => (
    <View style={[styles.wordCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
      <View style={styles.wordLeft}>
        <Text style={[styles.wordText, { color: colors.text }]}>{item.word}</Text>
        <Text style={[styles.wordMeaning, { color: colors.textLight }]}>{item.meaning}</Text>
        {item.kana && (
          <View style={styles.japaneseRow}>
            <Text style={[styles.kanaText, { color: colors.lavenderDark }]}>{item.kana}</Text>
            {item.romaji && <Text style={[styles.romajiText, { color: colors.textMuted }]}>({item.romaji})</Text>}
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.word)} style={[styles.removeBtn, { backgroundColor: colors.errorLight }]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Trash2 size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const renderMissedWord = ({ item }: { item: MissedWord }) => (
    <View style={[styles.wordCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
      <View style={styles.wordLeft}>
        <Text style={[styles.wordText, { color: colors.text }]}>{item.word}</Text>
        <Text style={[styles.wordMeaning, { color: colors.textLight }]}>{item.meaning}</Text>
        {item.reading && (
          <Text style={[styles.kanaText, { color: colors.lavenderDark }]}>{item.reading}</Text>
        )}
        <View style={[styles.modeBadge, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.modeBadgeText, { color: colors.warning }]}>{item.mode}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleRemoveMissed(item.word)} style={[styles.removeBtn, { backgroundColor: colors.errorLight }]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Trash2 size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const savedCount = game.studyList.length;
  const missedCount = game.missedWords.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Study List', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />

      <View style={[styles.tabBar, { backgroundColor: colors.cardGlass, borderBottomColor: colors.border, paddingTop: insets.top + 44 }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && { borderBottomColor: colors.sakuraPink, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('saved')}
          activeOpacity={0.7}
        >
          <BookOpen size={16} color={activeTab === 'saved' ? colors.sakuraPink : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'saved' ? colors.sakuraPink : colors.textMuted }]}>
            Saved ({savedCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'missed' && { borderBottomColor: colors.warning, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('missed')}
          activeOpacity={0.7}
        >
          <AlertCircle size={16} color={activeTab === 'missed' ? colors.warning : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'missed' ? colors.warning : colors.textMuted }]}>
            Missed ({missedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'saved' ? (
        savedCount === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Words Yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>Save words from Kanji mode to build your study list!</Text>
          </View>
        ) : (
          <FlatList
            data={game.studyList}
            renderItem={renderWord}
            keyExtractor={item => item.word + item.addedAt}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={[styles.countText, { color: colors.textMuted }]}>{savedCount} words saved</Text>
              </View>
            }
          />
        )
      ) : (
        missedCount === 0 ? (
          <View style={styles.emptyState}>
            <AlertCircle size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Missed Words</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>Words you get wrong in Kanji mode will appear here for review.</Text>
          </View>
        ) : (
          <FlatList
            data={game.missedWords}
            renderItem={renderMissedWord}
            keyExtractor={item => item.word + item.missedAt}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={[styles.countText, { color: colors.textMuted }]}>{missedCount} missed words</Text>
              </View>
            }
          />
        )
      )}
      <Modal visible={removeModal.visible} transparent animationType="none">
        <Animated.View style={[styles.removeOverlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={hideRemoveOverlay} />
          <Animated.View style={[
            styles.removeCard,
            { backgroundColor: colors.card, borderColor: colors.border,
              opacity: cardAnim,
              transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }]
            }
          ]}>
            <View style={[styles.removeIconCircle, { backgroundColor: colors.errorLight }]}>
              <Trash2 size={28} color={colors.error} />
            </View>
            <Text style={[styles.removeTitle, { color: colors.text }]}>Remove Word</Text>
            <Text style={[styles.removeDesc, { color: colors.textLight }]}>
              Remove "{removeModal.word}" from your {removeModal.type === 'saved' ? 'study list' : 'missed words'}?
            </Text>
            <View style={styles.removeActions}>
              <TouchableOpacity
                style={[styles.removeActionBtn, styles.removeCancelBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }]}
                onPress={hideRemoveOverlay}
                activeOpacity={0.7}
              >
                <Text style={[styles.removeCancelText, { color: colors.textLight }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.removeActionBtn, styles.removeConfirmBtn, { backgroundColor: colors.error }]}
                onPress={confirmRemove}
                activeOpacity={0.7}
              >
                <Text style={styles.removeConfirmText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  tabText: { fontSize: 14, fontWeight: '600' as const },
  listContent: { padding: 18, paddingBottom: 40 },
  listHeader: { marginBottom: 12 },
  countText: { fontSize: 13, fontWeight: '500' as const },
  wordCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1 },
  wordLeft: { flex: 1 },
  wordText: { fontSize: 17, fontWeight: '700' as const, marginBottom: 2 },
  wordMeaning: { fontSize: 13, fontWeight: '500' as const },
  japaneseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  kanaText: { fontSize: 13, fontWeight: '600' as const, marginTop: 2 },
  romajiText: { fontSize: 12 },
  modeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  modeBadgeText: { fontSize: 10, fontWeight: '600' as const },
  removeBtn: { padding: 8, borderRadius: 10 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700' as const, marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  removeOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  removeCard: { width: '100%', borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1 },
  removeIconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  removeTitle: { fontSize: 20, fontWeight: '700' as const, marginBottom: 8 },
  removeDesc: { fontSize: 14, fontWeight: '500' as const, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  removeActions: { flexDirection: 'row', gap: 12, width: '100%' },
  removeActionBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  removeCancelBtn: { borderWidth: 1 },
  removeCancelText: { fontSize: 15, fontWeight: '600' as const },
  removeConfirmBtn: {},
  removeConfirmText: { fontSize: 15, fontWeight: '700' as const, color: '#fff' },
});
