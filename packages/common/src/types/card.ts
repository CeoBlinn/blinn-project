export interface CardReward {
  category: string;
  multiplier: number;
  details?: string;
  maxSpend?: number;
}

export interface Card {
  id: string;
  name: string;
  issuer: string;
  image: string;
  defaultMultiplier: number;
  rewards: CardReward[];
  annualFee?: number;
  foreignTransactionFee?: number;
  signupBonus?: string;
  notes?: string;
  lastUsed?: string;
  isPreferred?: boolean;
}

export interface CardState {
  selectedCards: string[];
  searchQuery: string;
  allCards: Card[];
} 