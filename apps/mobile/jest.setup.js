// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  Searchbar: 'Searchbar',
  Card: {
    Content: 'Card.Content',
  },
  Text: 'Text',
  Checkbox: 'Checkbox',
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      surface: '#ffffff',
      primary: '#000000',
    },
  }),
}));

// Mock React Native
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

jest.mock('react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  setAccessibilityFocus: jest.fn(),
  announceForAccessibility: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.PlatformConstants = {
    interfaceIdiom: 'phone',
  };
  return {
    ...RN,
    StyleSheet: {
      create: (styles) => styles,
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
  };
}); 