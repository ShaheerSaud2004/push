import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Category } from '../types';

const STORAGE_KEYS = {
  SETTINGS: '@khafi:settings',
  UNLOCKED_CATEGORIES: '@khafi:unlocked',
  CUSTOM_CATEGORIES: '@khafi:custom',
  LOCATION_CATEGORIES: '@khafi:location_categories',
  USED_WORDS: '@khafi:used_words',
  PREMIUM: '@khafi:premium',
};

export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const existing = await getSettings();
    const updated = { ...existing, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  return {
    theme: 'dark', // Warm Majlis - default theme
    unlockedCategories: [],
    customCategories: [],
  };
};

export const saveCustomCategory = async (category: Category): Promise<void> => {
  try {
    const categories = await getCustomCategories();
    const updated = categories.filter(c => c.id !== category.id);
    updated.push(category);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving custom category:', error);
  }
};

export const getCustomCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading custom categories:', error);
  }
  return [];
};

export const deleteCustomCategory = async (categoryId: string): Promise<void> => {
  try {
    const categories = await getCustomCategories();
    const updated = categories.filter(c => c.id !== categoryId);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting custom category:', error);
  }
};

export const unlockCategory = async (categoryId: string): Promise<void> => {
  try {
    const unlocked = await getUnlockedCategories();
    if (!unlocked.includes(categoryId)) {
      unlocked.push(categoryId);
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_CATEGORIES, JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Error unlocking category:', error);
  }
};

export const getUnlockedCategories = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_CATEGORIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading unlocked categories:', error);
  }
  return [];
};

// Location-based category storage
export const saveLocationCategories = async (categories: { coffee?: Category; halal?: Category }): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving location categories:', error);
  }
};

export const getLocationCategories = async (): Promise<{ coffee?: Category; halal?: Category }> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_CATEGORIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading location categories:', error);
  }
  return {};
};

// Track used words to prevent repetition
export const addUsedWord = async (word: string): Promise<void> => {
  try {
    const usedWords = await getUsedWords();
    if (!usedWords.includes(word)) {
      usedWords.push(word);
      await AsyncStorage.setItem(STORAGE_KEYS.USED_WORDS, JSON.stringify(usedWords));
    }
  } catch (error) {
    console.error('Error saving used word:', error);
  }
};

export const getUsedWords = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USED_WORDS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading used words:', error);
  }
  return [];
};

export const clearUsedWords = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USED_WORDS);
  } catch (error) {
    console.error('Error clearing used words:', error);
  }
};

// Premium/Paywall tracking
export const setIsPremium = async (isPremium: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM, JSON.stringify(isPremium));
  } catch (error) {
    console.error('Error saving premium status:', error);
  }
};

export const getIsPremium = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading premium status:', error);
  }
  return false;
};