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
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';

type HowToPlayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HowToPlay'
>;

const STEPS = [
  {
    icon: '🎯',
    title: 'Setup Your Game',
    description: 'Configure your game settings before you start',
    lines: [
      {
        text: 'Choose 3–20 players and set how many imposters you want (recommended: 1 imposter per 3 players).',
        example: 'Example: 6 players = 2 imposters',
      },
      {
        text: 'Select one or more word categories. Leave empty to use all categories randomly.',
        example: 'Categories: Prophets, Seerah, Ramadan, etc.',
      },
      {
        text: 'Optional: Enable special modes for extra challenge.',
        example: 'Blind Imposter: Imposter doesn\'t see the category. Double Agent: One player knows the word but isn\'t the imposter.',
      },
      {
        text: 'Tap "Start Game" when ready!',
        example: null,
      },
    ],
  },
  {
    icon: '📱',
    title: 'Reveal Your Cards',
    description: 'Each player secretly sees their role',
    lines: [
      {
        text: 'The app will show you who goes first. Pass the phone to that player.',
        example: null,
      },
      {
        text: 'Each player taps their name on the screen to reveal their card. Only they should look!',
        example: 'Keep the phone private - don\'t let others see your card.',
      },
      {
        text: 'Normal players see the secret word and category. Imposters see "IMPOSTER" instead.',
        example: 'If Blind Imposter is on, imposters see nothing about the word.',
      },
      {
        text: 'After everyone has seen their card, tap "Continue to Round".',
        example: null,
      },
    ],
  },
  {
    icon: '💬',
    title: 'Play the Round',
    description: 'Give clues and find the imposter',
    lines: [
      {
        text: 'Word + Clue Mode: Each player gives ONE clue word related to the secret word.',
        example: 'Secret word: "Masjid". Clues: "Prayer", "Dome", "Friday", "Community".',
      },
      {
        text: 'Quiz Mode: Players are given a question. The answer becomes the secret word, then players give clues.',
        example: 'Question: "First wife of the Prophet ﷺ". Answer: "Khadija". Clues: "Businesswoman", "First believer", etc.',
      },
      {
        text: 'After all clues or questions, discuss as a group who you think is the imposter.',
        example: 'Look for players who seem confused, give vague clues, or act suspicious.',
      },
      {
        text: 'Vote in person (not in the app) for who you think is the imposter.',
        example: 'Raise hands, point, or discuss until you agree on who to vote out.',
      },
      {
        text: 'Tap "Proceed to Timer" to start the discussion timer. The time is based on your group size.',
        example: 'More players = more time. Tap "+30 sec" if you need extra time to discuss.',
      },
      {
        text: 'When you\'re ready to reveal, tap "Reveal When Ready" to see the results.',
        example: null,
      },
    ],
  },
  {
    icon: '✨',
    title: 'Reveal the Results',
    description: 'See who won and play again',
    lines: [
      {
        text: 'Tap "Reveal Results" to see the secret word and who the imposters were.',
        example: null,
      },
      {
        text: 'If you voted out an imposter, the normal players win! If not, the imposters win.',
        example: null,
      },
      {
        text: 'Tap "Play Again" for a new round (new word, new imposter, new category). Tap "New Game" to change players or settings.',
        example: null,
      },
    ],
  },
];

export default function HowToPlayScreen() {
  const navigation = useNavigation<HowToPlayScreenNavigationProp>();
  const { colors } = useTheme();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth, alignSelf: 'center', width: '100%' },
        ]}
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
            <View style={styles.titleBlock}>
              <View style={[styles.titleAccentLine, { backgroundColor: colors.accent }]} />
              <View style={styles.titleContent}>
                <Text style={[styles.title, { color: colors.text }]}>How to Play</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  خفي — the hidden word game
                </Text>
                <Text style={[styles.introText, { color: colors.textSecondary }]}>
                  Learn how to play Khafī in 4 simple steps. Perfect for family gatherings, Islamic events, and fun with friends!
                </Text>
              </View>
            </View>
          </View>

          {STEPS.map((step, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(120 + i * 80).springify()}
              style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border, shadowColor: colors.shadow }]}
            >
              <View style={[styles.stepHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.stepIconWrap, { backgroundColor: colors.accentLight }]}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <View style={styles.stepTitleContainer}>
                  <View style={[styles.stepNumberBadge, { borderColor: colors.accent }]}>
                    <Text style={[styles.stepNumber, { color: colors.accent }]}>{i + 1}</Text>
                  </View>
                  <View style={styles.stepTitleTextContainer}>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>{step.description}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.stepBody}>
                {step.lines.map((line, j) => (
                  <View key={j} style={styles.stepLineContainer}>
                    <View style={styles.stepLine}>
                      <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                      <Text style={[styles.stepText, { color: colors.text }]}>{line.text}</Text>
                    </View>
                    {line.example && (
                      <View style={[styles.exampleBox, { backgroundColor: colors.accentLight, borderLeftColor: colors.accent }]}>
                        <Text style={[styles.exampleLabel, { color: colors.accent }]}>Example:</Text>
                        <Text style={[styles.exampleText, { color: colors.textSecondary }]}>{line.example}</Text>
                      </View>
                    )}
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
    width: '100%',
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
    position: 'relative',
    paddingLeft: spacing.lg,
  },
  titleAccentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 2,
  },
  titleContent: {
    paddingLeft: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 32,
    marginBottom: spacing.xs,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    marginBottom: spacing.md,
    opacity: 0.9,
    fontWeight: '500',
  },
  introText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  stepCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  stepIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  stepIcon: {
    fontSize: 28,
  },
  stepTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  stepNumber: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
  },
  stepTitleTextContainer: {
    flex: 1,
  },
  stepTitle: {
    ...typography.bodyBold,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  stepDescription: {
    ...typography.caption,
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  stepBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  stepLineContainer: {
    marginBottom: spacing.sm,
  },
  stepLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
  stepText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
    fontWeight: '500',
  },
  exampleBox: {
    marginLeft: spacing.md + 8,
    marginTop: spacing.xs,
    padding: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 3,
  },
  exampleLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleText: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cta: {
    marginTop: spacing.lg,
  },
  ctaButton: {
    width: '100%',
  },
});
