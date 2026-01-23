import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { defaultCategories, getCategoryById, getAllWords } from '../data/categories';
import {
  createPlayers,
  selectRandomWord,
  selectRandomCategory,
  selectSingleRandomCategory,
  getCategoryName,
} from '../utils/game';
import { getSettings, getCustomCategories, saveLocationCategories, getLocationCategories, getUsedWords, addUsedWord } from '../utils/storage';
import { GameSettings, GameMode, Category } from '../types';
import { 
  requestLocationPermission, 
  getNearbyCoffeeShops, 
  getNearbyHalalSpots,
  businessesToWords 
} from '../utils/location';

type GameSetupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GameSetup'
>;

export default function GameSetupScreen() {
  const navigation = useNavigation<GameSetupScreenNavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { setPlayers, setSettings } = useGame();

  const [numPlayers, setNumPlayers] = useState(3);
  const [numImposters, setNumImposters] = useState(1);
  const [mode, setMode] = useState<GameMode>('word');
  const [blindImposter, setBlindImposter] = useState(false);
  const [doubleAgent, setDoubleAgent] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showHintToImposter, setShowHintToImposter] = useState(false);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [modalCategory, setModalCategory] = useState<Category | null>(null);
  const [infoModal, setInfoModal] = useState<'blind' | 'double' | 'word' | 'question' | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationCategoryType, setLocationCategoryType] = useState<'coffee' | 'halal' | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationCategories, setLocationCategories] = useState<{ coffee?: Category; halal?: Category }>({});
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadCustomCategories();
    loadLocationCategories();
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    const { getIsPremium } = await import('../utils/storage');
    const premium = await getIsPremium();
    setIsPremium(premium);
  };

  // Update player names array when number of players changes
  useEffect(() => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      while (newNames.length < numPlayers) {
        newNames.push(''); // Start with empty string, placeholder will show default
      }
      return newNames.slice(0, numPlayers);
    });
  }, [numPlayers]);

  const updatePlayerName = (index: number, name: string) => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };

  const loadCustomCategories = async () => {
    const custom = await getCustomCategories();
    setCustomCategories(custom);
  };

  const loadLocationCategories = async () => {
    const stored = await getLocationCategories();
    setLocationCategories(stored);
  };

  const fetchLocationData = async (type: 'coffee' | 'halal'): Promise<boolean> => {
    setIsLoadingLocation(true);
    try {
      const businesses = type === 'coffee' 
        ? await getNearbyCoffeeShops()
        : await getNearbyHalalSpots();
      
      if (businesses.length === 0) {
        Alert.alert(
          'No Results Found', 
          `We couldn't find nearby ${type === 'coffee' ? 'Muslim-owned coffee shops' : 'halal restaurants'} in your area. Please try again later or select a different category.`,
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return false;
      }

      const words = businessesToWords(businesses);
      const categoryId = type === 'coffee' ? 'muslim-coffee' : 'local-halal';
      const baseCategory = defaultCategories.find(c => c.id === categoryId);
      
      if (baseCategory) {
        const updatedCategory: Category = {
          ...baseCategory,
          words,
        };

        const updated = { ...locationCategories };
        if (type === 'coffee') {
          updated.coffee = updatedCategory;
        } else {
          updated.halal = updatedCategory;
        }
        
        setLocationCategories(updated);
        await saveLocationCategories(updated);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success!', 
          `Found ${businesses.length} nearby ${type === 'coffee' ? 'coffee shops' : 'halal restaurants'}! They've been added to your game.`,
          [{ text: 'Great!' }]
        );
        setIsLoadingLocation(false);
        return true;
      }
      setIsLoadingLocation(false);
      return false;
    } catch (error) {
      console.error('Error fetching location data:', error);
      Alert.alert(
        'Error', 
        'Failed to fetch location data. Please try again or use default categories.',
        [{ text: 'OK' }]
      );
      setIsLoadingLocation(false);
      return false;
    }
  };

  const handleLocationPermissionRequest = async () => {
    const granted = await requestLocationPermission();
    
    if (granted) {
      if (locationCategoryType) {
        const success = await fetchLocationData(locationCategoryType);
        // After fetching, automatically select the category if successful
        if (success) {
          const categoryId = locationCategoryType === 'coffee' ? 'muslim-coffee' : 'local-halal';
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedCategories(prev =>
            prev.includes(categoryId)
              ? prev
              : [...prev, categoryId]
          );
        }
      }
    } else {
      Alert.alert(
        'Location Permission Required',
        'We need your location to find nearby Muslim-owned businesses. This category will only show real local places based on your location. You can enable location permission in your device settings.',
        [{ text: 'OK' }]
      );
    }
    setShowLocationModal(false);
    setLocationCategoryType(null);
  };

  const recommendedImposters = Math.floor(numPlayers / 3);
  const maxImposters = numPlayers - 1; // Can't have all players be imposters
  const exceedsRecommended = numImposters > recommendedImposters;
  
  // Featured categories to show first
  const featuredCategoryIds = ['muslim-coffee', 'local-halal'];
  
  // Reorder categories to show featured ones first
  let sortedCategories = [...defaultCategories].sort((a, b) => {
    const aFeatured = featuredCategoryIds.includes(a.id);
    const bFeatured = featuredCategoryIds.includes(b.id);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return 0;
  });

  // Replace location-based categories with stored ones if available (only if they have words)
  if (locationCategories.coffee && locationCategories.coffee.words.length > 0) {
    const index = sortedCategories.findIndex(c => c.id === 'muslim-coffee');
    if (index >= 0) {
      sortedCategories[index] = locationCategories.coffee;
    }
  }
  if (locationCategories.halal && locationCategories.halal.words.length > 0) {
    const index = sortedCategories.findIndex(c => c.id === 'local-halal');
    if (index >= 0) {
      sortedCategories[index] = locationCategories.halal;
    }
  }

  const availableCategories = [...sortedCategories, ...customCategories];
  
  const MAX_VISIBLE_CATEGORIES = 6;
  const visibleCategories = availableCategories.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMoreCategories = availableCategories.length > MAX_VISIBLE_CATEGORIES;

  const toggleCategory = async (categoryId: string) => {
    const category = availableCategories.find(c => c.id === categoryId);
    if (category?.locked && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        '🔒 Locked Category',
        'This category requires Premium. Unlock all categories and get unlimited custom categories with Premium!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => navigation.navigate('Upgrade'),
            style: 'default',
          },
        ]
      );
      return;
    }

    // Check if this is a location-based category - always require location data
    if (categoryId === 'muslim-coffee' || categoryId === 'local-halal') {
      const hasLocationData = categoryId === 'muslim-coffee' 
        ? !!locationCategories.coffee && locationCategories.coffee.words.length > 0
        : !!locationCategories.halal && locationCategories.halal.words.length > 0;
      
      if (!hasLocationData) {
        // Always request location permission and fetch data
        setLocationCategoryType(categoryId === 'muslim-coffee' ? 'coffee' : 'halal');
        setShowLocationModal(true);
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const adjustNumber = (type: 'players' | 'imposters', delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'players') {
      const newVal = Math.max(3, Math.min(20, numPlayers + delta));
      setNumPlayers(newVal);
      // Don't auto-adjust imposters, just cap at max
      if (numImposters > newVal - 1) {
        setNumImposters(newVal - 1);
      }
    } else {
      setNumImposters(Math.max(1, Math.min(maxImposters, numImposters + delta)));
    }
  };

  const handleStart = async () => {
    if (numImposters >= numPlayers) {
      Alert.alert('Error', 'You cannot have all players be imposters. At least one player must be normal.');
      return;
    }

    // If no categories selected, randomly choose ONE category
    let categoriesToUse: string[];
    let secretCategoryId: string;
    
    if (selectedCategories.length === 0) {
      // Randomly select a single category
      secretCategoryId = selectSingleRandomCategory(availableCategories, isPremium);
      if (!secretCategoryId) {
        Alert.alert('Error', 'No categories available. Please unlock a category.');
        return;
      }
      categoriesToUse = [secretCategoryId];
    } else {
      // Use selected categories and randomly pick one for the word
      categoriesToUse = selectedCategories;
      secretCategoryId = selectRandomCategory(categoriesToUse, availableCategories, isPremium);
    }

    // Get words from only the chosen category
    const allCategories = [...availableCategories, ...customCategories];
    const chosenCategory = allCategories.find(c => c.id === secretCategoryId);
    
    if (!chosenCategory || chosenCategory.words.length === 0) {
      Alert.alert('Error', 'No words available in selected category.');
      return;
    }

    // Get used words and select a word that hasn't been used
    const usedWords = await getUsedWords();
    const secretWord = selectRandomWord(chosenCategory.words, usedWords);
    
    // Mark word as used
    await addUsedWord(secretWord);
    
    const players = createPlayers(numPlayers, numImposters, doubleAgent, 'player-0', playerNames);
    const startingPlayerId = players[Math.floor(Math.random() * players.length)].id;

    const settings: GameSettings = {
      numPlayers,
      numImposters,
      mode,
      specialModes: {
        blindImposter,
        doubleAgent,
      },
      selectedCategories: categoriesToUse,
      showCategoryToImposter: !blindImposter, // Show category when Blind Imposter is OFF
      showHintToImposter,
      startingPlayerId,
      secretWord,
      secretCategory: secretCategoryId,
    };

    setPlayers(players);
    setSettings(settings);
    navigation.navigate('PassAndPlay');
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
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.headerContainer}>
          <Pressable 
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButtonContainer,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View style={[styles.backIcon, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.backIconText, { color: colors.accent }]}>←</Text>
            </View>
          </Pressable>
          <Text style={[styles.heading, { color: colors.text }]}>
            Game Setup
          </Text>
        </Animated.View>

        {/* Players & Imposters Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Players
            </Text>
            
            {/* Players */}
            <View style={styles.numberSection}>
              <View style={styles.numberLabelContainer}>
                <Text style={[styles.numberLabel, { color: colors.text }]}>
                  Number of Players
                </Text>
              </View>
              <View style={styles.numberSelector}>
                <Pressable
                  onPress={() => adjustNumber('players', -1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.accentLight : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.accent }]}>
                    −
                  </Text>
                </Pressable>
                <View style={[styles.numberDisplay, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.number, { color: colors.accent }]}>
                    {numPlayers}
                  </Text>
                </View>
                <Pressable
                  onPress={() => adjustNumber('players', 1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.accentLight : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.accent }]}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Imposters */}
            <View style={styles.numberSection}>
              <View style={styles.numberLabelContainer}>
                <Text style={[styles.numberLabel, { color: colors.text }]}>
                  Number of Imposters
                </Text>
                <View style={styles.hintContainer}>
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    Recommended: {recommendedImposters}
                  </Text>
                  {exceedsRecommended && (
                    <View style={[styles.warningBadge, { backgroundColor: colors.imposter + '20' }]}>
                      <Text style={[styles.warningText, { color: colors.imposter }]}>
                        ⚠️ Not recommended
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.numberSelector}>
                <Pressable
                  onPress={() => adjustNumber('imposters', -1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.imposter + '20' : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.imposter }]}>
                    −
                  </Text>
                </Pressable>
                <View style={[styles.numberDisplay, { backgroundColor: colors.imposter + '15' }]}>
                  <Text style={[styles.number, { color: colors.imposter }]}>
                    {numImposters}
                  </Text>
                </View>
                <Pressable
                  onPress={() => adjustNumber('imposters', 1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.imposter + '20' : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.imposter }]}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Player Names Card */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Player Names
            </Text>
            <Text style={[styles.categoryHint, { color: colors.textSecondary, marginBottom: spacing.md }]}>
              Enter names for each player (optional)
            </Text>
            <View style={styles.nameInputsContainer}>
              {playerNames.map((name, index) => (
                <Animated.View
                  key={index}
                  entering={FadeIn.delay(150 + index * 30)}
                  style={styles.nameInputWrapper}
                >
                  <View style={[styles.nameInputLabel, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.nameInputLabelText, { color: colors.accent }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <TextInput
                      style={[
                        styles.nameInput,
                        {
                          backgroundColor: colors.cardBackground,
                          borderColor: colors.border,
                          color: colors.text,
                          paddingRight: name.trim() ? 40 : spacing.md,
                        },
                      ]}
                      placeholder={`Player ${index + 1}`}
                      placeholderTextColor={colors.textSecondary}
                      value={name}
                      onChangeText={(text) => updatePlayerName(index, text)}
                      maxLength={20}
                    />
                    {name.trim() && (
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          updatePlayerName(index, '');
                        }}
                        style={({ pressed }) => [
                          styles.clearButton,
                          { opacity: pressed ? 0.6 : 1 },
                        ]}
                      >
                        <View style={[styles.clearButtonIcon, { backgroundColor: colors.textSecondary + '20' }]}>
                          <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>×</Text>
                        </View>
                      </Pressable>
                    )}
                  </View>
                </Animated.View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Game Mode & Special Modes Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card style={styles.sectionCard}>
            <View style={styles.gameModeHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Game Mode
              </Text>
            </View>
            <View style={styles.modeContainer}>
              <View style={styles.modeOptionWrapper}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMode('word');
                  }}
                  style={({ pressed }) => [
                    styles.modeOption,
                    {
                      backgroundColor: pressed
                        ? colors.accentLight
                        : mode === 'word'
                        ? colors.accentLight
                        : colors.border,
                      borderColor:
                        mode === 'word' || pressed ? colors.accent : colors.border,
                      borderWidth: mode === 'word' || pressed ? 2 : 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                      shadowColor: pressed ? colors.accent : 'transparent',
                      shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                      shadowOpacity: pressed ? 0.2 : 0,
                      shadowRadius: pressed ? 4 : 0,
                      elevation: pressed ? 3 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modeText,
                      {
                        color: mode === 'word' ? colors.accent : colors.textSecondary,
                        fontWeight: mode === 'word' ? '700' : '500',
                      },
                    ]}
                  >
                    Word + Clue
                  </Text>
                </Pressable>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setInfoModal('word');
                  }}
                  style={styles.modeInfoButton}
                >
                  <View style={[styles.modeInfoIcon, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.infoIconText, { color: colors.accent }]}>i</Text>
                  </View>
                </Pressable>
              </View>
              <View style={styles.modeOptionWrapper}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMode('question');
                  }}
                  style={({ pressed }) => [
                    styles.modeOption,
                    {
                      backgroundColor: pressed
                        ? colors.accentLight
                        : mode === 'question'
                        ? colors.accentLight
                        : colors.border,
                      borderColor:
                        mode === 'question' || pressed ? colors.accent : colors.border,
                      borderWidth: mode === 'question' || pressed ? 2 : 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                      shadowColor: pressed ? colors.accent : 'transparent',
                      shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                      shadowOpacity: pressed ? 0.2 : 0,
                      shadowRadius: pressed ? 4 : 0,
                      elevation: pressed ? 3 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modeText,
                      {
                        color: mode === 'question' ? colors.accent : colors.textSecondary,
                        fontWeight: mode === 'question' ? '700' : '500',
                      },
                    ]}
                  >
                    Question
                  </Text>
                </Pressable>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setInfoModal('question');
                  }}
                  style={styles.modeInfoButton}
                >
                  <View style={[styles.modeInfoIcon, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.infoIconText, { color: colors.accent }]}>i</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border, marginTop: spacing.lg }]} />

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
              Special Modes
            </Text>
            
            <View style={styles.toggleContainer}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBlindImposter(!blindImposter);
                }}
                style={({ pressed }) => [
                  styles.toggleRow,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.toggleLabelContainer}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      Blind Imposter
                    </Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setInfoModal('blind');
                      }}
                      style={styles.infoButton}
                    >
                      <View style={[styles.infoIcon, { backgroundColor: colors.accentLight }]}>
                        <Text style={[styles.infoIconText, { color: colors.accent }]}>i</Text>
                      </View>
                    </Pressable>
                  </View>
                  <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                    Imposter doesn't see the category
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: blindImposter ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.toggleThumb,
                      {
                        transform: [{ translateX: blindImposter ? 20 : 0 }],
                      },
                    ]}
                  />
                </View>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDoubleAgent(!doubleAgent);
                }}
                style={({ pressed }) => [
                  styles.toggleRow,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.toggleLabelContainer}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      Double Agent
                    </Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setInfoModal('double');
                      }}
                      style={styles.infoButton}
                    >
                      <View style={[styles.infoIcon, { backgroundColor: colors.doubleAgent + '20' }]}>
                        <Text style={[styles.infoIconText, { color: colors.doubleAgent }]}>i</Text>
                      </View>
                    </Pressable>
                  </View>
                  <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                    One player knows the word but isn't imposter
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: doubleAgent ? colors.doubleAgent : colors.border,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.toggleThumb,
                      {
                        transform: [{ translateX: doubleAgent ? 20 : 0 }],
                      },
                    ]}
                  />
                </View>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Categories Card */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Card style={styles.sectionCard}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Categories
              </Text>
              {selectedCategories.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.badgeText, { color: colors.accent }]}>
                    {selectedCategories.length} selected
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.categoryHint, { color: colors.textSecondary }]}>
              {selectedCategories.length === 0 
                ? 'Select specific categories, or leave empty to use all' 
                : 'Long press a category to see details'}
            </Text>
            <View style={styles.categoryGrid}>
              {visibleCategories.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeIn.delay(300 + index * 30)}
                >
                  <Pressable
                    onPress={() => toggleCategory(category.id)}
                    onLongPress={() => setModalCategory(category)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      {
                        backgroundColor: pressed
                          ? colors.accentLight
                          : selectedCategories.includes(category.id)
                          ? colors.accentLight
                          : colors.border,
                        borderColor: selectedCategories.includes(category.id)
                          ? colors.accent
                          : pressed
                          ? colors.accent
                          : colors.border,
                        borderWidth: selectedCategories.includes(category.id) || pressed ? 2 : 1,
                        opacity: category.locked ? 0.5 : 1,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                        shadowColor: pressed ? colors.accent : 'transparent',
                        shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                        shadowOpacity: pressed ? 0.2 : 0,
                        shadowRadius: pressed ? 4 : 0,
                        elevation: pressed ? 3 : 0,
                      },
                    ]}
                  >
                    <View style={styles.categoryContent}>
                      {selectedCategories.includes(category.id) && (
                        <View style={[styles.checkIcon, { backgroundColor: colors.accent }]}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color: selectedCategories.includes(category.id)
                              ? colors.accent
                              : colors.textSecondary,
                            fontWeight: selectedCategories.includes(category.id)
                              ? '700'
                              : '500',
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                      {featuredCategoryIds.includes(category.id) && (
                        <View style={[styles.featuredBadge, { backgroundColor: colors.accentLight }]}>
                          <Text style={[styles.featuredText, { color: colors.accent }]}>⭐</Text>
                        </View>
                      )}
                      {category.locked && (
                        <Text style={styles.lockIcon}>🔒</Text>
                      )}
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
              {hasMoreCategories && (
                <Animated.View entering={FadeIn.delay(300 + visibleCategories.length * 30)}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setShowAllCategories(true);
                    }}
                    style={({ pressed }) => [
                      styles.seeMoreChip,
                      {
                        backgroundColor: pressed ? colors.accentLight : colors.border,
                        borderColor: colors.accent,
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                      },
                    ]}
                  >
                    <Text style={[styles.seeMoreText, { color: colors.accent }]}>
                      See More ({availableCategories.length - MAX_VISIBLE_CATEGORIES})
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Button
            title="Start Game"
            onPress={handleStart}
            style={styles.startButton}
          />
        </Animated.View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={!!modalCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCategory(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalCategory(null)}
        >
          <Card
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {modalCategory && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text
                    style={[styles.modalTitle, { color: colors.text, flex: 1, marginBottom: 0 }]}
                    numberOfLines={1}
                  >
                    {modalCategory.name}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setModalCategory(null);
                    }}
                    style={({ pressed }) => [
                      styles.modalCloseBtn,
                      { backgroundColor: colors.border, opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
                  </Pressable>
                </View>
                <View>
                  <Text
                    style={[styles.modalDescription, { color: colors.textSecondary }]}
                  >
                    {modalCategory.description}
                  </Text>
                  <Text
                    style={[styles.modalExamples, { color: colors.textSecondary }]}
                  >
                    Examples: {modalCategory.words.slice(0, 5).join(', ')}
                    {modalCategory.words.length > 5 && '...'}
                  </Text>
                </View>
              </>
            )}
          </Card>
        </Pressable>
      </Modal>

      {/* All Categories Modal */}
      <Modal
        visible={showAllCategories}
        animationType="slide"
        onRequestClose={() => setShowAllCategories(false)}
      >
        <View style={[styles.fullScreenModal, { backgroundColor: colors.background }]}>
          <PatternBackground />
          <View style={[styles.fullScreenModalContent, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.allCategoriesHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: 28, flex: 1, marginBottom: 0 }]} numberOfLines={1}>
                All Categories
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAllCategories(false);
                }}
                style={({ pressed }) => [
                  styles.modalCloseBtn,
                  {
                    backgroundColor: colors.border,
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
              </Pressable>
            </View>
            <ScrollView 
              style={styles.categoriesList}
              contentContainerStyle={styles.categoriesListContent}
              showsVerticalScrollIndicator={false}
            >
              {availableCategories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => {
                    toggleCategory(category.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    styles.categoryListItem,
                    {
                      backgroundColor: pressed
                        ? colors.accentLight
                        : selectedCategories.includes(category.id)
                        ? colors.accentLight
                        : colors.cardBackground,
                      borderColor: pressed
                        ? colors.accent
                        : selectedCategories.includes(category.id)
                        ? colors.accent
                        : colors.border,
                      borderWidth: selectedCategories.includes(category.id) || pressed ? 2 : 1,
                      opacity: category.locked ? 0.5 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      shadowColor: pressed ? colors.accent : 'transparent',
                      shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                      shadowOpacity: pressed ? 0.15 : 0,
                      shadowRadius: pressed ? 3 : 0,
                      elevation: pressed ? 2 : 0,
                    },
                  ]}
                  disabled={category.locked}
                >
                  <View style={styles.categoryListItemContent}>
                    <View style={styles.categoryListItemLeft}>
                      {selectedCategories.includes(category.id) && (
                        <View style={[styles.checkIconSmall, { backgroundColor: colors.accent }]}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                      <View style={styles.categoryListItemText}>
                        <View style={styles.categoryListItemHeader}>
                          <Text
                            style={[
                              styles.categoryListItemName,
                              {
                                color: selectedCategories.includes(category.id)
                                  ? colors.accent
                                  : colors.text,
                                fontWeight: selectedCategories.includes(category.id)
                                  ? '700'
                                  : '600',
                              },
                            ]}
                          >
                            {category.name}
                          </Text>
                          {featuredCategoryIds.includes(category.id) && (
                            <View style={[styles.featuredBadgeSmall, { backgroundColor: colors.accentLight }]}>
                              <Text style={[styles.featuredTextSmall, { color: colors.accent }]}>⭐</Text>
                            </View>
                          )}
                          {(category.id === 'muslim-coffee' || category.id === 'local-halal') && (
                            <View style={[styles.locationBadge, { backgroundColor: colors.accentLight }]}>
                              <Text style={[styles.locationBadgeText, { color: colors.accent }]}>📍</Text>
                            </View>
                          )}
                          {category.locked && (
                            <Text style={styles.lockIconSmall}>🔒</Text>
                          )}
                        </View>
                        <Text
                          style={[styles.categoryListItemDescription, { color: colors.textSecondary }]}
                        >
                          {category.description}
                        </Text>
                        {(category.id === 'muslim-coffee' || category.id === 'local-halal') && category.words.length === 0 ? (
                          <Text
                            style={[styles.categoryListItemExamples, { color: colors.accent, fontStyle: 'italic' }]}
                          >
                            📍 Tap to enable location and find nearby places
                          </Text>
                        ) : category.words.length > 0 ? (
                          <Text
                            style={[styles.categoryListItemExamples, { color: colors.textSecondary }]}
                          >
                            Examples: {category.words.slice(0, 4).join(', ')}
                            {category.words.length > 4 && '...'}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Location Permission Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLocationModal(false)}
        >
          <Card
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.text, flex: 1, marginBottom: 0 }]} numberOfLines={1}>
                Enable Location 📍
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowLocationModal(false);
                  setLocationCategoryType(null);
                  setIsLoadingLocation(false);
                }}
                style={({ pressed }) => [
                  styles.modalCloseBtn,
                  { backgroundColor: colors.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
              </Pressable>
            </View>
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              To use {locationCategoryType === 'coffee' ? 'Muslim Coffee Shops' : 'Local Halal Spots'}, we need to find nearby businesses near you.
            </Text>
            <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
              We'll search within 50 miles and show you the highest-rated places sorted by reviews. This makes your game personalized to your area!
            </Text>
            <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md, fontSize: 12 }]}>
              Your location is only used to find nearby businesses. We don't store or share your location data.
            </Text>
            {isLoadingLocation && (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Searching for nearby places...
                </Text>
                <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>
                  This may take a few seconds
                </Text>
              </View>
            )}
            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowLocationModal(false);
                  setLocationCategoryType(null);
                  setIsLoadingLocation(false);
                }}
                variant="secondary"
                style={[styles.modalButtonCompact, { marginRight: spacing.sm }]}
                disabled={isLoadingLocation}
              />
              <Button
                title={isLoadingLocation ? "Loading..." : "Enable Location"}
                onPress={handleLocationPermissionRequest}
                disabled={isLoadingLocation}
                style={styles.modalButtonCompact}
              />
            </View>
          </Card>
        </Pressable>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={!!infoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setInfoModal(null)}
        >
          <Card
            style={styles.infoModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {infoModal && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.modalTitle, { color: colors.text, flex: 1, marginBottom: 0 }]} numberOfLines={1}>
                    {infoModal === 'blind' && 'Blind Imposter'}
                    {infoModal === 'double' && 'Double Agent'}
                    {infoModal === 'word' && 'Word + Clue Mode'}
                    {infoModal === 'question' && 'Question Mode'}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setInfoModal(null);
                    }}
                    style={({ pressed }) => [
                      styles.modalCloseBtn,
                      { backgroundColor: colors.border, opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
                  </Pressable>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.infoModalScrollContent}
                >
                  {infoModal === 'blind' && (
                    <>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                        When enabled, the imposter will only see "IMPOSTER" on their card - they won't see the category or any hints.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        This makes the game more challenging as the imposter must bluff without knowing which category the word belongs to.
                      </Text>
                    </>
                  )}
                  {infoModal === 'double' && (
                    <>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                        One player (chosen randomly) will see the secret word on their card, but they are NOT an imposter.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        The Double Agent wins if they survive without being voted out. Neither the imposters nor the other players know who the Double Agent is.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        This adds an extra layer of strategy and deception to the game!
                      </Text>
                    </>
                  )}
                  {infoModal === 'word' && (
                    <>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                        Players take turns giving ONE clue word related to the secret word. The clue must be a single word (not a phrase or sentence).
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        <Text style={{ fontWeight: '600' }}>Example:</Text> If the secret word is "Masjid", players might give clues like "Prayer", "Dome", "Friday", "Community", etc.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        After all players have given their clues, the group discusses and votes to identify the imposter(s). The imposter tries to blend in without knowing the word.
                      </Text>
                    </>
                  )}
                  {infoModal === 'question' && (
                    <>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                        Players ask and answer questions about the secret word. One player asks a question, and the next player must answer it truthfully (if they know the word) or bluff (if they're the imposter).
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        <Text style={{ fontWeight: '600' }}>Example:</Text> If the secret word is "Ramadan", questions might be "What month is this?" or "What do people do during this time?" Players answer verbally.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.md }]}>
                        This mode encourages more conversation and interaction. After the Q&A round, players vote on who they think is the imposter.
                      </Text>
                    </>
                  )}
                </ScrollView>
              </>
            )}
          </Card>
        </Pressable>
      </Modal>
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
  headerContainer: {
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonContainer: {
    marginRight: spacing.md,
  },
  backIcon: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  heading: {
    ...typography.heading,
    fontSize: 28,
    flex: 1,
    fontWeight: '600', // Ensure consistent weight
  },
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 18,
    marginBottom: spacing.md,
    letterSpacing: 0.3,
    fontWeight: '600', // Ensure consistent weight
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  numberSection: {
    marginBottom: spacing.lg,
  },
  numberLabelContainer: {
    marginBottom: spacing.sm,
  },
  numberLabel: {
    ...typography.bodyBold,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
  },
  warningBadge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.xs / 2,
  },
  warningText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  numberSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  numberButton: {
    width: 48, // Already meets 44pt minimum
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  numberDisplay: {
    minWidth: 70,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  number: {
    ...typography.heading,
    fontSize: 32,
    fontWeight: '700',
  },
  gameModeHeader: {
    marginBottom: spacing.sm,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeOptionWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  modeOption: {
    width: '100%',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  modeText: {
    ...typography.body,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  modeInfoButton: {
    marginTop: spacing.xs,
  },
  modeInfoIcon: {
    width: 24, // Increased for better accessibility
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44, // iOS accessibility minimum
    minHeight: 44,
  },
  toggleContainer: {
    gap: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  toggleLabel: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  infoButton: {
    marginLeft: spacing.xs,
  },
  infoIcon: {
    width: 24, // Increased for better accessibility
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44, // iOS accessibility minimum
    minHeight: 44,
  },
  infoIconText: {
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  toggleDescription: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  categoryHint: {
    ...typography.caption,
    fontSize: 13, // Slightly larger for better readability
    marginBottom: spacing.md,
    lineHeight: 20, // Improved line height
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingVertical: spacing.md, // Increased for better touch target
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
    minHeight: 44, // iOS accessibility minimum
    justifyContent: 'center',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryText: {
    ...typography.caption,
    fontSize: 13,
  },
  lockIcon: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  featuredBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  featuredText: {
    fontSize: 11,
  },
  featuredBadgeSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  featuredTextSmall: {
    fontSize: 12,
  },
  nameInputsContainer: {
    gap: spacing.sm,
  },
  nameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInputLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInputLabelText: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  nameInputContainer: {
    flex: 1,
    position: 'relative',
  },
  nameInput: {
    width: '100%',
    height: 48, // Already meets 44pt minimum
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    ...typography.body,
    fontSize: 16, // Standard body size
    minHeight: 44,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.xs,
    top: '50%',
    transform: [{ translateY: -22 }], // Adjusted for larger button
    zIndex: 1,
    padding: spacing.xs, // Added padding for larger touch target
  },
  clearButtonIcon: {
    width: 32, // Increased for better touch target
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44, // iOS accessibility minimum
    minHeight: 44,
  },
  clearButtonText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
  startButton: {
    marginTop: spacing.md,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.xl,
  },
  infoModalContent: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    padding: spacing.lg,
  },
  infoModalScrollContent: {
    paddingBottom: spacing.sm,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  modalCloseBtn: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  modalCloseBtnText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalTitle: {
    ...typography.heading,
    fontSize: 22, // Slightly larger for better hierarchy
    marginBottom: spacing.md, // Increased spacing
    fontWeight: '600', // Ensure consistent weight
  },
  modalDescription: {
    ...typography.body,
    fontSize: 15, // Slightly larger for better readability
    lineHeight: 22, // Improved line height
    marginBottom: spacing.md, // Increased spacing
  },
  modalExamples: {
    ...typography.caption,
    marginBottom: 0,
  },
  modalButtonCompact: {
    flex: 1,
    minHeight: 44, // iOS accessibility minimum
    paddingVertical: spacing.md, // Increased for better touch target
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  loadingText: {
    ...typography.body,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  loadingSubtext: {
    ...typography.caption,
    fontSize: 12,
  },
  seeMoreChip: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  seeMoreText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
  },
  fullScreenModal: {
    flex: 1,
  },
  fullScreenModalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  allCategoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  categoriesList: {
    flex: 1,
  },
  categoriesListContent: {
    paddingBottom: spacing.xl,
  },
  categoryListItem: {
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    minHeight: 44, // iOS accessibility minimum
  },
  categoryListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryListItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.sm,
  },
  checkIconSmall: {
    width: 24, // Standardized size
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  categoryListItemText: {
    flex: 1,
  },
  categoryListItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryListItemName: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  lockIconSmall: {
    fontSize: 14,
  },
  categoryListItemDescription: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  categoryListItemExamples: {
    ...typography.caption,
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  locationBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: spacing.xs,
  },
  locationBadgeText: {
    fontSize: 12,
  },
});