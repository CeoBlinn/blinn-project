import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Text,
  Button,
  IconButton,
  Surface,
  ProgressBar,
  Chip,
  MD3Colors,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useSpendingStore } from '../stores/spending';
import { useOptimizationStore } from '../stores/optimization';
import { formatCurrency } from '../utils/format';
import { AnimatedView } from '../utils/animated';
import { useAnimation } from '../utils/animations/hooks';
import { fadeIn, slideInRight } from '../utils/animations/presets';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CardReward {
  category: string;
  amount: number;
}

interface CreditCard {
  id: string;
  name: string;
  rewards: CardReward[];
  features: string[];
}

export const OptimizationResultsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { getTotalAnnualSpend, categories } = useSpendingStore();
  const { optimizedCards, potentialRewards } = useOptimizationStore();

  const { style: fadeStyle } = useAnimation({
    type: 'fade',
    config: fadeIn,
  });

  const { style: slideStyle } = useAnimation({
    type: 'slide',
    config: slideInRight,
  });

  const totalAnnualSpend = getTotalAnnualSpend();
  
  const annualRewards = useMemo(() => {
    return potentialRewards.reduce((total, reward) => total + reward.amount, 0);
  }, [potentialRewards]);

  const rewardRate = useMemo(() => {
    return totalAnnualSpend > 0 ? (annualRewards / totalAnnualSpend) * 100 : 0;
  }, [annualRewards, totalAnnualSpend]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEditSpending = useCallback(() => {
    navigation.navigate('SpendingInput');
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton icon="arrow-left" size={24} onPress={handleBack} />
          <Text variant="headlineMedium">Optimization Results</Text>
          <View style={{ width: 48 }} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedView style={[styles.summary, fadeStyle]}>
          <Surface style={styles.summaryCard}>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              Potential Annual Rewards
            </Text>
            <Text variant="displaySmall" style={styles.rewardsAmount}>
              {formatCurrency(annualRewards)}
            </Text>
            <View style={styles.rateContainer}>
              <Text variant="titleMedium" style={styles.rateText}>
                {rewardRate.toFixed(1)}% Back
              </Text>
              <ProgressBar
                progress={rewardRate / 100}
                color={MD3Colors.primary40}
                style={styles.progressBar}
              />
            </View>
          </Surface>
        </AnimatedView>

        <AnimatedView style={[styles.recommendations, slideStyle]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recommended Cards
          </Text>
          {optimizedCards.map((card, index) => (
            <Surface key={card.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{card.name}</Text>
                <Chip mode="outlined" style={styles.rankChip}>
                  #{index + 1}
                </Chip>
              </View>
              
              <View style={styles.rewardsBreakdown}>
                <Text variant="titleSmall" style={styles.breakdownTitle}>
                  Annual Rewards Breakdown
                </Text>
                {card.rewards.map((reward) => (
                  <View key={reward.category} style={styles.rewardItem}>
                    <Text variant="bodyMedium">{reward.category}</Text>
                    <Text variant="bodyMedium" style={styles.rewardAmount}>
                      {formatCurrency(reward.amount)}
                    </Text>
                  </View>
                ))}
                <View style={styles.totalReward}>
                  <Text variant="titleMedium">Total</Text>
                  <Text variant="titleMedium" style={styles.totalAmount}>
                    {formatCurrency(
                      card.rewards.reduce((sum, r) => sum + r.amount, 0)
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFeatures}>
                {card.features.map((feature) => (
                  <View key={feature} style={styles.featureItem}>
                    <IconButton icon="check-circle" size={20} />
                    <Text variant="bodyMedium">{feature}</Text>
                  </View>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={() => {}}
                style={styles.applyButton}
              >
                Learn More
              </Button>
            </Surface>
          ))}
        </AnimatedView>

        <AnimatedView style={[styles.spending, fadeStyle]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Your Spending Profile
          </Text>
          <Surface style={styles.spendingCard}>
            <Text variant="titleMedium" style={styles.spendingTitle}>
              Annual Spending by Category
            </Text>
            {categories.map((category) => (
              <View key={category.name} style={styles.categoryItem}>
                <Text variant="bodyMedium">{category.name}</Text>
                <Text variant="bodyMedium">
                  {formatCurrency(
                    category.frequency === 'monthly'
                      ? category.amount * 12
                      : category.amount
                  )}
                </Text>
              </View>
            ))}
            <View style={styles.totalSpending}>
              <Text variant="titleMedium">Total</Text>
              <Text variant="titleMedium">
                {formatCurrency(totalAnnualSpend)}
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={handleEditSpending}
              style={styles.editButton}
            >
              Edit Spending
            </Button>
          </Surface>
        </AnimatedView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  content: {
    flex: 1,
  },
  summary: {
    padding: 16,
  },
  summaryCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: MD3Colors.primary95,
  },
  summaryTitle: {
    color: MD3Colors.primary40,
    marginBottom: 8,
  },
  rewardsAmount: {
    color: MD3Colors.primary30,
    marginBottom: 16,
  },
  rateContainer: {
    marginTop: 8,
  },
  rateText: {
    color: MD3Colors.primary40,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  recommendations: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  cardContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankChip: {
    backgroundColor: MD3Colors.primary95,
  },
  rewardsBreakdown: {
    marginBottom: 16,
  },
  breakdownTitle: {
    marginBottom: 8,
    color: MD3Colors.neutral60,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rewardAmount: {
    color: MD3Colors.primary40,
  },
  totalReward: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: MD3Colors.neutral90,
  },
  totalAmount: {
    color: MD3Colors.primary40,
  },
  cardFeatures: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  applyButton: {
    marginTop: 8,
  },
  spending: {
    padding: 16,
    paddingBottom: 32,
  },
  spendingCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  spendingTitle: {
    marginBottom: 16,
    color: MD3Colors.neutral60,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalSpending: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: MD3Colors.neutral90,
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
  },
}); 