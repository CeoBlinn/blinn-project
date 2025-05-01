import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useCardStore } from '../cardStore';
import seedCards from '../../data/seed_cards.json';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('cardStore', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    const store = useCardStore.getState();
    store.selectedCards = [];
    store.searchQuery = '';
    await flushPromises();
  });

  it('initializes with seed cards', async () => {
    const { allCards } = useCardStore.getState();
    expect(allCards).toEqual(seedCards.cards);
  });

  it('toggles card selection', async () => {
    const store = useCardStore.getState();
    const cardId = seedCards.cards[0].id;

    await act(async () => {
      store.toggleCard(cardId);
      await flushPromises();
    });

    expect(store.selectedCards).toContain(cardId);

    await act(async () => {
      store.toggleCard(cardId);
      await flushPromises();
    });

    expect(store.selectedCards).not.toContain(cardId);
  });

  it('filters cards by search query', async () => {
    const store = useCardStore.getState();

    await act(async () => {
      store.setSearchQuery('chase');
      await flushPromises();
    });

    const filteredCards = store.getFilteredCards();
    expect(filteredCards.length).toBe(1);
    expect(filteredCards[0].name).toContain('Chase');
  });

  it('persists state to AsyncStorage', async () => {
    const store = useCardStore.getState();
    const cardId = seedCards.cards[0].id;

    await act(async () => {
      store.toggleCard(cardId);
      store.setSearchQuery('test');
      await flushPromises();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.slice(-1)[0];
    const savedState = JSON.parse(lastCall[1]);

    expect(savedState.state.selectedCards).toContain(cardId);
    expect(savedState.state.searchQuery).toBe('test');
  });

  it('loads persisted state from AsyncStorage', async () => {
    const mockState = {
      state: {
        selectedCards: [seedCards.cards[0].id],
        searchQuery: 'test',
        allCards: seedCards.cards,
      },
      version: 0,
    };

    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify(mockState))
    );

    await act(async () => {
      // Reset the store to trigger loading from storage
      useCardStore.setState({
        selectedCards: [],
        searchQuery: '',
        allCards: [],
      });
      await flushPromises();
    });

    const store = useCardStore.getState();
    expect(store.selectedCards).toContain(seedCards.cards[0].id);
    expect(store.searchQuery).toBe('test');
  });
}); 