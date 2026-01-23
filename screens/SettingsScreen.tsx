import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type SettingRowProps = {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isLast?: boolean;
  colors: { text: string; textSecondary: string; border: string; accentLight: string };
};

function SettingRow({ icon, label, sublabel, onPress, isLast, colors }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        {
          backgroundColor: pressed ? colors.accentLight : 'transparent',
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.settingRowLeft}>
        <View style={[styles.settingIconWrap, { backgroundColor: colors.accentLight }]}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
          {sublabel ? (
            <Text style={[styles.settingSublabel, { color: colors.textSecondary }]} numberOfLines={1}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors } = useTheme();

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const appStoreUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id1234567890',
      android: 'https://play.google.com/store/apps/details?id=com.khafi.app',
      default: '',
    });
    if (appStoreUrl) {
      Linking.openURL(appStoreUrl).catch(() => {
        Alert.alert('Error', 'Unable to open the app store. Please rate us manually!');
      });
    } else {
      Alert.alert(
        'Rate Khafī',
        "Thank you for wanting to rate us! The app isn't on the stores yet, but we appreciate your support!",
        [{ text: 'OK' }]
      );
    }
  };

  const handleSendFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const email = 'support@khafi.app';
    const subject = encodeURIComponent('Khafī App Feedback');
    const body = encodeURIComponent(`Hi Khafī Team,\n\nI wanted to share some feedback:\n\n`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Send Feedback', `Email us at:\n\n${email}\n\nWe'd love to hear from you!`, [
        { text: 'OK' },
      ]);
    });
  };

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Upgrade');
  };

  const handleCreateCategory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCategory');
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
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              App preferences & support
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CONTENT</Text>
            <SettingRow
              icon="📁"
              label="Create Custom Category"
              sublabel="Add your own word lists"
              onPress={handleCreateCategory}
              isLast
              colors={colors}
            />
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREMIUM</Text>
            <SettingRow
              icon="👑"
              label="Paid plans"
              sublabel="Unlock all categories & more"
              onPress={handleUpgrade}
              isLast
              colors={colors}
            />
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SUPPORT</Text>
            <SettingRow
              icon="⭐"
              label="Rate Khafī"
              sublabel="Leave a review"
              onPress={handleRateApp}
              colors={colors}
            />
            <SettingRow
              icon="✉️"
              label="Send feedback"
              sublabel="We read every message"
              onPress={handleSendFeedback}
              isLast
              colors={colors}
            />
          </View>

          <Animated.View entering={FadeIn.delay(400)} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Khafī · خفي
            </Text>
            <Text style={[styles.footerVersion, { color: colors.textSecondary }]}>
              v1.0.0
            </Text>
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
    marginBottom: spacing.sm,
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
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingIconWrap: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingLabel: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '600', // Ensure consistent weight
  },
  settingSublabel: {
    ...typography.caption,
    fontSize: 13,
    marginTop: 2,
    opacity: 0.85,
  },
  settingArrow: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    fontSize: 14,
  },
  footerVersion: {
    ...typography.caption,
    fontSize: 12,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
});
