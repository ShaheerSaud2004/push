import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type HowToPlayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HowToPlay'
>;

const STEPS = [
  {
    icon: '🎯',
    title: 'Setup',
    lines: [
      'Choose 3–20 players and how many imposters (e.g. 1 per 3 players).',
      'Pick one or more word categories.',
      'Optional: enable Blind Imposter or Double Agent.',
    ],
  },
  {
    icon: '📱',
    title: 'Pass the phone',
    lines: [
      'The app tells you who goes first.',
      'Each player taps their name to reveal their card — only they look.',
      'Normals see the secret word; imposters see "IMPOSTER" (or nothing if blind).',
    ],
  },
  {
    icon: '💬',
    title: 'Play',
    lines: [
      'Word mode: everyone gives ONE clue word about the secret.',
      'Question mode: take turns asking and answering questions.',
      'Discuss, then vote in person for who you think is the imposter.',
    ],
  },
  {
    icon: '✨',
    title: 'Reveal',
    lines: [
      'See the secret word and who the imposters were.',
      'Play again with a new word or start a new game.',
    ],
  },
];

export default function HowToPlayScreen() {
  const navigation = useNavigation<HowToPlayScreenNavigationProp>();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.backButton, { color: colors.accent }]}>← Back</Text>
            </Pressable>
            <View style={[styles.titleBlock, { borderLeftColor: colors.accent }]}>
              <Text style={[styles.title, { color: colors.text }]}>How to play</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                خفي — the hidden word game
              </Text>
            </View>
          </View>

          {STEPS.map((step, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(120 + i * 80).springify()}
              style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            >
              <View style={[styles.stepHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.stepIconWrap, { backgroundColor: colors.accentLight }]}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
              </View>
              <View style={styles.stepBody}>
                {step.lines.map((line, j) => (
                  <View key={j} style={styles.stepLine}>
                    <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.stepText, { color: colors.textSecondary }]}>{line}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}

          <Animated.View entering={FadeIn.delay(500)} style={styles.cta}>
            <Button
              title="Got it!"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.goBack();
              }}
              style={styles.ctaButton}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    ...typography.bodyBold,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  titleBlock: {
    borderLeftWidth: 4,
    paddingLeft: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    marginBottom: spacing.sm, // Increased spacing for better hierarchy
    fontWeight: '600', // Ensure consistent weight
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    opacity: 0.85,
  },
  stepCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  stepIconWrap: {
    width: 48, // Already meets 44pt minimum
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  stepIcon: {
    fontSize: 24,
  },
  stepTitle: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '600', // Ensure consistent weight
  },
  stepBody: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  stepLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  stepText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24, // Improved line height for better readability
    flex: 1,
  },
  cta: {
    marginTop: spacing.lg,
  },
  ctaButton: {
    width: '100%',
  },
});
