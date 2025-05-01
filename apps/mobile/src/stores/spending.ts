import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpendingCategory } from '../utils/optimization/types';
import { SPENDING_CATEGORIES } from '../constants/categories';

interface SpendingState {
  categories: SpendingCategory[];
  activeCategory: string | null;
  isEditing: boolean;
  addCategory: (category: SpendingCategory) => void;
  updateCategory: (id: string, updates: Partial<SpendingCategory>) => void;
  removeCategory: (id: string) => void;
  setActiveCategory: (id: string | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  getTotalMonthlySpend: () => number;
  getTotalAnnualSpend: () => number;
  reset: () => void;
}

export const useSpendingStore = create<SpendingState>()(
  persist(
    (set, get) => ({
      categories: [],
      activeCategory: null,
      isEditing: false,

      addCategory: (category: SpendingCategory) => {
        const { categories } = get();
        if (categories.some((c) => c.name === category.name)) {
          return; // Category already exists
        }
        set({ categories: [...categories, category] });
      },

      updateCategory: (id: string, updates: Partial<SpendingCategory>) => {
        const { categories } = get();
        set({
          categories: categories.map((category) =>
            category.name === id ? { ...category, ...updates } : category
          ),
        });
      },

      removeCategory: (id: string) => {
        const { categories } = get();
        set({
          categories: categories.filter((category) => category.name !== id),
        });
      },

      setActiveCategory: (id: string | null) => {
        set({ activeCategory: id });
      },

      setIsEditing: (isEditing: boolean) => {
        set({ isEditing });
      },

      getTotalMonthlySpend: () => {
        const { categories } = get();
        return categories.reduce((total, category) => {
          if (category.frequency === 'monthly') {
            return total + category.amount;
          }
          return total + (category.amount / 12);
        }, 0);
      },

      getTotalAnnualSpend: () => {
        const { categories } = get();
        return categories.reduce((total, category) => {
          if (category.frequency === 'yearly') {
            return total + category.amount;
          }
          return total + (category.amount * 12);
        }, 0);
      },

      reset: () => {
        set({
          categories: [],
          activeCategory: null,
          isEditing: false,
        });
      },
    }),
    {
      name: 'blinn-spending-storage',
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