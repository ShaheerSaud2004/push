import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameSettings } from '../types';

type GameContextType = {
  players: Player[];
  settings: GameSettings | null;
  setPlayers: (players: Player[]) => void;
  setSettings: (settings: GameSettings) => void;
  updatePlayer: (playerId: string, updatedPlayer: Player) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings | null>(null);

  const updatePlayer = (playerId: string, updatedPlayer: Player) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p => p.id === playerId ? updatedPlayer : p)
    );
  };

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
        updatePlayer,
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