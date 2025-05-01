import { Prisma } from '@prisma/client';

export interface SpendingCategory {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
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

export interface OptimizationResult {
  optimizedCards: CreditCard[];
  potentialRewards: CardReward[];
}

export interface CardWithRewards extends CreditCard {
  totalRewards: number;
}

// Raw database types
export type DbReward = {
  id: string;
  category: string;
  amount: number;
  creditCardId: string;
};

export type DbFeature = {
  id: string;
  description: string;
  creditCardId: string;
};

export type DbCreditCard = {
  id: string;
  name: string;
  issuer: string;
  rewards: DbReward[];
  features: DbFeature[];
  createdAt: Date;
  updatedAt: Date;
}; 