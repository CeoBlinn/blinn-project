import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  Modal,
} from 'react-native';
import {
  Searchbar,
  Card as PaperCard,
  Text,
  Checkbox,
  Surface,
  SegmentedButtons,
  IconButton,
  Menu,
} from 'react-native-paper';
import Animated, {
  FadeInUp,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@blinn/common/src/types/card';
import { useCardStore } from '../store/cardStore';
import { theme } from '../theme';
import { useScaleAnimation, springConfig, timingConfig } from '../utils/animations';
import type { SortOption } from '../store/cardStore';
import { CardDetailScreen } from './CardDetailScreen';

const AnimatedView = Animated.createAnimatedComponent(View);

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'name', label: 'Name' },
  { value: 'issuer', label: 'Issuer' },
  { value: 'rewards', label: 'Best Rewards' },
];

export const CardListScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const {
    searchQuery,
    selectedCards,
    sortOption,
    sortOrder,
    isRefreshing,
    getFilteredCards,
    toggleCard,
    setSearchQuery,
    setSortOption,
    setSortOrder,
    refreshCards,
  } = useCardStore();

  const filteredCards = getFilteredCards();

  const toggleSortOrder = useCallback(() => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }, [sortOrder, setSortOrder]);

  const handleCardPress = useCallback((card: Card) => {
    setSelectedCard(card);
  }, []);

  const renderCard: ListRenderItem<Card> = ({ item, index }) => {
    const { onPressIn, onPressOut, animatedStyle } = useScaleAnimation(
      springConfig.medium,
      timingConfig.fast
    );

    return (
      <AnimatedView
        entering={FadeInUp.delay(index * 50).springify()}
        exiting={FadeOutDown}
        layout={Layout.springify()}
        style={[styles.cardWrapper, animatedStyle]}
      >
        <Pressable
          onPress={() => handleCardPress(item)}
          onLongPress={() => toggleCard(item.id)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <PaperCard style={styles.card} mode="elevated">
            <PaperCard.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    {item.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.issuer}>
                    {item.issuer}
                  </Text>
                </View>
                <Checkbox
                  status={selectedCards.includes(item.id) ? 'checked' : 'unchecked'}
                  color={theme.colors.primary}
                />
              </View>
              <Surface style={styles.rewardsContainer} elevation={0}>
                {item.rewards.map((reward) => (
                  <View key={reward.category} style={styles.rewardTag}>
                    <Text variant="labelMedium" style={styles.rewardText}>
                      {reward.multiplier}x {reward.category}
                    </Text>
                  </View>
                ))}
                {item.defaultMultiplier > 1 && (
                  <View style={styles.rewardTag}>
                    <Text variant="labelMedium" style={styles.rewardText}>
                      {item.defaultMultiplier}x everything else
                    </Text>
                  </View>
                )}
              </Surface>
            </PaperCard.Content>
          </PaperCard>
        </Pressable>
      </AnimatedView>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.titleRow}>
          <Text variant="headlineMedium" style={styles.title}>
            My Cards
          </Text>
          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={
              <IconButton
                icon={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
                onPress={toggleSortOrder}
                mode="contained"
                selected={sortOption !== 'default'}
              />
            }
          >
            {sortOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setSortOption(option.value);
                  setShowSortMenu(false);
                }}
                title={option.label}
                leadingIcon={sortOption === option.value ? 'check' : undefined}
              />
            ))}
          </Menu>
        </View>
        <Searchbar
          placeholder="Search cards..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          elevation={0}
          mode="bar"
          icon="credit-card-search"
          iconColor={theme.colors.primary}
        />
      </Surface>
      <FlatList
        data={filteredCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshCards}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
      
      <Modal
        visible={selectedCard !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedCard(null)}
      >
        {selectedCard && (
          <CardDetailScreen
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </Modal>
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  searchBar: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
  },
  searchInput: {
    fontSize: 16,
  },
  list: {
    padding: theme.spacing.md,
  },
  cardWrapper: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  issuer: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  rewardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  rewardTag: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.roundness,
  },
  rewardText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
}); 