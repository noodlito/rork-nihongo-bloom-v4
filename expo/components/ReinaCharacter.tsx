import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { getReinaImage, type ReinaExpression } from '@/constants/reina';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReinaCharacterProps {
  expression: ReinaExpression;
  size?: 'small' | 'medium' | 'large';
  enableFloat?: boolean;
  faceZoom?: boolean;
}

const SIZE_MAP = {
  small: { width: 100, height: 125 },
  medium: { width: SCREEN_WIDTH * 0.38, height: SCREEN_WIDTH * 0.48 },
  large: { width: SCREEN_WIDTH * 0.48, height: SCREEN_WIDTH * 0.6 },
} as const;

function ReinaCharacterInner({ expression, size = 'medium', enableFloat = true, faceZoom = false }: ReinaCharacterProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  const imageSource = getReinaImage(expression);
  const dimensions = SIZE_MAP[size];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!enableFloat) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 2400, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [enableFloat]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
          opacity: fadeAnim,
          transform: [
            { translateY: floatAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View style={[styles.imageWrapper, { width: dimensions.width, height: dimensions.height }, faceZoom && styles.imageWrapperZoom]}>
        <Image
          source={imageSource}
          style={[
            styles.image,
            faceZoom
              ? { width: dimensions.width * 2, height: dimensions.height * 2, marginTop: dimensions.height * -0.15, marginLeft: dimensions.width * -0.5 }
              : { width: dimensions.width, height: dimensions.height },
          ]}
          resizeMode={faceZoom ? 'cover' : 'contain'}
        />
      </View>
    </Animated.View>
  );
}

export const ReinaCharacter = React.memo(ReinaCharacterInner);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageWrapperZoom: {
    borderRadius: 24,
  },
  image: {},
});
