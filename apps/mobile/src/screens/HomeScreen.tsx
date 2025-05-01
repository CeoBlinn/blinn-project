import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, IconButton, MD3Colors } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useSpendingStore } from '../stores/spending';
import { formatCurrency } from '../utils/format';
import { AnimatedView } from '../utils/animated';
import { useAnimation } from '../utils/animations/hooks';
import { fadeIn, slideInRight } from '../utils/animations/presets';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { getTotalMonthlySpend, getTotalAnnualSpend, categories } = useSpendingStore();

  const { style: fadeStyle } = useAnimation({
    type: 'fade',
    config: fadeIn,
  });

  const { style: slideStyle } = useAnimation({
    type: 'slide',
    config: slideInRight,
  });

  const handleAddSpending = useCallback(() => {
    navigation.navigate('SpendingInput');
  }, [navigation]);

  const handleViewResults = useCallback(() => {
    navigation.navigate('OptimizationResults');
  }, [navigation]);

  const handleOpenSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium">Dashboard</Text>
          <IconButton
            icon="cog"
            size={24}
            onPress={handleOpenSettings}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedView style={[styles.summary, fadeStyle]}>
          <Surface style={styles.summaryCard}>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Monthly Spending
            </Text>
            <Text variant="headlineLarge" style={styles.summaryAmount}>
              {formatCurrency(getTotalMonthlySpend())}
            </Text>
            <Text variant="bodyMedium" style={styles.summarySubtitle}>
              {categories.length} Categories
            </Text>
          </Surface>

          <Surface style={styles.summaryCard}>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Annual Spending
            </Text>
            <Text variant="headlineLarge" style={styles.summaryAmount}>
              {formatCurrency(getTotalAnnualSpend())}
            </Text>
            <Text variant="bodyMedium" style={styles.summarySubtitle}>
              Projected
            </Text>
          </Surface>
        </AnimatedView>

        <AnimatedView style={[styles.actions, slideStyle]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="plus"
              onPress={handleAddSpending}
              style={styles.actionButton}
            >
              Add Spending
            </Button>
            <Button
              mode="contained-tonal"
              icon="chart-bar"
              onPress={handleViewResults}
              style={styles.actionButton}
              disabled={categories.length === 0}
            >
              View Results
            </Button>
          </View>
        </AnimatedView>

        <AnimatedView style={[styles.categories, fadeStyle]}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Recent Categories
            </Text>
            <Button
              mode="text"
              onPress={handleAddSpending}
              disabled={categories.length === 0}
            >
              View All
            </Button>
          </View>
          {categories.length === 0 ? (
            <Surface style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyStateText}>
                No spending categories yet.
              </Text>
              <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
                Add your first category to get started!
              </Text>
              <Button
                mode="contained"
                icon="plus"
                onPress={handleAddSpending}
                style={styles.emptyStateButton}
              >
                Add Category
              </Button>
            </Surface>
          ) : (
            <View style={styles.categoryList}>
              {categories.slice(0, 3).map((category) => (
                <Surface key={category.name} style={styles.categoryCard}>
                  <Text variant="titleMedium">{category.name}</Text>
                  <Text variant="headlineSmall" style={styles.categoryAmount}>
                    {formatCurrency(category.amount)}
                  </Text>
                  <Text variant="bodySmall" style={styles.categoryFrequency}>
                    per {category.frequency}
                  </Text>
                </Surface>
              ))}
            </View>
          )}
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
    paddingHorizontal: 16,
    height: 56,
  },
  content: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: MD3Colors.primary95,
  },
  summaryTitle: {
    color: MD3Colors.primary40,
  },
  summaryAmount: {
    color: MD3Colors.primary30,
    marginVertical: 4,
  },
  summarySubtitle: {
    color: MD3Colors.primary40,
  },
  actions: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  categories: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  categoryAmount: {
    color: MD3Colors.primary40,
    marginVertical: 4,
  },
  categoryFrequency: {
    color: MD3Colors.neutral60,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyStateText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    textAlign: 'center',
    color: MD3Colors.neutral60,
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 200,
  },
}); 