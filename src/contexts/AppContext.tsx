import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentChallenge: number;
  setCurrentChallenge: (day: number) => void;
  completedTopics: string[];
  markTopicCompleted: (topic: string) => void;
  dailyQuote: string | null;
  setDailyQuote: (quote: string) => void;
  powerWord: { word: string; definition: string } | null;
  setPowerWord: (word: { word: string; definition: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [dailyQuote, setDailyQuote] = useState<string | null>(null);
  const [powerWord, setPowerWord] = useState<{ word: string; definition: string } | null>(null);

  const markTopicCompleted = (topic: string) => {
    setCompletedTopics(prev => [...prev, topic]);
  };

  return (
    <AppContext.Provider value={{
      currentChallenge,
      setCurrentChallenge,
      completedTopics,
      markTopicCompleted,
      dailyQuote,
      setDailyQuote,
      powerWord,
      setPowerWord,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};