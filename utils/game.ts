import { Player, GameSettings, Category } from '../types';

export const generatePlayerNames = (count: number): string[] => {
  const names: string[] = [];
  for (let i = 1; i <= count; i++) {
    names.push(`Player ${i}`);
  }
  return names;
};

export const createPlayers = (
  numPlayers: number,
  numImposters: number,
  hasDoubleAgent: boolean,
  startingPlayerId: string,
  playerNames: string[] = []
): Player[] => {
  const players: Player[] = [];
  const indices = Array.from({ length: numPlayers }, (_, i) => i);
  
  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const imposterIndices = indices.slice(0, numImposters);
  const remainingIndices = indices.slice(numImposters);
  
  // Determine double agent index if enabled
  let doubleAgentIndex: number | null = null;
  if (hasDoubleAgent && remainingIndices.length > 0) {
    doubleAgentIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
  }

  // Create players
  for (let i = 0; i < numPlayers; i++) {
    const id = `player-${i}`;
    let role: 'normal' | 'imposter' | 'doubleAgent' = 'normal';
    
    if (imposterIndices.includes(i)) {
      role = 'imposter';
    } else if (doubleAgentIndex === i) {
      role = 'doubleAgent';
    }

    players.push({
      id,
      name: playerNames[i] || `Player ${i + 1}`,
      role,
      hasSeenCard: false,
    });
  }

  // Sort so starting player is first
  const startIndex = players.findIndex(p => p.id === startingPlayerId);
  if (startIndex > 0) {
    const startPlayer = players[startIndex];
    players.splice(startIndex, 1);
    players.unshift(startPlayer);
  }

  return players;
};

export const selectRandomWord = (words: string[], usedWords: string[] = []): string => {
  // Filter out used words
  const availableWords = words.filter(word => !usedWords.includes(word));
  
  // If all words have been used, reset and use all words
  if (availableWords.length === 0) {
    return words[Math.floor(Math.random() * words.length)];
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

export const selectRandomCategory = (categoryIds: string[], categories: Category[], isPremium: boolean = false): string => {
  const availableCategories = categoryIds.filter(id => {
    const cat = categories.find(c => c.id === id);
    return cat && (!cat.locked || cat.isCustom || isPremium) && cat.words.length > 0;
  });
  
  if (availableCategories.length === 0) {
    return categoryIds[0] || '';
  }
  
  return availableCategories[Math.floor(Math.random() * availableCategories.length)];
};

// Select a random single category when none are selected
export const selectSingleRandomCategory = (categories: Category[], isPremium: boolean = false): string => {
  // Filter out locked categories (unless premium), and categories with no words
  const availableCategories = categories.filter(c => 
    (!c.locked || c.isCustom || isPremium) && c.words.length > 0
  );
  
  if (availableCategories.length === 0) {
    return '';
  }
  
  return availableCategories[Math.floor(Math.random() * availableCategories.length)].id;
};

export const getCategoryName = (categoryId: string, categories: Category[]): string => {
  const category = categories.find(c => c.id === categoryId);
  return category?.name || 'Unknown';
};

export const generateHint = (word: string): string => {
  // Simple hint generation - can be enhanced
  const hints: Record<string, string> = {
    'Masjid': 'A place of worship',
    'Prophet': 'A messenger of Allah',
    'Quran': 'The holy book',
  };
  
  return hints[word] || `Starts with "${word[0].toUpperCase()}"`;
};