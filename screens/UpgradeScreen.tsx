import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type UpgradeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Upgrade'
>;

type BillingInterval = 'monthly' | 'yearly';

const FEATURES = [
  { icon: '🔓', title: 'All categories', desc: 'Islamic History, Seerah, Ramadan & more' },
  { icon: '✨', title: 'Unlimited custom categories', desc: 'Create as many as you want' },
  { icon: '📍', title: 'Location-based categories', desc: 'Halal spots & coffee shops near you' },
  { icon: '⭐', title: 'Priority support', desc: 'Faster help when you need it' },
  { icon: '🚀', title: 'Future updates', desc: 'New modes & features first' },
];

export default function UpgradeScreen() {
  const navigation = useNavigation<UpgradeScreenNavigationProp>();
  const { colors } = useTheme();
  const [interval, setInterval] = useState<BillingInterval>('yearly');

  const handleSelectPlan = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Premium coming soon',
      'In-app purchase will be available in a future update. You’ll be able to unlock all categories, unlimited custom lists, and more.\n\nThanks for your interest in supporting Khafī!',
      [
        { text: 'Maybe later', style: 'cancel' },
        { text: 'OK', onPress: () => {} },
      ]
    );
  };

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
            <Text style={[styles.title, { color: colors.text }]}>Paid plans</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Unlock everything and support Khafī
            </Text>
          </View>

          <View style={[styles.plansCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setInterval('monthly');
                }}
                style={[
                  styles.toggleOption,
                  { borderColor: colors.border, backgroundColor: interval === 'monthly' ? colors.accent : 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: interval === 'monthly' ? '#FFF' : colors.textSecondary },
                  ]}
                >
                  Monthly
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setInterval('yearly');
                }}
                style={[
                  styles.toggleOption,
                  { borderColor: colors.border, backgroundColor: interval === 'yearly' ? colors.accent : 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: interval === 'yearly' ? '#FFF' : colors.textSecondary },
                  ]}
                >
                  Yearly
                </Text>
                <View style={[styles.saveBadge, { backgroundColor: colors.doubleAgent }]}>
                  <Text style={styles.saveBadgeText}>Save 50%</Text>
                </View>
              </Pressable>
            </View>

            <View style={[styles.priceBlock, { borderTopColor: colors.border }]}>
              <View style={styles.priceRowFirst}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Free</Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>$0</Text>
              </View>
              <View style={[styles.priceRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.priceLabel, { color: colors.accent }]}>Premium</Text>
                <Text style={[styles.priceValue, { color: colors.accent }]}>
                  {interval === 'monthly' ? '$4.99' : '$29.99'}
                  <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>
                    /{interval === 'monthly' ? 'mo' : 'yr'}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.featuresCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>What you get</Text>
            {FEATURES.map((f, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(80 + i * 60).springify()}
                style={[styles.featureRow, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.featureIconWrap, { backgroundColor: colors.accentLight }]}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
                  <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{f.desc}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={styles.ctaBlock}>
            <Button
              title={interval === 'monthly' ? 'Subscribe · $4.99/mo' : 'Subscribe · $29.99/yr'}
              onPress={handleSelectPlan}
              style={styles.ctaButton}
            />
            <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
              Payment via App Store / Play Store. Cancel anytime.
            </Text>
          </View>
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
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    opacity: 0.85,
  },
  plansCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  toggleOption: {
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  saveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  saveBadgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  priceBlock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  priceRowFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  priceLabel: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  priceValue: {
    ...typography.heading,
    fontSize: 22,
    fontWeight: '700',
  },
  priceUnit: {
    ...typography.caption,
    fontSize: 14,
    fontWeight: '400',
  },
  featuresCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  featuresTitle: {
    ...typography.bodyBold,
    fontSize: 17,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 22,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    fontSize: 15,
    marginBottom: 2,
  },
  featureDesc: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 18,
  },
  ctaBlock: {
    gap: spacing.sm,
  },
  ctaButton: {
    width: '100%',
  },
  disclaimer: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
