import { View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import Animated, {
  withTiming,
  useAnimatedStyle,
  WithTimingConfig,
  createAnimatedComponent
} from 'react-native-reanimated';

// Export animated components
export const AnimatedView = createAnimatedComponent(View);
export const AnimatedText = createAnimatedComponent(Text);
export const AnimatedSurface = createAnimatedComponent(Surface);

// Common animation configurations
export const DEFAULT_ANIMATION_CONFIG: WithTimingConfig = {
  duration: 300,
};

// Helper functions for common animations
export const fadeIn = (duration = 300) => {
  return withTiming(1, { duration });
};

export const fadeOut = (duration = 300) => {
  return withTiming(0, { duration });
};

export const scaleIn = (duration = 300) => {
  return withTiming(1, { duration });
};

export const scaleOut = (duration = 300) => {
  return withTiming(0, { duration });
};

// Helper type for animated style props
export type AnimatedStyleProp = {
  transform?: Array<{
    scale?: number;
    translateX?: number;
    translateY?: number;
    rotate?: string;
  }>;
  opacity?: number;
  backgroundColor?: string;
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}; 