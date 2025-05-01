import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@blinn/common/src/types/card';
import seedCards from '../data/seed_cards.json';

export type SortOption = 'name' | 'issuer' | 'rewards' | 'default';
export type SortOrder = 'asc' | 'desc';

interface CardStore {
  // State
  cards: Card[];
  selectedCards: string[];
  searchQuery: string;
  sortOption: SortOption;
  sortOrder: SortOrder;
  isRefreshing: boolean;

  // Actions
  toggleCard: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  setSortOrder: (order: SortOrder) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  refreshCards: () => Promise<void>;
  getFilteredCards: () => Card[];
}

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cards: seedCards.cards,
      selectedCards: [],
      searchQuery: '',
      sortOption: 'default',
      sortOrder: 'asc',
      isRefreshing: false,

      // Actions
      toggleCard: (id) =>
        set((state) => ({
          selectedCards: state.selectedCards.includes(id)
            ? state.selectedCards.filter((cardId) => cardId !== id)
            : [...state.selectedCards, id],
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortOption: (option) => set({ sortOption: option }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setIsRefreshing: (isRefreshing) => set({ isRefreshing }),

      refreshCards: async () => {
        set({ isRefreshing: true });
        try {
          // Simulate API call - replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // For now, we'll just refresh the existing cards
          // In a real app, you would fetch fresh data from the server
          set({ isRefreshing: false });
        } catch (error) {
          console.error('Error refreshing cards:', error);
          set({ isRefreshing: false });
        }
      },

      getFilteredCards: () => {
        const { cards, searchQuery, sortOption, sortOrder } = get();
        
        let filteredCards = [...cards];
        
        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredCards = filteredCards.filter(
            (card) =>
              card.name.toLowerCase().includes(query) ||
              card.issuer.toLowerCase().includes(query) ||
              card.rewards.some((reward) =>
                reward.category.toLowerCase().includes(query)
              )
          );
        }

        // Apply sorting
        filteredCards.sort((a, b) => {
          const multiplier = sortOrder === 'asc' ? 1 : -1;
          
          switch (sortOption) {
            case 'name':
              return multiplier * a.name.localeCompare(b.name);
            case 'issuer':
              return multiplier * a.issuer.localeCompare(b.issuer);
            case 'rewards':
              // Sort by highest reward multiplier
              const aMaxReward = Math.max(...a.rewards.map((r) => r.multiplier));
              const bMaxReward = Math.max(...b.rewards.map((r) => r.multiplier));
              return multiplier * (bMaxReward - aMaxReward);
            default:
              return 0;
          }
        });

        return filteredCards;
      },
    }),
    {
      name: 'card-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 