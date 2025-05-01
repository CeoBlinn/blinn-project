export interface SpendingCategoryMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
  examples: string[];
  color: string;
}

export const SPENDING_CATEGORIES: SpendingCategoryMeta[] = [
  {
    id: 'dining',
    name: 'Dining',
    icon: 'silverware',
    description: 'Restaurants, cafes, and food delivery',
    examples: ['Restaurants', 'Fast food', 'Coffee shops', 'Food delivery'],
    color: '#FF6B6B',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: 'cart',
    description: 'Supermarkets and grocery stores',
    examples: ['Supermarkets', 'Specialty food stores', 'Farmers markets'],
    color: '#4ECDC4',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'airplane',
    description: 'Airlines, hotels, and car rentals',
    examples: ['Flights', 'Hotels', 'Car rentals', 'Travel agencies'],
    color: '#45B7D1',
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: 'gas-station',
    description: 'Gas stations and fuel purchases',
    examples: ['Gas stations', 'EV charging'],
    color: '#96CEB4',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'movie',
    description: 'Movies, events, and streaming services',
    examples: ['Movie theaters', 'Concerts', 'Streaming subscriptions'],
    color: '#D4A5A5',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping',
    description: 'Retail stores and online shopping',
    examples: ['Department stores', 'Online retailers', 'Clothing'],
    color: '#FFD93D',
  },
  {
    id: 'transit',
    name: 'Transit',
    icon: 'train',
    description: 'Public transportation and rideshare',
    examples: ['Public transit', 'Uber/Lyft', 'Taxis'],
    color: '#6C5B7B',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'lightning-bolt',
    description: 'Phone, internet, and utilities',
    examples: ['Phone bill', 'Internet', 'Electricity', 'Water'],
    color: '#355C7D',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'dots-horizontal',
    description: 'Other regular expenses',
    examples: ['Miscellaneous purchases'],
    color: '#9B9B9B',
  },
]; 