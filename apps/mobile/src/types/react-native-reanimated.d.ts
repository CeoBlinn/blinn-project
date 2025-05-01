import 'react-native-reanimated';
import { ViewProps, TextProps } from 'react-native';
import { PaperProps, SurfaceProps, TextProps as PaperTextProps } from 'react-native-paper';

declare module 'react-native-reanimated' {
  export interface WithTimingConfig {
    duration?: number;
    easing?: EasingFunction;
    damping?: number;
    stiffness?: number;
    mass?: number;
    velocity?: number;
  }

  export interface AnimateProps<T extends object> extends T {
    animatedStyle?: AnimatedStyle;
  }

  export interface AnimatedStyle {
    [key: string]: any;
  }

  export interface SharedValue<T> {
    value: T;
  }

  export type EasingFunction = (x: number) => number;

  export interface AnimatedComponentProps<T extends object> extends AnimateProps<T> {
    style?: AnimatedStyle | Array<AnimatedStyle>;
  }

  export interface AnimatedViewProps extends AnimatedComponentProps<ViewProps> {}
  export interface AnimatedTextProps extends AnimatedComponentProps<TextProps> {}
  export interface AnimatedSurfaceProps extends AnimatedComponentProps<SurfaceProps> {}
  export interface AnimatedPaperTextProps extends AnimatedComponentProps<PaperTextProps> {}

  export function createAnimatedComponent<P extends object>(
    component: React.ComponentType<P>
  ): React.ComponentType<AnimateProps<P>>;

  export function withTiming<T>(
    toValue: T,
    config?: WithTimingConfig,
    callback?: (finished?: boolean) => void
  ): T;

  export function useAnimatedStyle<T extends AnimatedStyle>(
    updater: () => T,
    dependencies?: ReadonlyArray<any>
  ): T;
} 