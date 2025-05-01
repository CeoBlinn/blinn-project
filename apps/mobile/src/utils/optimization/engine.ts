import { Card } from '@blinn/common/src/types/card';
import {
  SpendingProfile,
  SpendingCategory,
  RewardValue,
  CardRecommendation,
  OptimizationResult,
} from './types';

const POINTS_TO_DOLLARS = 0.01; // Base conversion rate

export class OptimizationEngine {
  private cards: Card[];
  private spendingProfile: SpendingProfile;

  constructor(cards: Card[], spendingProfile: SpendingProfile) {
    this.cards = cards;
    this.spendingProfile = spendingProfile;
  }

  private calculateAnnualAmount(category: SpendingCategory): number {
    return category.frequency === 'monthly'
      ? category.amount * 12
      : category.amount;
  }

  private calculateRewardValue(
    card: Card,
    category: SpendingCategory
  ): RewardValue {
    const matchingReward = card.rewards.find(
      (reward) => reward.category.toLowerCase() === category.name.toLowerCase()
    );

    const multiplier = matchingReward?.multiplier || card.defaultMultiplier || 1;
    const annualAmount = this.calculateAnnualAmount(category);
    const rewardValue = (annualAmount * multiplier * POINTS_TO_DOLLARS);

    return {
      card,
      category: category.name,
      rewardValue,
      rewardMultiplier: multiplier,
    };
  }

  private calculateBreakeven(card: Card, annualRewards: number): number {
    if (!card.annualFee) return 0;
    return (card.annualFee / (POINTS_TO_DOLLARS * card.defaultMultiplier)) / 12;
  }

  private evaluateCard(card: Card): CardRecommendation {
    const categoryRewards = this.spendingProfile.categories.map((category) =>
      this.calculateRewardValue(card, category)
    );

    const annualRewards = categoryRewards.reduce(
      (sum, reward) => sum + reward.rewardValue,
      0
    );

    const netValue = annualRewards - (card.annualFee || 0);
    const annualFeeBreakeven = this.calculateBreakeven(card, annualRewards);

    // Sort categories by reward value to find best categories
    const bestCategories = categoryRewards
      .sort((a, b) => b.rewardValue - a.rewardValue)
      .slice(0, 3)
      .map((reward) => ({
        category: reward.category,
        rewardValue: reward.rewardValue,
        rewardMultiplier: reward.rewardMultiplier,
      }));

    return {
      card,
      annualRewards,
      netValue,
      bestCategories,
      annualFeeJustified: netValue > 0,
      annualFeeBreakeven,
    };
  }

  private findBestCardForCategory(
    category: SpendingCategory
  ): { card: Card; value: number } {
    return this.cards.reduce(
      (best, card) => {
        const reward = this.calculateRewardValue(card, category);
        return reward.rewardValue > best.value
          ? { card, value: reward.rewardValue }
          : best;
      },
      { card: this.cards[0], value: -Infinity }
    );
  }

  optimize(): OptimizationResult {
    // Evaluate all cards
    const cardEvaluations = this.cards
      .map((card) => this.evaluateCard(card))
      .sort((a, b) => b.netValue - a.netValue);

    // Find best card for each category
    const categoryBreakdown: Record<string, Card> = {};
    this.spendingProfile.categories.forEach((category) => {
      const { card } = this.findBestCardForCategory(category);
      categoryBreakdown[category.name] = card;
    });

    // Calculate optimal card combination
    const recommendedCards = cardEvaluations
      .filter((evaluation) => evaluation.netValue > 0)
      .slice(0, 3); // Recommend top 3 cards with positive net value

    const totalAnnualRewards = recommendedCards.reduce(
      (sum, card) => sum + card.annualRewards,
      0
    );

    const netAnnualValue = recommendedCards.reduce(
      (sum, card) => sum + card.netValue,
      0
    );

    // Calculate monthly spending required to break even
    const monthlySpendingRequired = recommendedCards.reduce(
      (sum, { card, annualFeeBreakeven }) => sum + annualFeeBreakeven,
      0
    );

    // Calculate potential upside (difference between optimal and current rewards)
    const potentialUpside = totalAnnualRewards - (
      this.spendingProfile.totalAnnualSpend * POINTS_TO_DOLLARS
    );

    return {
      totalAnnualRewards,
      netAnnualValue,
      recommendedCards,
      categoryBreakdown,
      monthlySpendingRequired,
      potentialUpside,
    };
  }
} 