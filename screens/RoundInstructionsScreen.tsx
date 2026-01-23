import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';

type RoundInstructionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RoundInstructions'
>;

export default function RoundInstructionsScreen() {
  const navigation = useNavigation<RoundInstructionsScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings } = useGame();

  if (!settings || players.length === 0) {
    return null;
  }

  const startingPlayer = players.find(p => p.id === settings.startingPlayerId) || players[0];
  
  if (!startingPlayer) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Round Instructions
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Starting Player
            </Text>
            <Text
              style={[styles.playerName, { color: colors.accent }]}
            >
              {startingPlayer.name}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Direction
            </Text>
            <Text
              style={[styles.instruction, { color: colors.textSecondary }]}
            >
              Proceed clockwise around the group
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {settings.mode === 'word' ? 'Clue Round' : 'Question'}
            </Text>
            <Text
              style={[styles.instruction, { color: colors.textSecondary }]}
            >
              {settings.mode === 'word'
                ? 'Each player gives ONE clue word related to the secret word. Try not to reveal it!'
                : 'Players ask and answer questions about the secret word. Keep it hidden from the imposter!'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Voting
            </Text>
            <Text
              style={[styles.instruction, { color: colors.textSecondary }]}
            >
              After all clues/questions, discuss and vote IN PERSON. The app will reveal the results when you're ready.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Reveal When Ready"
              onPress={() => navigation.navigate('Reveal')}
              style={styles.button}
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    padding: spacing.xl,
  },
  heading: {
    ...typography.heading,
    fontSize: 26, // Consistent with other screens
    marginBottom: spacing.xl,
    textAlign: 'center',
    fontWeight: '600', // Ensure consistent weight
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 17, // Slightly larger for better hierarchy
    marginBottom: spacing.md, // Increased spacing
    fontWeight: '600', // Ensure consistent weight
  },
  playerName: {
    ...typography.heading,
    fontSize: 28,
    textAlign: 'center',
  },
  instruction: {
    ...typography.body,
    fontSize: 15, // Slightly larger for better readability
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  button: {
    width: '100%',
  },
});