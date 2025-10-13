import { withTiming } from 'react-native-reanimated';
import { toastDefaultValues } from './constants';
import { useToastContext } from './context';
import { easeInOutCubic, easeOutQuartFn } from './easings';
import type { ToastPosition } from './types';

export const ANIMATION_DURATION = 600;

export const useToastLayoutAnimations = (
  positionProp: ToastPosition | undefined,
  isHiddenByLimit?: boolean,
  numberOfToasts?: number
) => {
  const { position: positionCtx } = useToastContext();
  const position = positionProp || positionCtx;

  return {
    entering: () => {
      'worklet';
      return getToastEntering({ position });
    },
    exiting: () => {
      'worklet';
      return getToastExiting({ position, isHiddenByLimit, numberOfToasts });
    },
  };
};

type GetToastAnimationParams = {
  position: ToastPosition;
  isHiddenByLimit?: boolean;
  numberOfToasts?: number;
};

export const getToastEntering = ({ position }: GetToastAnimationParams) => {
  'worklet';

  const animations = {
    opacity: withTiming(1, {
      easing: easeOutQuartFn,
      duration: ANIMATION_DURATION,
    }),
    transform: [
      {
        translateY: withTiming(0, {
          easing: easeOutQuartFn,
          duration: ANIMATION_DURATION,
        }),
      },
    ],
  };

  const translateY = (() => {
    if (position === 'top-center') {
      return -20;
    }

    if (position === 'bottom-center') {
      return 50;
    }

    return 0;
  })();

  const initialValues = {
    opacity: 0,
    transform: [
      {
        translateY,
      },
    ],
  };

  return {
    initialValues,
    animations,
  };
};

export const getToastExiting = ({
  position,
  isHiddenByLimit,
  numberOfToasts,
}: GetToastAnimationParams) => {
  'worklet';

  // If toast is hidden by visibility limit, only fade out without sliding
  if (isHiddenByLimit) {
    const animations = {
      opacity: withTiming(0, {
        easing: easeInOutCubic,
        duration: ANIMATION_DURATION,
      }),
    };

    const initialValues = {
      opacity: 1,
    };

    return {
      initialValues,
      animations,
    };
  }

  const stackGap = toastDefaultValues.stackGap;

  // Determine slide distance based on number of visible toasts
  const getSlideDistance = () => {
    // If only 1 toast, slide fully
    if (numberOfToasts === 1) {
      if (position === 'top-center') {
        return -150;
      }
      if (position === 'bottom-center') {
        return 150;
      }
      return 50;
    }

    // If more than 1 toast, only slide by stackGap
    if (position === 'top-center') {
      return -stackGap;
    }
    if (position === 'bottom-center') {
      return stackGap;
    }
    return stackGap;
  };

  const translateY = getSlideDistance();

  const animations = {
    opacity: withTiming(0, { easing: easeInOutCubic }),
    transform: [
      {
        translateY: withTiming(translateY, {
          easing: easeInOutCubic,
        }),
      },
    ],
  };

  const initialValues = {
    opacity: 1,
    transform: [
      {
        translateY: 0,
      },
    ],
  };

  return {
    initialValues,
    animations,
  };
};
