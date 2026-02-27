import { ImageSourcePropType } from 'react-native';

export type ReinaExpression = 'neutral' | 'happy' | 'thinking' | 'smirk' | 'concerned' | 'proud';

export const REINA_IMAGES: Record<ReinaExpression, ImageSourcePropType> = {
  neutral: require('@/assets/images/reina/default_neutral.png'),
  happy: require('@/assets/images/reina/default_happy.png'),
  thinking: require('@/assets/images/reina/default_thinking.png'),
  smirk: require('@/assets/images/reina/default_smirk.png'),
  concerned: require('@/assets/images/reina/default_concerned.png'),
  proud: require('@/assets/images/reina/default_proud.png'),
};

export const MOOD_TO_EXPRESSION: Record<string, ReinaExpression> = {
  happy: 'happy',
  thinking: 'thinking',
  surprised: 'proud',
  disappointed: 'concerned',
  excited: 'happy',
};

export function getReinaImage(expression: ReinaExpression): ImageSourcePropType {
  return REINA_IMAGES[expression] ?? REINA_IMAGES.neutral;
}

export function moodToExpression(mood: string): ReinaExpression {
  return MOOD_TO_EXPRESSION[mood] ?? 'neutral';
}
