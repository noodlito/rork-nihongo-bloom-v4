export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'hint' | 'cosmetic' | 'premium' | 'ad';
  coinCost: number;
  emoji: string;
  quantity?: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hint-3', name: 'Hint Pack (3)', description: '3 hints for puzzles', type: 'hint', coinCost: 30, emoji: '\u{1F4A1}', quantity: 3 },
  { id: 'hint-10', name: 'Hint Pack (10)', description: '10 hints for puzzles', type: 'hint', coinCost: 80, emoji: '\u{1F4A1}', quantity: 10 },
  { id: 'ad-coins', name: 'Watch Ad', description: 'Watch a short ad to earn coins', type: 'ad', coinCost: 0, emoji: '\u{1F3AC}', quantity: 10 },
  { id: 'premium', name: 'Premium Pass', description: 'Remove ads + unlimited hints for all modes', type: 'premium', coinCost: 0, emoji: '\u{1F451}' },
];
