import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameSettings } from '../types';

type GameContextType = {
  players: Player[];
  settings: GameSettings | null;
  setPlayers: (players: Player[]) => void;
  setSettings: (settings: GameSettings) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings | null>(null);

  const resetGame = () => {
    setPlayers([]);
    setSettings(null);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        settings,
        setPlayers,
        setSettings,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};