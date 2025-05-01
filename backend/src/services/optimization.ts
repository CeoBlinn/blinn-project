import { PrismaClient, Prisma } from '@prisma/client';
import { SpendingCategory, CreditCard, CardReward } from '../types/optimization';

const prisma = new PrismaClient();

// This would typically come from a database
const AVAILABLE_CARDS: CreditCard[] = [
  {
    id: 'chase-sapphire',
    name: 'Chase Sapphire Preferred',
    rewards: [
      { category: 'Travel', amount: 0.05 }, // 5x points
      { category: 'Dining', amount: 0.03 }, // 3x points
      { category: 'Other', amount: 0.01 }, // 1x points
    ],
    features: [
      'No foreign transaction fees',
      '60,000 point sign-up bonus',
      'Primary rental car insurance',
    ],
  },
  {
    id: 'amex-gold',
    name: 'American Express Gold Card',
    rewards: [
      { category: 'Dining', amount: 0.04 }, // 4x points
      { category: 'Groceries', amount: 0.04 }, // 4x points
      { category: 'Travel', amount: 0.03 }, // 3x points
      { category: 'Other', amount: 0.01 }, // 1x points
    ],
    features: [
      '$120 dining credit',
      '4X points at restaurants',
      'Trip delay insurance',
    ],
  },
  // Add more cards here
];

interface CardWithRewards extends CreditCard {
  totalRewards: number;
}

export class OptimizationService {
  private calculateAnnualAmount(category: SpendingCategory): number {
    return category.frequency === 'monthly' 
      ? category.amount * 12 
      : category.amount;
  }

  private async calculateCardRewards(
    card: CreditCard,
    categories: SpendingCategory[]
  ): Promise<CardReward[]> {
    const dbCard = await prisma.creditCard.findUnique({
      where: { id: card.id },
      include: { rewards: true },
    });

    if (!dbCard) {
      throw new Error(`Card not found: ${card.id}`);
    }

    return categories.map(category => {
      const annualAmount = this.calculateAnnualAmount(category);
      const cardReward = dbCard.rewards.find(r => 
        r.category.toLowerCase() === category.name.toLowerCase()
      ) || dbCard.rewards.find(r => r.category === 'Other');

      return {
        category: category.name,
        amount: annualAmount * (cardReward?.amount || 0.01), // Default to 1% cashback
      };
    });
  }

  public async optimize(categories: SpendingCategory[]): Promise<{
    optimizedCards: CreditCard[];
    potentialRewards: CardReward[];
  }> {
    // Get all cards from database
    const dbCards = await prisma.creditCard.findMany({
      include: {
        rewards: true,
        features: true,
      },
    });

    // Calculate rewards for each card
    const cardsWithRewardsPromises = dbCards.map(async (dbCard) => {
      const card: CreditCard = {
        id: dbCard.id,
        name: dbCard.name,
        rewards: await this.calculateCardRewards({
          ...dbCard,
          rewards: dbCard.rewards,
          features: dbCard.features.map(f => f.description),
        }, categories),
        features: dbCard.features.map(f => f.description),
      };

      const totalRewards = (await this.calculateCardRewards(card, categories))
        .reduce((sum, reward) => sum + reward.amount, 0);

      return { ...card, totalRewards };
    });

    const cardsWithRewards = await Promise.all(cardsWithRewardsPromises);

    // Sort cards by total rewards
    const optimizedCards = cardsWithRewards
      .sort((a: CardWithRewards, b: CardWithRewards) => b.totalRewards - a.totalRewards)
      .map(({ totalRewards, ...card }) => card);

    // Calculate best possible rewards per category
    const potentialRewards = categories.map(category => {
      const bestReward = Math.max(
        ...cardsWithRewards.map(card =>
          card.rewards.find(r => r.category === category.name)?.amount || 0
        )
      );

      return {
        category: category.name,
        amount: bestReward,
      };
    });

    return {
      optimizedCards,
      potentialRewards,
    };
  }
} 