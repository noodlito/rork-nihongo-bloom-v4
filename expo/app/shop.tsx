import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, Crown, Play, X, Check, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FloralOverlay } from '@/components/FloralOverlay';
import { SHOP_ITEMS, type ShopItem } from '@/mocks/shop';

type ModalType = 'purchase' | 'ad' | 'premium' | 'result' | null;

interface ModalState {
  type: ModalType;
  item?: ShopItem;
  resultMessage?: string;
  resultSuccess?: boolean;
}

const AD_DURATION = 5;

export default function ShopScreen() {
  const game = useGame();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [modal, setModal] = useState<ModalState>({ type: null });
  const [adTimer, setAdTimer] = useState(AD_DURATION);
  const [adCooldown, setAdCooldown] = useState(false);
  const modalFade = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(60)).current;
  const adProgress = useRef(new Animated.Value(0)).current;

  const showModal = useCallback((state: ModalState) => {
    setModal(state);
    modalFade.setValue(0);
    modalSlide.setValue(60);
    Animated.parallel([
      Animated.timing(modalFade, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(modalSlide, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [modalFade, modalSlide]);

  const hideModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(modalFade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(modalSlide, { toValue: 60, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setModal({ type: null });
      setAdTimer(AD_DURATION);
      adProgress.setValue(0);
    });
  }, [modalFade, modalSlide, adProgress]);

  useEffect(() => {
    if (modal.type !== 'ad') return;
    setAdTimer(AD_DURATION);
    adProgress.setValue(0);
    Animated.timing(adProgress, { toValue: 1, duration: AD_DURATION * 1000, useNativeDriver: false }).start();
    const interval = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [modal.type, adProgress]);

  const handleWatchAd = () => {
    if (adCooldown) {
      showModal({ type: 'result', resultMessage: 'Please wait before watching another ad.', resultSuccess: false });
      return;
    }
    showModal({ type: 'ad' });
  };

  const claimAdReward = () => {
    game.addCoins(10);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAdCooldown(true);
    setTimeout(() => setAdCooldown(false), 5000);
    hideModal();
    setTimeout(() => {
      showModal({ type: 'result', resultMessage: '+10 coins added!', resultSuccess: true });
    }, 350);
  };

  const handlePurchase = (item: ShopItem) => {
    if (item.type === 'premium') {
      showModal({ type: 'premium', item });
      return;
    }
    if (item.type === 'ad') {
      handleWatchAd();
      return;
    }
    if (game.coins < item.coinCost) {
      showModal({ type: 'result', resultMessage: 'Not enough coins! Play more to earn coins.', resultSuccess: false });
      return;
    }
    showModal({ type: 'purchase', item });
  };

  const confirmPurchase = () => {
    const item = modal.item;
    if (!item) return;
    if (!game.spendCoins(item.coinCost)) {
      hideModal();
      return;
    }
    if (item.id.startsWith('hint')) {
      game.addHints(item.quantity || 0);
    } else if (item.id.startsWith('theme')) {
      const themeId = item.id.replace('theme-', '');
      game.unlockTheme(themeId);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    hideModal();
    setTimeout(() => {
      showModal({ type: 'result', resultMessage: `${item.name} purchased!`, resultSuccess: true });
    }, 350);
  };

  const confirmPremium = () => {
    game.setPremium(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    hideModal();
    setTimeout(() => {
      showModal({ type: 'result', resultMessage: 'Premium activated! Enjoy unlimited hints and no ads.', resultSuccess: true });
    }, 350);
  };

  const categories = [
    { key: 'hint', label: 'Power-Ups ⚡', items: SHOP_ITEMS.filter(i => i.type === 'hint') },
    { key: 'ad', label: 'Free Loot 🎬', items: SHOP_ITEMS.filter(i => i.type === 'ad') },
    { key: 'premium', label: 'Premium Pass 👑', items: SHOP_ITEMS.filter(i => i.type === 'premium') },
  ];

  const progressWidth = adProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const renderModal = () => {
    if (!modal.type) return null;

    return (
      <Modal transparent visible animationType="none" onRequestClose={hideModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: modalFade }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={modal.type === 'ad' && adTimer > 0 ? undefined : hideModal} activeOpacity={1} />
          <Animated.View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ translateY: modalSlide }] }]}>
            {modal.type === 'purchase' && modal.item && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Confirm Purchase</Text>
                  <TouchableOpacity onPress={hideModal} style={[styles.modalClose, { backgroundColor: colors.inputBg }]}>
                    <X size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalEmoji}>{modal.item.emoji}</Text>
                  <Text style={[styles.modalItemName, { color: colors.text }]}>{modal.item.name}</Text>
                  <Text style={[styles.modalItemDesc, { color: colors.textMuted }]}>{modal.item.description}</Text>
                  <View style={[styles.modalPriceRow, { backgroundColor: colors.sakuraPinkLight }]}>
                    <Coins size={16} color={colors.sakuraPink} />
                    <Text style={[styles.modalPrice, { color: colors.sakuraPink }]}>{modal.item.coinCost} coins</Text>
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.inputBg }]} onPress={hideModal}>
                    <Text style={[styles.modalBtnText, { color: colors.textLight }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.sakuraPink }]} onPress={confirmPurchase}>
                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>Buy</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {modal.type === 'ad' && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Watching Ad</Text>
                  {adTimer === 0 && (
                    <TouchableOpacity onPress={hideModal} style={[styles.modalClose, { backgroundColor: colors.inputBg }]}>
                      <X size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.modalBody}>
                  <View style={[styles.adScreen, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
                    <Play size={48} color={colors.textMuted} />
                    <Text style={[styles.adScreenText, { color: colors.textMuted }]}>Ad playing...</Text>
                  </View>
                  <View style={[styles.adProgressBg, { backgroundColor: colors.inputBg }]}>
                    <Animated.View style={[styles.adProgressFill, { width: progressWidth, backgroundColor: colors.success }]} />
                  </View>
                  {adTimer > 0 ? (
                    <View style={styles.adTimerRow}>
                      <Clock size={14} color={colors.textMuted} />
                      <Text style={[styles.adTimerText, { color: colors.textMuted }]}>{adTimer}s remaining</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.success, marginTop: 12 }]} onPress={claimAdReward}>
                      <Check size={18} color="#fff" />
                      <Text style={[styles.modalBtnText, { color: '#fff', marginLeft: 6 }]}>Claim Loot!</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {modal.type === 'premium' && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Premium Pass</Text>
                  <TouchableOpacity onPress={hideModal} style={[styles.modalClose, { backgroundColor: colors.inputBg }]}>
                    <X size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <LinearGradient colors={[colors.gold, colors.warning]} style={styles.premiumBadge}>
                    <Crown size={32} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.modalItemName, { color: colors.text }]}>Go Premium</Text>
                  <View style={styles.premiumPerks}>
                    {['Unlimited hints for all modes', 'Ad-free experience', 'Support development'].map(perk => (
                      <View key={perk} style={styles.perkRow}>
                        <Check size={14} color={colors.success} />
                        <Text style={[styles.perkText, { color: colors.textLight }]}>{perk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.inputBg }]} onPress={hideModal}>
                    <Text style={[styles.modalBtnText, { color: colors.textLight }]}>Maybe Later</Text>
                  </TouchableOpacity>
                  {game.isPremium ? (
                    <View style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.success }]}>
                      <Check size={16} color="#fff" />
                      <Text style={[styles.modalBtnText, { color: '#fff', marginLeft: 4 }]}>Active</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.gold }]} onPress={confirmPremium}>
                      <Crown size={16} color="#fff" />
                      <Text style={[styles.modalBtnText, { color: '#fff', marginLeft: 4 }]}>Activate</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {modal.type === 'result' && (
              <>
                <View style={styles.modalBody}>
                  <View style={[styles.resultIcon, { backgroundColor: modal.resultSuccess ? colors.successLight : colors.errorLight }]}>
                    {modal.resultSuccess ? (
                      <Check size={28} color={colors.success} />
                    ) : (
                      <X size={28} color={colors.error} />
                    )}
                  </View>
                  <Text style={[styles.modalItemName, { color: colors.text }]}>{modal.resultMessage}</Text>
                </View>
                <View style={[styles.modalActions, { justifyContent: 'center' }]}>
                  <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.sakuraPink }]} onPress={hideModal}>
                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>OK</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Shop', headerStyle: { backgroundColor: colors.headerBg }, headerTintColor: colors.text, headerTransparent: true }} />
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFill} />
      <FloralOverlay />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 56 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.coinBar, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
          <Coins size={20} color={colors.gold} />
          <Text style={[styles.coinCount, { color: colors.text }]}>{game.coins}</Text>
          <Text style={[styles.coinLabel, { color: colors.textMuted }]}>coins</Text>
        </View>

        <View style={styles.inventoryRow}>
          <View style={[styles.inventoryItem, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
            <Text style={styles.inventoryEmoji}>💡</Text>
            <Text style={[styles.inventoryValue, { color: colors.text }]}>{game.isPremium ? '∞' : game.hints}</Text>
            <Text style={[styles.inventoryLabel, { color: colors.textMuted }]}>Hints</Text>
          </View>
          {game.isPremium && (
            <View style={[styles.inventoryItem, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
              <Crown size={20} color={colors.gold} />
              <Text style={[styles.inventoryValue, { color: colors.gold }]}>PRO</Text>
              <Text style={[styles.inventoryLabel, { color: colors.textMuted }]}>Premium</Text>
            </View>
          )}
        </View>

        {categories.map(cat => (
          <View key={cat.key}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{cat.label}</Text>
            <View style={styles.itemsGrid}>
              {cat.items.map(item => {
                const canAfford = game.coins >= item.coinCost || item.type === 'premium';
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.shopCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }, !canAfford && item.type !== 'premium' && styles.shopCardDim]}
                    onPress={() => handlePurchase(item)}
                    activeOpacity={0.7}
                  >
                    {item.type === 'premium' && (
                      <LinearGradient colors={[colors.gold, colors.warning]} style={styles.premiumGradient}>
                        <Crown size={24} color="#fff" />
                      </LinearGradient>
                    )}
                    {item.type === 'ad' && (
                      <View style={[styles.adIconCircle, { backgroundColor: colors.successLight }]}>
                        <Play size={22} color={colors.success} />
                      </View>
                    )}
                    {item.type !== 'premium' && item.type !== 'ad' && (
                      <Text style={styles.shopEmoji}>{item.emoji}</Text>
                    )}
                    <Text style={[styles.shopName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.shopDesc, { color: colors.textMuted }]}>{item.description}</Text>
                    {item.type === 'ad' ? (
                      <View style={[styles.priceTag, { backgroundColor: colors.successLight }]}>
                        <Text style={[styles.priceText, { color: colors.success }]}>+{item.quantity} coins</Text>
                        <Coins size={11} color={colors.success} />
                      </View>
                    ) : item.type === 'premium' ? (
                      <View style={[styles.priceTag, { backgroundColor: colors.goldLight }]}>
                        <Text style={[styles.priceText, { color: colors.gold }]}>{game.isPremium ? 'Active' : 'Activate'}</Text>
                      </View>
                    ) : (
                      <View style={[styles.priceTag, { backgroundColor: colors.sakuraPinkLight }]}>
                        <Text style={[styles.priceText, { color: colors.sakuraPink }]}>{item.coinCost}</Text>
                        <Coins size={11} color={colors.sakuraPink} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      {renderModal()}
    </View>
  );
}

const { width: SCREEN_W } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 18, paddingBottom: 40 },
  coinBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1 },
  coinCount: { fontSize: 24, fontWeight: '800' as const },
  coinLabel: { fontSize: 14, fontWeight: '500' as const },
  inventoryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  inventoryItem: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1 },
  inventoryEmoji: { fontSize: 20, marginBottom: 4 },
  inventoryValue: { fontSize: 20, fontWeight: '800' as const },
  inventoryLabel: { fontSize: 11, fontWeight: '500' as const },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, marginBottom: 10 },
  itemsGrid: { gap: 10, marginBottom: 24 },
  shopCard: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, flexWrap: 'wrap' },
  shopCardDim: { opacity: 0.6 },
  shopEmoji: { fontSize: 28 },
  premiumGradient: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  adIconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shopName: { fontSize: 15, fontWeight: '700' as const, flex: 1 },
  shopDesc: { fontSize: 12, width: '100%', marginTop: -4, marginLeft: 40, paddingLeft: 12 },
  priceTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  priceText: { fontSize: 13, fontWeight: '700' as const },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: Math.min(SCREEN_W - 48, 380),
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  modalItemName: {
    fontSize: 17,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  modalItemDesc: {
    fontSize: 13,
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  modalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
  },
  modalBtnPrimary: {},
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  adScreen: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  adScreenText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  adProgressBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  adProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  adTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  adTimerText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  premiumBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  premiumPerks: {
    gap: 8,
    marginTop: 12,
    alignSelf: 'stretch',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  resultIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
