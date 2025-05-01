import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import type { MD3TypescaleKey } from 'react-native-paper/lib/typescript/types';

type FontConfig = {
  [key in MD3TypescaleKey]: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    letterSpacing: number;
    lineHeight: number;
  };
};

const fontConfig: FontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

export type CustomColors = {
  success: string;
  successContainer: string;
  warning: string;
  warningContainer: string;
};

export type ExtendedTheme = MD3Theme & {
  colors: MD3Theme['colors'] & CustomColors;
  animation: {
    scale: number;
    defaultSpringConfig: {
      damping: number;
      mass: number;
      stiffness: number;
    };
    defaultTimingConfig: {
      duration: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

export const theme: ExtendedTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb', // Modern blue
    primaryContainer: '#dbeafe',
    secondary: '#4f46e5', // Indigo
    secondaryContainer: '#e0e7ff',
    tertiary: '#7c3aed', // Violet
    tertiaryContainer: '#ede9fe',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#f1f5f9',
    error: '#ef4444',
    errorContainer: '#fee2e2',
    success: '#22c55e',
    successContainer: '#dcfce7',
    warning: '#f59e0b',
    warningContainer: '#fef3c7',
  },
  fonts: configureFonts({ config: fontConfig }),
  animation: {
    scale: 1.0,
    defaultSpringConfig: {
      damping: 10,
      mass: 1,
      stiffness: 100,
    },
    defaultTimingConfig: {
      duration: 250,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: 16,
};

export const getSpacing = (size: keyof ExtendedTheme['spacing']) => theme.spacing[size];

export const getAnimationConfig = () => ({
  spring: theme.animation.defaultSpringConfig,
  timing: theme.animation.defaultTimingConfig,
});

export const elevations = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
}; 