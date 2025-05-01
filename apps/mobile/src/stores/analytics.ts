import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpendingCategory } from '../utils/optimization/types';
import { SPENDING_CATEGORIES } from '../constants/categories';

interface CategoryAnalytics {
  averageAmount: number;
  preferredFrequency: 'monthly' | 'yearly';
  lastUsedAmount: number;
  usageCount: number;
}

interface AnalyticsState {
  categoryAnalytics: Record<string, CategoryAnalytics>;
  updateCategoryAnalytics: (category: SpendingCategory) => void;
  getSmartDefaults: (categoryId: string) => {
    suggestedAmount: number;
    suggestedFrequency: 'monthly' | 'yearly';
  };
  getCategoryInsights: (categoryId: string) => CategoryAnalytics | null;
  reset: () => void;
}

const DEFAULT_ANALYTICS: Record<string, CategoryAnalytics> = SPENDING_CATEGORIES.reduce(
  (acc, category) => ({
    ...acc,
    [category.id]: {
      averageAmount: 0,
      preferredFrequency: 'monthly',
      lastUsedAmount: 0,
      usageCount: 0,
    },
  }),
  {}
);

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      categoryAnalytics: DEFAULT_ANALYTICS,

      updateCategoryAnalytics: (category: SpendingCategory) => {
        set((state) => {
          const currentAnalytics = state.categoryAnalytics[category.name] || {
            averageAmount: 0,
            preferredFrequency: 'monthly',
            lastUsedAmount: 0,
            usageCount: 0,
          };

          const newUsageCount = currentAnalytics.usageCount + 1;
          const newAverageAmount =
            (currentAnalytics.averageAmount * currentAnalytics.usageCount + category.amount) /
            newUsageCount;

          return {
            categoryAnalytics: {
              ...state.categoryAnalytics,
              [category.name]: {
                averageAmount: newAverageAmount,
                preferredFrequency: category.frequency,
                lastUsedAmount: category.amount,
                usageCount: newUsageCount,
              },
            },
          };
        });
      },

      getSmartDefaults: (categoryId: string) => {
        const analytics = get().categoryAnalytics[categoryId];
        if (!analytics || analytics.usageCount === 0) {
          return {
            suggestedAmount: 0,
            suggestedFrequency: 'monthly',
          };
        }

        return {
          suggestedAmount: analytics.lastUsedAmount,
          suggestedFrequency: analytics.preferredFrequency,
        };
      },

      getCategoryInsights: (categoryId: string) => {
        return get().categoryAnalytics[categoryId] || null;
      },

      reset: () => {
        set({
          categoryAnalytics: DEFAULT_ANALYTICS,
        });
      },
    }),
    {
      name: 'blinn-analytics-storage',
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