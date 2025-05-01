import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, MD3Colors } from 'react-native-paper';
import { useAnalyticsStore } from '../stores/analytics';
import { formatCurrency } from '../utils/format';

interface CategoryInsightsProps {
  categoryId: string;
}

export const CategoryInsights: React.FC<CategoryInsightsProps> = ({ categoryId }) => {
  const insights = useAnalyticsStore((state) => state.getCategoryInsights(categoryId));

  if (!insights || insights.usageCount === 0) {
    return null;
  }

  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="titleMedium" style={styles.title}>
        Spending Insights
      </Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text variant="bodyMedium" style={styles.label}>
            Average Spend
          </Text>
          <Text variant="titleMedium" style={styles.value}>
            {formatCurrency(insights.averageAmount)}
          </Text>
          <Text variant="bodySmall" style={styles.frequency}>
            per {insights.preferredFrequency}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text variant="bodyMedium" style={styles.label}>
            Last Amount
          </Text>
          <Text variant="titleMedium" style={styles.value}>
            {formatCurrency(insights.lastUsedAmount)}
          </Text>
          <Text variant="bodySmall" style={styles.frequency}>
            {insights.usageCount} entries
          </Text>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: MD3Colors.primary95,
  },
  title: {
    marginBottom: 12,
    color: MD3Colors.primary40,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gridItem: {
    alignItems: 'center',
  },
  label: {
    color: MD3Colors.primary40,
    marginBottom: 4,
  },
  value: {
    color: MD3Colors.primary30,
  },
  frequency: {
    color: MD3Colors.primary40,
    marginTop: 2,
  },
}); 