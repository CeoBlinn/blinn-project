import { WithTimingConfig } from 'react-native-reanimated';

export interface AnimationConfig extends WithTimingConfig {
  initialValue?: number;
  finalValue?: number;
}

export interface TransformConfig {
  scale?: AnimationConfig;
  translateX?: AnimationConfig;
  translateY?: AnimationConfig;
  rotate?: AnimationConfig & { unit?: 'deg' | 'rad' };
}

export interface FadeConfig extends AnimationConfig {
  direction: 'in' | 'out';
}

export interface SlideConfig extends AnimationConfig {
  direction: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

export interface GestureConfig {
  enabled?: boolean;
  threshold?: number;
  resistance?: number;
  snapPoints?: number[];
}

export interface SequenceConfig {
  animations: Array<{
    type: AnimationType;
    config: FadeConfig | TransformConfig | SlideConfig;
    delay?: number;
  }>;
}

export interface ParallelConfig {
  animations: Array<{
    type: AnimationType;
    config: FadeConfig | TransformConfig | SlideConfig;
  }>;
}

export type AnimationType = 
  | 'fade' 
  | 'scale' 
  | 'slide' 
  | 'transform' 
  | 'sequence'
  | 'parallel'
  | 'gesture';

export interface UseAnimationProps {
  type: AnimationType;
  config?: FadeConfig | TransformConfig | SlideConfig | SequenceConfig | ParallelConfig | GestureConfig;
  enabled?: boolean;
} 