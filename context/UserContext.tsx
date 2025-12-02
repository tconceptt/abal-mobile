import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeightEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  weight: number;
}

interface UserContextType {
  goalWeight: number | null;
  setGoalWeight: (weight: number | null) => Promise<void>;
  weightHistory: WeightEntry[];
  addWeightEntry: (weight: number, date: string) => Promise<void>;
  deleteWeightEntry: (id: string) => Promise<void>;
  latestWeight: number | null;
  startWeight: number | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const STORAGE_KEYS = {
  GOAL_WEIGHT: 'abal_goal_weight',
  WEIGHT_HISTORY: 'abal_weight_history',
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [goalWeight, setGoalWeightState] = useState<number | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedGoal, storedHistory] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.GOAL_WEIGHT),
        AsyncStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY),
      ]);

      if (storedGoal) setGoalWeightState(parseFloat(storedGoal));
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        // Sort by date ascending
        setWeightHistory(history.sort((a: WeightEntry, b: WeightEntry) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      }
    } catch (e) {
      console.error('Failed to load user data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const setGoalWeight = async (weight: number | null) => {
    setGoalWeightState(weight);
    if (weight) {
      await AsyncStorage.setItem(STORAGE_KEYS.GOAL_WEIGHT, weight.toString());
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.GOAL_WEIGHT);
    }
  };

  const addWeightEntry = async (weight: number, date: string) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date,
      weight,
    };

    const newHistory = [...weightHistory, newEntry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setWeightHistory(newHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(newHistory));
  };

  const deleteWeightEntry = async (id: string) => {
    const newHistory = weightHistory.filter(entry => entry.id !== id);
    setWeightHistory(newHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(newHistory));
  };

  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null;
  const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : null;

  return (
    <UserContext.Provider
      value={{
        goalWeight,
        setGoalWeight,
        weightHistory,
        addWeightEntry,
        deleteWeightEntry,
        latestWeight,
        startWeight,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}



