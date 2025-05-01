import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSpendingStore } from './spending';

interface CardReward {
  category: string;
  amount: number;
}

interface CreditCard {
  id: string;
  name: string;
  rewards: CardReward[];
  features: string[];
}

interface OptimizationState {
  optimizedCards: CreditCard[];
  potentialRewards: CardReward[];
  isOptimizing: boolean;
  error: string | null;
  optimize: () => Promise<void>;
  reset: () => void;
}

const API_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'https://api.blinn.app/api/v1'; // Replace with your production API URL

export const useOptimizationStore = create<OptimizationState>()(
  persist(
    (set, get) => ({
      optimizedCards: [],
      potentialRewards: [],
      isOptimizing: false,
      error: null,

      optimize: async () => {
        set({ isOptimizing: true, error: null });
        
        try {
          const { categories } = useSpendingStore.getState();
          
          const response = await fetch(`${API_URL}/optimize`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categories }),
          });

          if (!response.ok) {
            throw new Error('Failed to optimize credit cards');
          }

          const { optimizedCards, potentialRewards } = await response.json();

          set({
            optimizedCards,
            potentialRewards,
            isOptimizing: false,
          });
        } catch (error) {
          set({
            error: 'Failed to optimize credit cards. Please try again.',
            isOptimizing: false,
          });
        }
      },

      reset: () => {
        set({
          optimizedCards: [],
          potentialRewards: [],
          isOptimizing: false,
          error: null,
        });
      },
    }),
    {
      name: 'blinn-optimization-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 