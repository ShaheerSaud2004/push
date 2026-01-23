import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { typography, spacing } from '../theme';

type PlayingCardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  isRevealed: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  children,
  onPress,
  onLongPress,
  isRevealed,
  disabled = false,
  style,
}) => {
  const { colors, theme } = useTheme();
  const flipRotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isRevealed) {
      // Smooth flip animation with slight scale up
      flipRotation.value = withSpring(180, {
        damping: 12,
        stiffness: 120,
        mass: 0.8,
      });
      scale.value = withSpring(1.03, {
        damping: 10,
        stiffness: 180,
      });
    } else {
      flipRotation.value = withSpring(0, {
        damping: 12,
        stiffness: 120,
        mass: 0.8,
      });
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 180,
      });
    }
  }, [isRevealed, flipRotation, scale]);


  // Front side (back of card - what you see before reveal)
  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipRotation.value,
      [0, 180],
      [0, 180],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      opacity: flipRotation.value < 90 ? 1 : 0,
      backfaceVisibility: 'hidden' as const,
    };
  });

  // Back side (revealed content)
  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipRotation.value,
      [0, 180],
      [180, 360],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      opacity: flipRotation.value >= 90 ? 1 : 0,
      backfaceVisibility: 'hidden' as const,
    };
  });

  const getCardBackPattern = () => {
    const patternColor = theme === 'dark' ? colors.accent : colors.text;
    const patternOpacity = theme === 'soft' ? 0.08 : theme === 'paper' ? 0.12 : 0.15;
    const circleOpacity = theme === 'dark' ? 0.25 : 0.20;
    const textOpacity = theme === 'dark' ? 0.35 : 0.30;
    
    return (
      <View style={styles.patternContainer}>
        {/* Central watermark - Arabic text */}
        <View style={styles.patternTextContainer}>
          <Text style={[styles.patternText, { color: patternColor, opacity: textOpacity }]}>
            خفي
          </Text>
        </View>
        
        {/* Large semi-transparent circular overlay on Arabic text */}
        <View style={[styles.largeCircleOverlay, { 
          backgroundColor: patternColor, 
          opacity: circleOpacity,
        }]} />
        
        {/* Islamic Geometric Pattern - 8-pointed star in center */}
        <View style={[styles.starContainer, { top: '50%', left: '50%' }]}>
          <View style={[styles.starLine, styles.starLine1, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine2, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine3, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine4, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine5, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine6, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine7, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
          <View style={[styles.starLine, styles.starLine8, { backgroundColor: patternColor, opacity: patternOpacity * 0.8 }]} />
        </View>
        
        {/* Central decorative circle */}
        <View style={[styles.centralCircle, { top: '50%', left: '50%', borderColor: patternColor, opacity: patternOpacity * 0.9 }]} />
        
        {/* Secondary circle layer */}
        <View style={[styles.secondaryCircle, { top: '50%', left: '50%', borderColor: patternColor, opacity: patternOpacity * 0.6 }]} />

        {/* Corner geometric patterns - L-shaped */}
        <View style={[styles.cornerPattern, styles.cornerTopLeft]}>
          <View style={[styles.geometricLine, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
          <View style={[styles.geometricLine, styles.geometricLineVertical, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
        </View>
        
        <View style={[styles.cornerPattern, styles.cornerTopRight]}>
          <View style={[styles.geometricLine, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
          <View style={[styles.geometricLine, styles.geometricLineVertical, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
        </View>
        
        <View style={[styles.cornerPattern, styles.cornerBottomLeft]}>
          <View style={[styles.geometricLine, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
          <View style={[styles.geometricLine, styles.geometricLineVertical, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
        </View>
        
        <View style={[styles.cornerPattern, styles.cornerBottomRight]}>
          <View style={[styles.geometricLine, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
          <View style={[styles.geometricLine, styles.geometricLineVertical, { backgroundColor: patternColor, opacity: patternOpacity * 1.2 }]} />
        </View>
        
        {/* Additional corner accents */}
        <View style={[styles.cornerAccent, styles.cornerAccentTopLeft, { backgroundColor: patternColor, opacity: patternOpacity * 0.4 }]} />
        <View style={[styles.cornerAccent, styles.cornerAccentTopRight, { backgroundColor: patternColor, opacity: patternOpacity * 0.4 }]} />
        <View style={[styles.cornerAccent, styles.cornerAccentBottomLeft, { backgroundColor: patternColor, opacity: patternOpacity * 0.4 }]} />
        <View style={[styles.cornerAccent, styles.cornerAccentBottomRight, { backgroundColor: patternColor, opacity: patternOpacity * 0.4 }]} />

        {/* Border geometric lines - double layered */}
        <View style={[styles.borderLine, styles.borderTop, { backgroundColor: patternColor, opacity: patternOpacity * 1.3 }]} />
        <View style={[styles.borderLine, styles.borderBottom, { backgroundColor: patternColor, opacity: patternOpacity * 1.3 }]} />
        <View style={[styles.borderLine, styles.borderLeft, { backgroundColor: patternColor, opacity: patternOpacity * 1.3 }]} />
        <View style={[styles.borderLine, styles.borderRight, { backgroundColor: patternColor, opacity: patternOpacity * 1.3 }]} />
        
        {/* Secondary border lines for depth */}
        <View style={[styles.borderLine, styles.borderTopSecondary, { backgroundColor: patternColor, opacity: patternOpacity * 0.6 }]} />
        <View style={[styles.borderLine, styles.borderBottomSecondary, { backgroundColor: patternColor, opacity: patternOpacity * 0.6 }]} />
        <View style={[styles.borderLine, styles.borderLeftSecondary, { backgroundColor: patternColor, opacity: patternOpacity * 0.6 }]} />
        <View style={[styles.borderLine, styles.borderRightSecondary, { backgroundColor: patternColor, opacity: patternOpacity * 0.6 }]} />

        {/* Decorative circles at intersections */}
        <View style={[styles.decorativeCircle, styles.circleTopLeft, { backgroundColor: patternColor, opacity: patternOpacity * 0.5 }]} />
        <View style={[styles.decorativeCircle, styles.circleTopRight, { backgroundColor: patternColor, opacity: patternOpacity * 0.5 }]} />
        <View style={[styles.decorativeCircle, styles.circleBottomLeft, { backgroundColor: patternColor, opacity: patternOpacity * 0.5 }]} />
        <View style={[styles.decorativeCircle, styles.circleBottomRight, { backgroundColor: patternColor, opacity: patternOpacity * 0.5 }]} />
      </View>
    );
  };

  const containerStyle = useAnimatedStyle(() => ({
    perspective: 1000,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        style,
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
          frontStyle,
        ]}
        pointerEvents="none"
      >
        {getCardBackPattern()}
          <View style={styles.backLabelContainer}>
            <View style={[styles.backLabelBox, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
              <Text style={[styles.backLabel, { color: colors.accent }]}>
                Tap to reveal
              </Text>
            </View>
          </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
          backStyle,
        ]}
        pointerEvents="none"
      >
        {/* Subtle geometric border on revealed side */}
        <View style={styles.revealedPatternContainer}>
          <View style={[styles.revealedBorderLine, styles.revealedBorderTop, { backgroundColor: colors.border, opacity: 0.2 }]} />
          <View style={[styles.revealedBorderLine, styles.revealedBorderBottom, { backgroundColor: colors.border, opacity: 0.2 }]} />
          <View style={[styles.revealedBorderLine, styles.revealedBorderLeft, { backgroundColor: colors.border, opacity: 0.2 }]} />
          <View style={[styles.revealedBorderLine, styles.revealedBorderRight, { backgroundColor: colors.border, opacity: 0.2 }]} />
        </View>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 0.65, // Playing card ratio
    maxWidth: 350,
    maxHeight: 540,
    // Perspective for 3D effect
    transform: [{ perspective: 1000 }],
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    borderWidth: 2.5,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    overflow: 'hidden',
  },
  patternTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -70 }, { translateY: -70 }],
  },
  patternText: {
    fontSize: 120,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 6,
    textAlign: 'center',
  },
  largeCircleOverlay: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -90 }, { translateY: -90 }],
    zIndex: 3,
  },
  // Islamic Geometric Pattern Styles
  starContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  starLine: {
    position: 'absolute',
    width: 2,
    height: 60,
    top: 10,
    left: 39,
  },
  starLine1: {
    transform: [{ rotate: '0deg' }],
  },
  starLine2: {
    transform: [{ rotate: '45deg' }],
  },
  starLine3: {
    transform: [{ rotate: '90deg' }],
  },
  starLine4: {
    transform: [{ rotate: '135deg' }],
  },
  starLine5: {
    transform: [{ rotate: '22.5deg' }],
  },
  starLine6: {
    transform: [{ rotate: '67.5deg' }],
  },
  starLine7: {
    transform: [{ rotate: '112.5deg' }],
  },
  starLine8: {
    transform: [{ rotate: '157.5deg' }],
  },
  centralCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 4,
  },
  secondaryCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    transform: [{ translateX: -35 }, { translateY: -35 }],
    zIndex: 3,
  },
  cornerPattern: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  cornerTopLeft: {
    top: spacing.lg,
    left: spacing.lg,
  },
  cornerTopRight: {
    top: spacing.lg,
    right: spacing.lg,
    transform: [{ rotate: '90deg' }],
  },
  cornerBottomLeft: {
    bottom: spacing.lg,
    left: spacing.lg,
    transform: [{ rotate: '-90deg' }],
  },
  cornerBottomRight: {
    bottom: spacing.lg,
    right: spacing.lg,
    transform: [{ rotate: '180deg' }],
  },
  geometricLine: {
    position: 'absolute',
    width: 20,
    height: 1,
    top: 15,
    left: 5,
  },
  geometricLineVertical: {
    width: 1,
    height: 20,
    top: 5,
    left: 15,
  },
  borderLine: {
    position: 'absolute',
  },
  borderTop: {
    top: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    height: 1,
  },
  borderBottom: {
    bottom: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    height: 1,
  },
  borderLeft: {
    left: spacing.lg,
    top: spacing.xl,
    bottom: spacing.xl,
    width: 1,
  },
  borderRight: {
    right: spacing.lg,
    top: spacing.xl,
    bottom: spacing.xl,
    width: 1,
  },
  borderTopSecondary: {
    top: spacing.xl,
    left: spacing.xxl,
    right: spacing.xxl,
    height: 0.5,
  },
  borderBottomSecondary: {
    bottom: spacing.xl,
    left: spacing.xxl,
    right: spacing.xxl,
    height: 0.5,
  },
  borderLeftSecondary: {
    left: spacing.xl,
    top: spacing.xxl,
    bottom: spacing.xxl,
    width: 0.5,
  },
  borderRightSecondary: {
    right: spacing.xl,
    top: spacing.xxl,
    bottom: spacing.xxl,
    width: 0.5,
  },
  cornerAccent: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cornerAccentTopLeft: {
    top: spacing.xl,
    left: spacing.xl,
  },
  cornerAccentTopRight: {
    top: spacing.xl,
    right: spacing.xl,
  },
  cornerAccentBottomLeft: {
    bottom: spacing.xl,
    left: spacing.xl,
  },
  cornerAccentBottomRight: {
    bottom: spacing.xl,
    right: spacing.xl,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  circleTopLeft: {
    top: spacing.lg,
    left: spacing.lg,
  },
  circleTopRight: {
    top: spacing.lg,
    right: spacing.lg,
  },
  circleBottomLeft: {
    bottom: spacing.lg,
    left: spacing.lg,
  },
  circleBottomRight: {
    bottom: spacing.lg,
    right: spacing.lg,
  },
  revealedPatternContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  revealedBorderLine: {
    position: 'absolute',
  },
  revealedBorderTop: {
    top: spacing.md,
    left: spacing.xl,
    right: spacing.xl,
    height: 1,
  },
  revealedBorderBottom: {
    bottom: spacing.md,
    left: spacing.xl,
    right: spacing.xl,
    height: 1,
  },
  revealedBorderLeft: {
    left: spacing.md,
    top: spacing.xl,
    bottom: spacing.xl,
    width: 1,
  },
  revealedBorderRight: {
    right: spacing.md,
    top: spacing.xl,
    bottom: spacing.xl,
    width: 1,
  },
  backLabelContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    zIndex: 2,
    width: '100%',
    alignItems: 'center',
  },
  backLabelBox: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
  },
  backLabel: {
    ...typography.caption,
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});