export interface SpendingCategory {
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

export interface CardReward {
  category: string;
  amount: number;
}

export interface CreditCard {
  id: string;
  name: string;
  rewards: CardReward[];
  features: string[];
}

export interface OptimizationRequest {
  categories: SpendingCategory[];
}

export interface OptimizationResponse {
  optimizedCards: CreditCard[];
  potentialRewards: CardReward[];
} 