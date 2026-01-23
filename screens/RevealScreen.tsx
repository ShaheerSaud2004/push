import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  SlideOutDown,
  ZoomIn,
  ZoomInRotate,
  FlipInEasyX,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getCategoryName, getAllWords, selectRandomWord, selectRandomCategory } from '../utils/game';
import { defaultCategories } from '../data/categories';
import { getCustomCategories, getUsedWords, addUsedWord } from '../utils/storage';
import { getEnglishTranslation } from '../utils/translations';
import { GameSettings } from '../types';

type RevealScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Reveal'
>;

export default function RevealScreen() {
  const navigation = useNavigation<RevealScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings, resetGame, setPlayers, setSettings } = useGame();
  const [customCategories, setCustomCategories] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Animation values for reveal
  const secretWordScale = useSharedValue(0);
  const secretWordRotation = useSharedValue(-180);
  
  // Animation values for New Game transition - flip animation
  const screenRotationY = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    loadCustomCategories();
    loadPremiumStatus();
    if (!showResults) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const loadPremiumStatus = async () => {
    const { getIsPremium } = await import('../utils/storage');
    const premium = await getIsPremium();
    setIsPremium(premium);
  };

  useEffect(() => {
    if (showResults) {
      // Dramatic reveal animations
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Secret word animation - dramatic scale and rotation
      secretWordScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(400, withSpring(1.3, { damping: 6, stiffness: 150 })),
        withSpring(1, { damping: 12, stiffness: 180 })
      );
      
      secretWordRotation.value = withSequence(
        withTiming(-180, { duration: 0 }),
        withDelay(400, withSpring(0, { damping: 12, stiffness: 200 }))
      );
    } else {
      // Reset animations when hiding results
      secretWordScale.value = 0;
      secretWordRotation.value = -180;
    }
  }, [showResults]);

  const loadCustomCategories = async () => {
    const custom = await getCustomCategories();
    setCustomCategories(custom);
  };

  // Animated styles for secret word reveal - MUST be called before early return
  const secretWordAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: secretWordScale.value },
      { rotateY: `${secretWordRotation.value}deg` },
    ],
  }));

  // Animated style for screen transition - flip animation
  const screenAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = screenRotationY.value;
    return {
      opacity: rotateY < 90 ? 1 : 0,
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  if (!settings || players.length === 0) {
    return null;
  }

  const imposters = players.filter(p => p.role === 'imposter');
  const doubleAgents = players.filter(p => p.role === 'doubleAgent');
  const allCategories = [...defaultCategories, ...customCategories];

  const handleReveal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowResults(true);
  };


  const handlePlayAgain = async () => {
    if (!settings) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Get all available categories
      const allCategories = [...defaultCategories, ...customCategories];
      
      // Select a new category from the same selected categories
      const newCategoryId = selectRandomCategory(
        settings.selectedCategories,
        allCategories,
        isPremium
      );
      
      // Get the chosen category
      const chosenCategory = allCategories.find(c => c.id === newCategoryId);
      
      if (!chosenCategory || chosenCategory.words.length === 0) {
        // Fallback: navigate to setup if category issue
        navigation.navigate('GameSetup');
        return;
      }

      // Get used words and select a new word
      const usedWords = await getUsedWords();
      const newSecretWord = selectRandomWord(chosenCategory.words, usedWords);
      
      // Mark new word as used
      await addUsedWord(newSecretWord);

      // Reset all players' hasSeenCard status
      const resetPlayers = players.map(p => ({
        ...p,
        hasSeenCard: false,
      }));

      // Update settings with new word and category
      const newSettings: GameSettings = {
        ...settings,
        secretWord: newSecretWord,
        secretCategory: newCategoryId,
      };

      // Update game state
      setPlayers(resetPlayers);
      setSettings(newSettings);

      // Navigate back to PassAndPlay
      navigation.navigate('PassAndPlay');
    } catch (error) {
      console.error('Error in Play Again:', error);
      // Fallback: navigate to setup on error
      navigation.navigate('GameSetup');
    }
  };

  const handleNewGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Flip animation - rotate screen 180 degrees
    screenRotationY.value = withTiming(180, { 
      duration: 400,
    });
    
    // Wait for animation to complete, then navigate and reset
    setTimeout(() => {
      navigation.navigate('GameSetup');
      setTimeout(() => {
        resetGame();
        // Reset animation values for next time
        screenRotationY.value = 0;
        screenOpacity.value = 1;
      }, 100);
    }, 400);
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, screenAnimatedStyle]}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <PatternBackground />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {!showResults ? (
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{ flex: 1 }}
          >
            <Card style={styles.card}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Ready to Reveal?
              </Text>
              <Text
                style={[styles.instruction, { color: colors.textSecondary }]}
              >
                Make sure all voting is complete, then tap to reveal the results.
              </Text>
              <Button
                title="Reveal Results"
                onPress={handleReveal}
                style={styles.button}
              />
            </Card>
          </Animated.View>
        ) : (
          <>
            <Animated.View
              entering={ZoomIn.delay(100).springify()}
            >
              <Card style={styles.revealCard}>
                <Animated.View
                  entering={FadeInDown.delay(200).springify()}
                >
                  <Text style={[styles.heading, { color: colors.text }]}>
                    The Secret Word Was...
                  </Text>
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.secretWordContainer,
                    secretWordAnimatedStyle
                  ]}
                >
                  <Text
                    style={[styles.secretWord, { color: colors.accent }]}
                  >
                    {settings.secretWord}
                  </Text>
                </Animated.View>
                {getEnglishTranslation(settings.secretWord) && (
                  <Animated.View
                    entering={FadeIn.delay(800).springify()}
                  >
                    <Text
                      style={[styles.wordTranslation, { color: colors.textSecondary }]}
                    >
                      {getEnglishTranslation(settings.secretWord)}
                    </Text>
                  </Animated.View>
                )}
                <Animated.View
                  entering={FadeIn.delay(900).springify()}
                >
                  <Text
                    style={[styles.categoryLabel, { color: colors.textSecondary }]}
                  >
                    Category: {getCategoryName(settings.secretCategory, allCategories)}
                  </Text>
                </Animated.View>
              </Card>
            </Animated.View>

            <Animated.View
              entering={FlipInEasyX.delay(1000).springify()}
            >
              <Card style={styles.card}>
                <Animated.View
                  entering={FadeInDown.delay(1100).springify()}
                >
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    The Imposter(s) Were...
                  </Text>
                </Animated.View>
                {imposters.map((imposter, index) => (
                  <Animated.View
                    key={imposter.id}
                    entering={ZoomInRotate.delay(1200 + index * 200).springify()}
                    style={styles.roleContainer}
                  >
                    <Text
                      style={[styles.imposterName, { color: colors.imposter }]}
                    >
                      {imposter.name}
                    </Text>
                    <Text
                      style={[styles.roleLabel, { color: colors.imposter }]}
                    >
                      IMPOSTER
                    </Text>
                  </Animated.View>
                ))}
              </Card>
            </Animated.View>

            {doubleAgents.length > 0 && (
              <Animated.View
                entering={FlipInEasyX.delay(1400).springify()}
              >
                <Card style={styles.card}>
                  <Animated.View
                    entering={FadeInDown.delay(1500).springify()}
                  >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      The Double Agent(s) Were...
                    </Text>
                  </Animated.View>
                  {doubleAgents.map((agent, index) => (
                    <Animated.View
                      key={agent.id}
                      entering={ZoomInRotate.delay(1600 + index * 200).springify()}
                      style={styles.roleContainer}
                    >
                      <Text
                        style={[styles.agentName, { color: colors.doubleAgent }]}
                      >
                        {agent.name}
                      </Text>
                      <Text
                        style={[styles.roleLabel, { color: colors.doubleAgent }]}
                      >
                        DOUBLE AGENT
                      </Text>
                    </Animated.View>
                  ))}
                </Card>
              </Animated.View>
            )}

            <Animated.View
              entering={SlideInDown.delay(1800).springify()}
              style={styles.buttonContainer}
            >
              <Button
                title="Play Again"
                onPress={handlePlayAgain}
                style={styles.button}
              />
              <Button
                title="New Game"
                onPress={handleNewGame}
                variant="secondary"
                style={styles.button}
              />
            </Animated.View>
          </>
        )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  card: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heading: {
    ...typography.heading,
    fontSize: 26, // Consistent with other screens
    marginBottom: spacing.lg, // Increased spacing for better hierarchy
    textAlign: 'center',
    fontWeight: '600', // Ensure consistent weight
  },
  instruction: {
    ...typography.body,
    fontSize: 15, // Slightly larger for better readability
    textAlign: 'center',
    marginBottom: spacing.xl, // Increased spacing
    lineHeight: 24,
  },
  revealCard: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  secretWordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    minHeight: 80,
  },
  secretWord: {
    ...typography.heading,
    fontSize: 56,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '700',
    letterSpacing: 2,
  },
  wordTranslation: {
    ...typography.caption,
    fontSize: 15, // Slightly larger for better readability
    textAlign: 'center',
    marginBottom: spacing.md, // Increased spacing
    fontStyle: 'italic',
    lineHeight: 20,
  },
  categoryLabel: {
    ...typography.body,
    fontSize: 15, // Consistent sizing
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 18, // Consistent with other screens
    marginBottom: spacing.lg, // Increased spacing for better hierarchy
    textAlign: 'center',
    fontWeight: '600', // Ensure consistent weight
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imposterName: {
    ...typography.heading,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  agentName: {
    ...typography.heading,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  roleLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});