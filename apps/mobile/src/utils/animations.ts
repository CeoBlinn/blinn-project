import { useCallback } from 'react';
import {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import { theme } from '../theme';

type SpringConfigType = Pick<WithSpringConfig, 'mass' | 'damping' | 'stiffness'>;
type TimingConfigType = Pick<WithTimingConfig, 'duration'>;

export const useScaleAnimation = (
  customSpringConfig: Partial<SpringConfigType> = {},
  customTimingConfig: Partial<TimingConfigType> = {}
) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.98, {
      mass: theme.animation.defaultSpringConfig.mass,
      damping: theme.animation.defaultSpringConfig.damping,
      stiffness: theme.animation.defaultSpringConfig.stiffness,
      ...customSpringConfig,
    });
    opacity.value = withTiming(0.9, {
      duration: theme.animation.defaultTimingConfig.duration,
      ...customTimingConfig,
    });
  }, [customSpringConfig, customTimingConfig]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, {
      mass: theme.animation.defaultSpringConfig.mass,
      damping: theme.animation.defaultSpringConfig.damping,
      stiffness: theme.animation.defaultSpringConfig.stiffness,
      ...customSpringConfig,
    });
    opacity.value = withTiming(1, {
      duration: theme.animation.defaultTimingConfig.duration,
      ...customTimingConfig,
    });
  }, [customSpringConfig, customTimingConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    scale,
    opacity,
    onPressIn,
    onPressOut,
    animatedStyle,
  };
};

export const springConfig: Record<string, SpringConfigType> = {
  light: {
    damping: 15,
    mass: 0.8,
    stiffness: 120,
  },
  medium: {
    damping: 10,
    mass: 1,
    stiffness: 100,
  },
  heavy: {
    damping: 20,
    mass: 1.2,
    stiffness: 80,
  },
};

export const timingConfig: Record<string, TimingConfigType> = {
  fast: {
    duration: 150,
  },
  medium: {
    duration: 250,
  },
  slow: {
    duration: 350,
  },
}; 