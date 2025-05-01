import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CardListScreen } from '../CardListScreen';
import { useCardStore } from '../../store/cardStore';

// Mock the card store
jest.mock('../../store/cardStore', () => ({
  useCardStore: jest.fn(),
}));

describe('CardListScreen', () => {
  const mockCards = [
    {
      id: 'test-card-1',
      name: 'Test Card 1',
      issuer: 'Test Bank',
      image: 'test.png',
      defaultMultiplier: 1,
      rewards: [{ category: 'dining', multiplier: 3 }],
    },
  ];

  const mockStore = {
    searchQuery: '',
    selectedCards: [],
    getFilteredCards: jest.fn().mockReturnValue(mockCards),
    toggleCard: jest.fn(),
    setSearchQuery: jest.fn(),
  };

  beforeEach(() => {
    (useCardStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<CardListScreen />);
    
    expect(getByPlaceholderText('Search cards...')).toBeTruthy();
    expect(getByText('Test Card 1')).toBeTruthy();
    expect(getByText('Test Bank')).toBeTruthy();
    expect(getByText('3x dining')).toBeTruthy();
  });

  it('handles search input', () => {
    const { getByPlaceholderText } = render(<CardListScreen />);
    const searchInput = getByPlaceholderText('Search cards...');
    
    fireEvent.changeText(searchInput, 'test');
    
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith('test');
  });

  it('handles card selection', () => {
    const { getByText } = render(<CardListScreen />);
    const card = getByText('Test Card 1');
    
    fireEvent.press(card);
    
    expect(mockStore.toggleCard).toHaveBeenCalledWith('test-card-1');
  });
}); 