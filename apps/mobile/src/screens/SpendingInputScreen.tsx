import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  IconButton,
  TextInput,
  SegmentedButtons,
  Button,
  Surface,
  MD3Colors,
  IconButtonProps,
  TextInputProps,
  ButtonProps,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SPENDING_CATEGORIES } from '../constants/categories';
import { useSpendingStore } from '../stores/spending';
import { useOptimizationStore } from '../stores/optimization';
import { AnimatedView } from '../utils/animated';
import { useAnimation } from '../utils/animations/hooks';
import { fadeIn, slideInRight } from '../utils/animations/presets';
import { formatCurrency, parseCurrencyInput, stripCurrency, isValidCurrencyAmount } from '../utils/format';
import { useAnalyticsStore } from '../stores/analytics';
import { CategoryInsights } from '../components/CategoryInsights';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  OptimizationResults: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SpendingInputScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');

  const {
    categories,
    activeCategory,
    addCategory,
    updateCategory,
    setActiveCategory,
    getTotalMonthlySpend,
    getTotalAnnualSpend,
  } = useSpendingStore();

  const { setSpendingProfile, optimize } = useOptimizationStore();

  const { style: fadeStyle } = useAnimation({
    type: 'fade',
    config: fadeIn,
  });

  const { style: slideStyle } = useAnimation({
    type: 'slide',
    config: slideInRight,
  });

  const handleCategoryPress = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const { suggestedAmount, suggestedFrequency } = useAnalyticsStore.getState().getSmartDefaults(categoryId);
    const existingCategory = categories.find((c) => c.name === categoryId);
    
    if (existingCategory) {
      setAmount(existingCategory.amount.toString());
      setFrequency(existingCategory.frequency);
    } else if (suggestedAmount > 0) {
      setAmount(formatCurrency(suggestedAmount));
      setFrequency(suggestedFrequency);
    } else {
      setAmount('');
      setFrequency('monthly');
    }
  }, [categories, setActiveCategory]);

  const handleAmountChange = useCallback((text: string) => {
    const formatted = parseCurrencyInput(text);
    setAmount(formatted);
  }, []);

  const handleSave = useCallback(() => {
    if (!activeCategory || !amount || !isValidCurrencyAmount(amount)) return;

    const category = {
      name: activeCategory,
      amount: parseFloat(stripCurrency(amount)),
      frequency,
    };

    if (categories.some((c) => c.name === activeCategory)) {
      updateCategory(activeCategory, category);
    } else {
      addCategory(category);
    }

    // Update analytics
    useAnalyticsStore.getState().updateCategoryAnalytics(category);

    setActiveCategory(null);
    setAmount('');
  }, [activeCategory, amount, frequency, addCategory, updateCategory, setActiveCategory]);

  const handleOptimize = useCallback(() => {
    const totalAnnualSpend = getTotalAnnualSpend();
    setSpendingProfile({
      categories,
      totalAnnualSpend,
    });
    optimize().then(() => {
      navigation.navigate('OptimizationResults');
    });
  }, [categories, getTotalAnnualSpend, setSpendingProfile, optimize, navigation]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall">Spending Profile</Text>
          <IconButton
            icon="information"
            size={24}
            onPress={() => {}}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AnimatedView style={[styles.summary, fadeStyle]}>
          <View style={styles.totalContainer}>
            <Text variant="titleMedium">Monthly Spending</Text>
            <Text variant="headlineMedium" style={styles.totalAmount}>
              {formatCurrency(getTotalMonthlySpend())}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text variant="titleMedium">Annual Spending</Text>
            <Text variant="headlineMedium" style={styles.totalAmount}>
              {formatCurrency(getTotalAnnualSpend())}
            </Text>
          </View>
        </AnimatedView>

        <AnimatedView style={[styles.categories, slideStyle]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Categories
          </Text>
          <View style={styles.categoryGrid}>
            {SPENDING_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              const hasValue = categories.some((c) => c.name === category.id);

              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <View
                    style={[
                      styles.categoryCard,
                      isActive && styles.activeCard,
                      { backgroundColor: category.color + '20' },
                    ]}
                  >
                    <IconButton
                      icon={category.icon}
                      size={24}
                      iconColor={category.color}
                    />
                    <Text variant="bodyMedium">{category.name}</Text>
                    {hasValue && (
                      <View style={[styles.indicator, { backgroundColor: category.color }]} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </AnimatedView>

        {activeCategory && (
          <AnimatedView style={[styles.inputSection, fadeStyle]}>
            <Text variant="titleMedium" style={styles.inputTitle}>
              Enter Amount
            </Text>
            <TextInput
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="$0.00"
              error={amount !== '' && !isValidCurrencyAmount(amount)}
              left={<TextInput.Affix text="" />}
              maxLength={12}
            />
            {amount !== '' && !isValidCurrencyAmount(amount) && (
              <Text style={styles.errorText} variant="bodySmall">
                Please enter a valid amount between $0 and $1,000,000
              </Text>
            )}
            <SegmentedButtons
              value={frequency}
              onValueChange={(value) => setFrequency(value as 'monthly' | 'yearly')}
              buttons={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              style={styles.segmentedButtons}
            />
            <CategoryInsights categoryId={activeCategory} />
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Save Category
            </Button>
          </AnimatedView>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Button
          mode="contained"
          onPress={handleOptimize}
          disabled={categories.length === 0}
          style={styles.optimizeButton}
        >
          Find Best Cards
        </Button>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 8,
    height: 56,
  },
  scrollView: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 16,
  },
  totalContainer: {
    alignItems: 'center',
  },
  totalAmount: {
    marginTop: 4,
    color: MD3Colors.primary60,
  },
  categories: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 48) / 3,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 1,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: MD3Colors.primary60,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputSection: {
    padding: 16,
    marginTop: 16,
  },
  inputTitle: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  optimizeButton: {
    borderRadius: 12,
  },
  errorText: {
    color: MD3Colors.error50,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },
}); 