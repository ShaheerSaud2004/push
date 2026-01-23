import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ThemeColors, cardStyle } from '../theme';
import { useTheme } from '../contexts/ThemeContext';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.98);
    rotate.value = withSpring(Math.random() * 2 - 1); // Subtle tilt
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1);
    rotate.value = withSpring(0);
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadow,
          borderColor: colors.border,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    borderWidth: 1,
  },
});