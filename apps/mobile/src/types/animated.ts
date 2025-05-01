import { ComponentType } from 'react';
import { View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import Animated from 'react-native-reanimated';

type WithAnimatedComponent<T extends ComponentType<any>> = ComponentType<
  Animated.AnimateProps<React.ComponentProps<T>>
>;

export const createAnimatedComponent = <T extends ComponentType<any>>(
  component: T
): WithAnimatedComponent<T> => Animated.createAnimatedComponent(component);

// Pre-create commonly used animated components
export const AnimatedView = createAnimatedComponent(View);
export const AnimatedText = createAnimatedComponent(Text);
export const AnimatedSurface = createAnimatedComponent(Surface); 