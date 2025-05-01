import { PrismaClient } from '@prisma/client';
import { 
  SpendingCategory, 
  CreditCard, 
  CardReward, 
  DbCreditCard,
  CardWithRewards,
  DbReward,
  DbFeature
} from '../types/optimization';

const prisma = new PrismaClient();

// Remove the AVAILABLE_CARDS constant as we're using the database now

export class OptimizationService {
  private calculateAnnualAmount(category: SpendingCategory): number {
    return category.frequency === 'monthly' 
      ? category.amount * 12 
      : category.amount;
  }

  private calculateCardRewards(
    card: DbCreditCard,
    categories: SpendingCategory[]
  ): CardReward[] {
    return categories.map((category: SpendingCategory) => {
      const annualAmount = this.calculateAnnualAmount(category);
      const cardReward = card.rewards.find((reward: DbReward) => 
        reward.category.toLowerCase() === category.name.toLowerCase()
      ) || card.rewards.find((reward: DbReward) => reward.category === 'Other');

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
    // Get all cards from database with their rewards and features
    const dbCards = await prisma.$queryRaw<DbCreditCard[]>`
      WITH card_data AS (
        SELECT 
          c.id,
          c.name,
          c.issuer,
          c."createdAt",
          c."updatedAt",
          json_agg(
            DISTINCT jsonb_build_object(
              'id', r.id,
              'category', r.category,
              'amount', r.amount,
              'creditCardId', r."creditCardId"
            )
          ) FILTER (WHERE r.id IS NOT NULL) as rewards,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', f.id,
              'description', f.description,
              'creditCardId', f."creditCardId"
            )
          ) FILTER (WHERE f.id IS NOT NULL) as features
        FROM "CreditCard" c
        LEFT JOIN "Reward" r ON r."creditCardId" = c.id
        LEFT JOIN "Feature" f ON f."creditCardId" = c.id
        GROUP BY c.id
      )
      SELECT 
        id,
        name,
        issuer,
        "createdAt",
        "updatedAt",
        COALESCE(rewards, '[]'::json) as rewards,
        COALESCE(features, '[]'::json) as features
      FROM card_data;
    `;

    // Calculate rewards for each card
    const cardsWithRewards: CardWithRewards[] = await Promise.all(
      dbCards.map(async (dbCard: DbCreditCard) => {
        const cardRewards = this.calculateCardRewards(dbCard, categories);
        
        const card: CreditCard = {
          id: dbCard.id,
          name: dbCard.name,
          rewards: cardRewards,
          features: dbCard.features.map((feature: DbFeature) => feature.description),
        };

        const totalRewards = cardRewards.reduce(
          (sum: number, reward: CardReward) => sum + reward.amount, 
          0
        );

        return { ...card, totalRewards };
      })
    );

    // Sort cards by total rewards
    const optimizedCards = cardsWithRewards
      .sort((a: CardWithRewards, b: CardWithRewards) => b.totalRewards - a.totalRewards)
      .map(({ totalRewards, ...card }: CardWithRewards): CreditCard => card);

    // Calculate best possible rewards per category
    const potentialRewards = categories.map((category: SpendingCategory) => {
      const bestReward = Math.max(
        ...cardsWithRewards.map((card: CardWithRewards) =>
          card.rewards.find((reward: CardReward) => reward.category === category.name)?.amount || 0
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