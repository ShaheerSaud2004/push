import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

export default function MenuScreen() {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const titleScale = useSharedValue(0.9);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate title
    titleScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    titleOpacity.value = withTiming(1, { duration: 400 });
    
    // Animate subtitle with delay
    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    
    // Animate tagline with delay
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      
      <View style={[styles.header, { top: insets.top + spacing.lg, right: insets.right + spacing.lg }]}>
        <Pressable
          onPress={handleSettingsPress}
          style={({ pressed }) => [
            styles.settingsButton,
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: colors.border }]}>
            <Text style={[styles.settingsIcon, { color: colors.textSecondary }]}>
              ⚙
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View style={titleAnimatedStyle}>
          <View style={styles.titleContainer}>
            <View style={[styles.titleAccent, { backgroundColor: colors.accentLight }]} />
            <Text style={[styles.title, { color: colors.text }]}>Khafī</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={subtitleAnimatedStyle}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            خفي
          </Text>
        </Animated.View>
        
        <Animated.View style={taglineAnimatedStyle}>
          <View style={[styles.taglineContainer, { borderTopColor: colors.border }]}>
            <Text
              style={[styles.tagline, { color: colors.textSecondary }]}
            >
              The Islamic Hidden Word Game
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.buttonContainer}
        >
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('GameSetup')}
            style={styles.button}
          />
          <Button
            title="How to Play"
            onPress={() => navigation.navigate('HowToPlay')}
            variant="secondary"
            style={styles.button}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    zIndex: 10,
    padding: spacing.sm,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  settingsIconContainer: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    opacity: 0.8, // Slightly more visible
    minWidth: 44,
    minHeight: 44,
  },
  settingsIcon: {
    fontSize: 18,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  titleAccent: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: spacing.sm,
    opacity: 0.6,
  },
  title: {
    ...typography.title,
    fontSize: 56,
    letterSpacing: -1.5,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.heading,
    fontSize: 36,
    marginBottom: spacing.lg,
    letterSpacing: 2,
  },
  taglineContainer: {
    borderTopWidth: 1,
    paddingTop: spacing.lg,
    marginBottom: spacing.xxl,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  tagline: {
    ...typography.body,
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});