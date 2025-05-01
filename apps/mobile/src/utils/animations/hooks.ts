import { useCallback, useEffect, useState } from 'react';
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  WithTimingConfig,
  withSpring,
  withDelay,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { 
  FadeConfig, 
  SlideConfig, 
  TransformConfig, 
  UseAnimationProps,
  SequenceConfig,
  ParallelConfig,
  GestureConfig
} from './types';

const DEFAULT_CONFIG: WithTimingConfig = {
  duration: 300,
};

export const useFadeAnimation = (config?: FadeConfig) => {
  const opacity = useSharedValue(config?.direction === 'in' ? 0 : 1);

  const animate = useCallback(() => {
    opacity.value = withTiming(
      config?.direction === 'in' ? 1 : 0,
      config || DEFAULT_CONFIG
    );
  }, [config, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    animate();
  }, [animate]);

  return { style, animate };
};

export const useSlideAnimation = (config?: SlideConfig) => {
  const distance = config?.distance || 100;
  const translateX = useSharedValue(
    config?.direction === 'right' ? -distance : 
    config?.direction === 'left' ? distance : 0
  );
  const translateY = useSharedValue(
    config?.direction === 'down' ? -distance : 
    config?.direction === 'up' ? distance : 0
  );

  const animate = useCallback(() => {
    translateX.value = withTiming(0, config || DEFAULT_CONFIG);
    translateY.value = withTiming(0, config || DEFAULT_CONFIG);
  }, [config, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  useEffect(() => {
    animate();
  }, [animate]);

  return { style, animate };
};

export const useTransformAnimation = (config?: TransformConfig) => {
  const scale = useSharedValue(config?.scale?.initialValue || 1);
  const rotate = useSharedValue(config?.rotate?.initialValue || 0);

  const animate = useCallback(() => {
    if (config?.scale) {
      scale.value = withTiming(
        config.scale.finalValue || 1,
        config.scale || DEFAULT_CONFIG
      );
    }
    if (config?.rotate) {
      rotate.value = withTiming(
        config.rotate.finalValue || 0,
        config.rotate || DEFAULT_CONFIG
      );
    }
  }, [config, scale, rotate]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}${config?.rotate?.unit || 'deg'}` },
    ],
  }));

  useEffect(() => {
    animate();
  }, [animate]);

  return { style, animate };
};

export const useSequenceAnimation = (config?: SequenceConfig) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue(0);

  const animate = useCallback(() => {
    if (!config?.animations.length) return;

    const runAnimation = (index: number) => {
      if (index >= config.animations.length) {
        progress.value = 1;
        return;
      }

      const animation = config.animations[index];
      const delay = animation.delay || 0;
      const duration = 
        'duration' in animation.config ? animation.config.duration : DEFAULT_CONFIG.duration;

      progress.value = withDelay(
        delay,
        withTiming(
          (index + 1) / config.animations.length,
          { duration },
          (finished) => {
            if (finished) {
              runOnJS(setCurrentIndex)(index + 1);
              runOnJS(runAnimation)(index + 1);
            }
          }
        )
      );
    };

    runAnimation(0);
  }, [config, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1,
  }));

  useEffect(() => {
    animate();
  }, [animate]);

  return {
    style,
    animate,
    progress: progress.value,
    currentIndex,
  };
};

export const useParallelAnimation = (config?: ParallelConfig) => {
  const progress = useSharedValue(0);

  const animate = useCallback(() => {
    if (!config?.animations.length) return;

    progress.value = withTiming(1, DEFAULT_CONFIG);
  }, [config, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1,
  }));

  useEffect(() => {
    animate();
  }, [animate]);

  return {
    style,
    animate,
    progress: progress.value,
  };
};

type AnimatedGestureContext = {
  [key: string]: number;
  startY: number;
};

export const useGestureAnimation = (config?: GestureConfig) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue<AnimatedGestureContext>({ startY: 0 });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: AnimatedGestureContext) => {
      ctx.startY = translateY.value;
    },
    onActive: (event: { translationY: number }, ctx: AnimatedGestureContext) => {
      const newY = ctx.startY + event.translationY;
      const resistance = config?.resistance || 0.5;
      const threshold = config?.threshold || 100;

      if (Math.abs(newY) > threshold) {
        translateY.value = withSpring(
          newY > 0 ? threshold : -threshold,
          { damping: 20, stiffness: 90 }
        );
      } else {
        translateY.value = newY * resistance;
      }
    },
    onEnd: (event: { velocityY: number }) => {
      const velocity = event.velocityY;
      const snapPoints = config?.snapPoints || [0];
      const nearestPoint = snapPoints.reduce((prev, curr) => 
        Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value) ? curr : prev
      );

      translateY.value = withSpring(nearestPoint, {
        velocity,
        damping: 20,
        stiffness: 90,
      });
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return {
    style,
    gestureHandler,
    translateY,
  };
};

export const useAnimation = ({ type, config, enabled = true }: UseAnimationProps) => {
  if (!enabled) {
    return { style: {}, animate: () => {} };
  }

  switch (type) {
    case 'fade':
      return useFadeAnimation(config as FadeConfig);
    case 'slide':
      return useSlideAnimation(config as SlideConfig);
    case 'transform':
      return useTransformAnimation(config as TransformConfig);
    case 'sequence':
      return useSequenceAnimation(config as SequenceConfig);
    case 'parallel':
      return useParallelAnimation(config as ParallelConfig);
    case 'gesture':
      return useGestureAnimation(config as GestureConfig);
    default:
      return { style: {}, animate: () => {} };
  }
}; 