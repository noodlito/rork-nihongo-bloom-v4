import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

function FloralOverlayInner() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.petal, styles.petal1]} />
      <View style={[styles.petal, styles.petal2]} />
      <View style={[styles.petal, styles.petal3]} />
      <View style={[styles.petal, styles.petal4]} />
      <View style={[styles.petal, styles.petal5]} />
      <View style={[styles.petal, styles.petal6]} />
      <View style={[styles.petal, styles.petal7]} />
      <View style={[styles.glowOrb, styles.orb1]} />
      <View style={[styles.glowOrb, styles.orb2]} />
      <View style={[styles.glowOrb, styles.orb3]} />
    </View>
  );
}

export const FloralOverlay = React.memo(FloralOverlayInner);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  petal: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.08,
  },
  petal1: {
    width: 80,
    height: 80,
    backgroundColor: '#E8547C',
    top: height * 0.08,
    right: -20,
    transform: [{ rotate: '15deg' }],
  },
  petal2: {
    width: 50,
    height: 50,
    backgroundColor: '#F8A0C8',
    top: height * 0.25,
    left: 20,
    transform: [{ rotate: '-30deg' }],
  },
  petal3: {
    width: 35,
    height: 35,
    backgroundColor: '#D65B8A',
    top: height * 0.45,
    right: 40,
    transform: [{ rotate: '45deg' }],
  },
  petal4: {
    width: 60,
    height: 60,
    backgroundColor: '#9B6FD4',
    bottom: height * 0.3,
    left: -15,
    transform: [{ rotate: '20deg' }],
  },
  petal5: {
    width: 40,
    height: 40,
    backgroundColor: '#E8547C',
    bottom: height * 0.15,
    right: 30,
    transform: [{ rotate: '-20deg' }],
  },
  petal6: {
    width: 25,
    height: 25,
    backgroundColor: '#F8A0C8',
    top: height * 0.6,
    left: width * 0.4,
  },
  petal7: {
    width: 45,
    height: 45,
    backgroundColor: '#B088E0',
    top: height * 0.12,
    left: width * 0.3,
    transform: [{ rotate: '60deg' }],
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.06,
  },
  orb1: {
    width: 200,
    height: 200,
    backgroundColor: '#E8547C',
    top: -60,
    right: -60,
  },
  orb2: {
    width: 250,
    height: 250,
    backgroundColor: '#9B6FD4',
    bottom: -80,
    left: -80,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#F8A0C8',
    top: height * 0.4,
    right: -40,
  },
});
