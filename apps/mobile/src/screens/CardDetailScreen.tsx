import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  Surface,
  Text,
  IconButton,
  ProgressBar,
  List,
  Divider,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { Card } from '@blinn/common/src/types/card';
import { theme } from '../theme';
import { useScaleAnimation, springConfig } from '../utils/animations';
import { AnimatedSurface, AnimatedText } from '../utils/animated';

const { width } = Dimensions.get('window');

interface CardDetailScreenProps {
  card: Card;
  onClose: () => void;
}

export const CardDetailScreen: React.FC<CardDetailScreenProps> = ({
  card,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { onPressIn, onPressOut, animatedStyle } = useScaleAnimation(
    springConfig.light
  );

  const renderRewardCategory = useCallback(
    (reward: Card['rewards'][0], index: number) => {
      const percentage = (reward.multiplier / Math.max(...card.rewards.map(r => r.multiplier))) * 100;
      
      return (
        <AnimatedSurface
          key={reward.category}
          style={[styles.rewardCard]}
          elevation={1}
          entering={FadeInDown.delay(index * 100)}
        >
          <View style={styles.rewardHeader}>
            <Text variant="titleMedium" style={styles.rewardCategory}>
              {reward.category}
            </Text>
            <Text variant="headlineMedium" style={styles.multiplier}>
              {reward.multiplier}x
            </Text>
          </View>
          <ProgressBar
            progress={percentage / 100}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          {reward.details && (
            <Text variant="bodySmall" style={styles.rewardDetails}>
              {reward.details}
            </Text>
          )}
        </AnimatedSurface>
      );
    },
    [card.rewards]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={onClose}
          />
          <Text variant="headlineSmall" style={styles.title}>
            Card Details
          </Text>
          <IconButton
            icon="star-outline"
            size={24}
            onPress={() => {}}
          />
        </View>
      </Surface>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedSurface
          style={[styles.cardPreview, animatedStyle]}
          elevation={2}
          entering={FadeIn}
        >
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <View style={styles.cardHeader}>
              <View>
                <AnimatedText
                  variant="headlineMedium"
                  style={styles.cardName}
                  entering={FadeInDown.delay(200)}
                >
                  {card.name}
                </AnimatedText>
                <AnimatedText
                  variant="titleSmall"
                  style={styles.issuer}
                  entering={FadeInDown.delay(300)}
                >
                  {card.issuer}
                </AnimatedText>
              </View>
            </View>
          </Pressable>
        </AnimatedSurface>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Rewards
          </Text>
          <View style={styles.rewardsGrid}>
            {card.rewards.map((reward, index) => renderRewardCategory(reward, index))}
          </View>
          {card.defaultMultiplier > 1 && (
            <AnimatedSurface
              style={[styles.defaultReward]}
              elevation={1}
              entering={FadeInDown.delay(card.rewards.length * 100)}
            >
              <Text variant="titleMedium">
                {card.defaultMultiplier}x on everything else
              </Text>
            </AnimatedSurface>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Card Information
          </Text>
          <List.Section>
            <List.Item
              title="Annual Fee"
              description={card.annualFee ? `$${card.annualFee}` : 'None'}
              left={props => <List.Icon {...props} icon="currency-usd" />}
            />
            <Divider />
            <List.Item
              title="Foreign Transaction Fee"
              description={card.foreignTransactionFee ? `${card.foreignTransactionFee}%` : 'None'}
              left={props => <List.Icon {...props} icon="earth" />}
            />
            <Divider />
            <List.Item
              title="Sign-up Bonus"
              description={card.signupBonus || 'None'}
              left={props => <List.Icon {...props} icon="gift" />}
            />
          </List.Section>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.roundness,
    borderBottomRightRadius: theme.roundness,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    height: 56,
  },
  title: {
    color: theme.colors.onSurface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  cardPreview: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardName: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  issuer: {
    color: theme.colors.surface,
    opacity: 0.8,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  rewardsGrid: {
    gap: theme.spacing.md,
  },
  rewardCard: {
    padding: theme.spacing.md,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  rewardCategory: {
    color: theme.colors.onSurface,
    flex: 1,
  },
  multiplier: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceVariant,
  },
  rewardDetails: {
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.sm,
  },
  defaultReward: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
}); 