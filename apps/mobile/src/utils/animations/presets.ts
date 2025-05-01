import { FadeConfig, SlideConfig, TransformConfig, SequenceConfig } from './types';

export const fadeIn: FadeConfig = {
  direction: 'in',
  duration: 300,
};

export const fadeOut: FadeConfig = {
  direction: 'out',
  duration: 300,
};

export const slideInLeft: SlideConfig = {
  direction: 'right',
  distance: 100,
  duration: 300,
};

export const slideInRight: SlideConfig = {
  direction: 'left',
  distance: 100,
  duration: 300,
};

export const slideInUp: SlideConfig = {
  direction: 'down',
  distance: 100,
  duration: 300,
};

export const slideInDown: SlideConfig = {
  direction: 'up',
  distance: 100,
  duration: 300,
};

export const scaleIn: TransformConfig = {
  scale: {
    initialValue: 0,
    finalValue: 1,
    duration: 300,
  },
};

export const scaleOut: TransformConfig = {
  scale: {
    initialValue: 1,
    finalValue: 0,
    duration: 300,
  },
};

export const rotate360: TransformConfig = {
  rotate: {
    initialValue: 0,
    finalValue: 360,
    duration: 1000,
    unit: 'deg',
  },
};

// Spring animations
export const springIn: TransformConfig = {
  scale: {
    initialValue: 0.3,
    finalValue: 1,
    duration: 400,
    damping: 10,
    stiffness: 100,
  },
};

// Combined animations
export const popIn: TransformConfig = {
  scale: {
    initialValue: 0.5,
    finalValue: 1,
    duration: 300,
  },
  rotate: {
    initialValue: -30,
    finalValue: 0,
    duration: 300,
    unit: 'deg',
  },
};

// Card-specific animations
export const cardExpandAnimation: SequenceConfig = {
  animations: [
    {
      type: 'transform',
      config: {
        scale: {
          initialValue: 1,
          finalValue: 1.05,
          duration: 200,
        },
      },
    },
    {
      type: 'transform',
      config: {
        translateY: {
          initialValue: 0,
          finalValue: -50,
          duration: 300,
        },
      },
      delay: 100,
    },
  ],
};

export const cardCollapseAnimation: SequenceConfig = {
  animations: [
    {
      type: 'transform',
      config: {
        translateY: {
          initialValue: -50,
          finalValue: 0,
          duration: 200,
        },
      },
    },
    {
      type: 'transform',
      config: {
        scale: {
          initialValue: 1.05,
          finalValue: 1,
          duration: 300,
        },
      },
      delay: 100,
    },
  ],
};

export const cardSwipeAnimation: TransformConfig = {
  translateX: {
    initialValue: 0,
    finalValue: -400,
    duration: 300,
  },
  rotate: {
    initialValue: 0,
    finalValue: -15,
    duration: 300,
    unit: 'deg',
  },
};

export const cardStackAnimation: SequenceConfig = {
  animations: [
    {
      type: 'transform',
      config: {
        translateY: {
          initialValue: 0,
          finalValue: 10,
          duration: 200,
        },
        scale: {
          initialValue: 1,
          finalValue: 0.95,
          duration: 200,
        },
      },
    },
    {
      type: 'transform',
      config: {
        translateY: {
          initialValue: 10,
          finalValue: 0,
          duration: 150,
        },
        scale: {
          initialValue: 0.95,
          finalValue: 1,
          duration: 150,
        },
      },
      delay: 50,
    },
  ],
};

export const cardFlipAnimation: SequenceConfig = {
  animations: [
    {
      type: 'transform',
      config: {
        scale: {
          initialValue: 1,
          finalValue: 0.9,
          duration: 150,
        },
        rotate: {
          initialValue: 0,
          finalValue: 90,
          duration: 300,
          unit: 'deg',
        },
      },
    },
    {
      type: 'transform',
      config: {
        scale: {
          initialValue: 0.9,
          finalValue: 1,
          duration: 150,
        },
        rotate: {
          initialValue: -90,
          finalValue: 0,
          duration: 300,
          unit: 'deg',
        },
      },
      delay: 300,
    },
  ],
};

// Reward category animations
export const rewardHighlightAnimation: TransformConfig = {
  scale: {
    initialValue: 1,
    finalValue: 1.1,
    duration: 200,
  },
  translateY: {
    initialValue: 0,
    finalValue: -5,
    duration: 200,
  },
}; 