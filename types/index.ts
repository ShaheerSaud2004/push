export type Player = {
  id: string;
  name: string;
  role: 'normal' | 'imposter' | 'doubleAgent';
  hasSeenCard: boolean;
};

export type GameMode = 'word' | 'question';

export type SpecialModes = {
  blindImposter: boolean;
  doubleAgent: boolean;
};

export type GameSettings = {
  numPlayers: number;
  numImposters: number;
  mode: GameMode;
  specialModes: SpecialModes;
  selectedCategories: string[];
  showCategoryToImposter: boolean;
  showHintToImposter: boolean;
  startingPlayerId: string;
  secretWord: string;
  secretCategory: string;
  secretHint?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  words: string[];
  locked: boolean;
  isCustom: boolean;
};

export type AppSettings = {
  theme: 'soft' | 'paper' | 'dark';
  unlockedCategories: string[];
  customCategories: Category[];
};