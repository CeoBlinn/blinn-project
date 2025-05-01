import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.feature.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.creditCard.deleteMany();

  // Chase Sapphire Preferred
  const chaseSapphire = await prisma.creditCard.create({
    data: {
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      rewards: {
        create: [
          { category: 'Travel', amount: 0.05 },
          { category: 'Dining', amount: 0.03 },
          { category: 'Streaming', amount: 0.03 },
          { category: 'Online Grocery', amount: 0.03 },
          { category: 'Other', amount: 0.01 },
        ],
      },
      features: {
        create: [
          { description: 'No foreign transaction fees' },
          { description: '60,000 point sign-up bonus' },
          { description: 'Primary rental car insurance' },
          { description: 'Trip cancellation/interruption insurance' },
          { description: '1:1 point transfer to travel partners' },
        ],
      },
    },
  });

  // Amex Gold
  const amexGold = await prisma.creditCard.create({
    data: {
      name: 'American Express Gold Card',
      issuer: 'American Express',
      rewards: {
        create: [
          { category: 'Dining', amount: 0.04 },
          { category: 'Groceries', amount: 0.04 },
          { category: 'Travel', amount: 0.03 },
          { category: 'Other', amount: 0.01 },
        ],
      },
      features: {
        create: [
          { description: '$120 dining credit' },
          { description: '$120 Uber Cash ($10/month)' },
          { description: '60,000 point welcome bonus' },
          { description: 'No foreign transaction fees' },
          { description: 'Trip delay insurance' },
        ],
      },
    },
  });

  // Capital One Venture X
  const ventureX = await prisma.creditCard.create({
    data: {
      name: 'Capital One Venture X',
      issuer: 'Capital One',
      rewards: {
        create: [
          { category: 'Travel (Capital One Portal)', amount: 0.10 },
          { category: 'Travel', amount: 0.05 },
          { category: 'Other', amount: 0.02 },
        ],
      },
      features: {
        create: [
          { description: '$300 annual travel credit' },
          { description: '75,000 mile welcome bonus' },
          { description: 'Priority Pass lounge access' },
          { description: 'Cell phone protection' },
          { description: 'Primary rental car coverage' },
        ],
      },
    },
  });

  // Citi Double Cash
  const citiDouble = await prisma.creditCard.create({
    data: {
      name: 'Citi Double Cash Card',
      issuer: 'Citi',
      rewards: {
        create: [
          { category: 'Other', amount: 0.02 }, // 1% when you buy + 1% when you pay
        ],
      },
      features: {
        create: [
          { description: 'No annual fee' },
          { description: '0% intro APR on balance transfers' },
          { description: 'Contactless payments' },
          { description: 'Virtual card numbers' },
        ],
      },
    },
  });

  console.log('Database has been seeded with credit card data! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 