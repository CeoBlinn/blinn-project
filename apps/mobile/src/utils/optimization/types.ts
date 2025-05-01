import { Card } from '@blinn/common/src/types/card';

export interface SpendingCategory {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
}

export interface SpendingProfile {
  categories: SpendingCategory[];
  totalAnnualSpend: number;
}

export interface RewardValue {
  card: Card;
  category: string;
  rewardValue: number;  // In dollars
  rewardMultiplier: number;
}

export interface CardRecommendation {
  card: Card;
  annualRewards: number;
  netValue: number;  // After annual fee
  bestCategories: Array<{
    category: string;
    rewardValue: number;
    rewardMultiplier: number;
  }>;
  annualFeeJustified: boolean;
  annualFeeBreakeven: number;
}

export interface OptimizationResult {
  totalAnnualRewards: number;
  netAnnualValue: number;
  recommendedCards: CardRecommendation[];
  categoryBreakdown: Record<string, Card>;
  monthlySpendingRequired: number;
  potentialUpside: number;
} 